"""
Ollama AI Provider Service for PrepSpire AI
Real inference using Ollama's local API (chat/generate endpoints).
"""
import logging
import httpx
import json
from typing import Optional, List, Dict, Any

from app.core.config import settings

logger = logging.getLogger(__name__)

OLLAMA_TIMEOUT = 90.0  # seconds


async def check_ollama_health() -> Dict[str, Any]:
    """Check if Ollama is running and the configured model is available."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"{settings.OLLAMA_BASE_URL}/api/tags")
            if resp.status_code == 200:
                data = resp.json()
                available_models = [m.get("name", "") for m in data.get("models", [])]
                model_name = settings.OLLAMA_MODEL
                # Match with or without tag
                model_available = any(
                    model_name == m or model_name.split(":")[0] == m.split(":")[0]
                    for m in available_models
                )
                return {
                    "available": True,
                    "model_ready": model_available,
                    "model": model_name,
                    "available_models": available_models
                }
    except Exception as e:
        logger.warning(f"Ollama health check failed: {e}")
    return {"available": False, "model_ready": False, "model": settings.OLLAMA_MODEL, "available_models": []}


async def _resolve_active_model(preferred: Optional[str] = None) -> str:
    """Resolve model name, falling back to installed model if preferred is not found."""
    target = (preferred or settings.OLLAMA_MODEL).strip()
    try:
        health = await check_ollama_health()
        if health.get("available") and health.get("available_models"):
            models = health["available_models"]
            # Exact match
            if target in models:
                return target
            # Match with or without tag (e.g. qwen2.5:7b vs qwen2.5)
            target_base = target.split(":")[0]
            for m in models:
                if m == target or target_base in m or m.startswith(target_base):
                    return m
            # If target not found in installed models, use first installed model
            if models:
                logger.info(f"Target model '{target}' not present in Ollama; auto-routing to installed '{models[0]}'")
                return models[0]
    except Exception as e:
        logger.warning(f"Model resolution check failed: {e}")
    return target


async def call_ollama_chat(
    messages: List[Dict[str, str]],
    temperature: float = 0.7,
    max_tokens: int = 1500,
    model: Optional[str] = None
) -> Optional[str]:
    """
    Call Ollama chat API with conversation history.
    Uses /api/chat endpoint (supports message history).
    """
    model_name = await _resolve_active_model(model)
    url = f"{settings.OLLAMA_BASE_URL}/api/chat"

    payload = {
        "model": model_name,
        "messages": messages,
        "stream": False,
        "options": {
            "temperature": temperature,
            "num_predict": max_tokens,
            "top_p": 0.9,
            "repeat_penalty": 1.1,
        }
    }

    try:
        async with httpx.AsyncClient(timeout=OLLAMA_TIMEOUT) as client:
            response = await client.post(url, json=payload)
            if response.status_code == 200:
                data = response.json()
                content = data.get("message", {}).get("content", "")
                if content:
                    return content.strip()
                logger.warning(f"Ollama returned empty content: {data}")
            else:
                logger.warning(f"Ollama API error {response.status_code}: {response.text[:300]}")
    except httpx.TimeoutException:
        logger.warning(f"Ollama request timed out after {OLLAMA_TIMEOUT}s")
    except httpx.ConnectError:
        logger.warning("Ollama connection refused — is Ollama running?")
    except Exception as e:
        logger.warning(f"Ollama call failed: {e}")
    return None


async def call_ollama_generate(
    prompt: str,
    temperature: float = 0.7,
    max_tokens: int = 1500,
    model: Optional[str] = None
) -> Optional[str]:
    """
    Call Ollama generate API (single-turn, simpler).
    Fallback if chat endpoint unavailable.
    """
    model_name = await _resolve_active_model(model)
    url = f"{settings.OLLAMA_BASE_URL}/api/generate"

    payload = {
        "model": model_name,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": temperature,
            "num_predict": max_tokens,
        }
    }

    try:
        async with httpx.AsyncClient(timeout=OLLAMA_TIMEOUT) as client:
            response = await client.post(url, json=payload)
            if response.status_code == 200:
                data = response.json()
                return data.get("response", "").strip() or None
            logger.warning(f"Ollama generate error {response.status_code}")
    except Exception as e:
        logger.warning(f"Ollama generate failed: {e}")
    return None


async def ollama_evaluate_answer(
    question_text: str,
    user_answer: str,
    role: str,
    category: str,
    conversation_history: Optional[List[Dict[str, str]]] = None
) -> Optional[Dict[str, Any]]:
    """
    Use Ollama to evaluate an interview answer and return structured JSON feedback.
    """
    system_prompt = f"""You are an expert technical interviewer and career coach evaluating a candidate for a {role} position.

Your evaluation must be:
- Specific to THIS exact answer (not generic)
- Role-appropriate for {role} ({category} interview)
- Honest and constructive, not uniformly positive
- Based on technical accuracy for technical questions
- Based on STAR method and clarity for behavioral/HR questions

You MUST return ONLY valid JSON with no markdown, no explanation text before or after."""

    evaluation_prompt = f"""Evaluate this interview answer:

Role: {role}
Category: {category}
Question: {question_text}
Candidate's Answer: {user_answer}

Evaluate these dimensions specific to the answer given:
- Overall quality and completeness
- Technical accuracy (for technical questions) or behavioral structure (for HR/behavioral)
- Clarity and communication
- What was actually good about THIS specific answer
- What specific concepts or details were MISSING from THIS answer

Return ONLY this JSON (no other text):
{{
  "overall_score": <0-100, based on actual answer quality>,
  "relevance_score": <0-100>,
  "technical_score": <0-100>,
  "clarity_score": <0-100>,
  "structure_score": <0-100>,
  "communication_score": <0-100>,
  "terminology_score": <0-100>,
  "strengths": ["<specific strength observed in this answer>", ...],
  "missing_concepts": ["<specific concept missing from this answer>", ...],
  "improvement_suggestions": ["<specific actionable tip>", ...],
  "sample_improved_answer": "<a better version of what the candidate said>",
  "follow_up_question": "<a follow-up based specifically on what the candidate just said>"
}}"""

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": evaluation_prompt}
    ]

    # Add recent conversation context if available
    if conversation_history:
        # Insert history between system and current user message
        messages = [{"role": "system", "content": system_prompt}]
        for h in conversation_history[-3:]:
            messages.append(h)
        messages.append({"role": "user", "content": evaluation_prompt})

    raw = await call_ollama_chat(messages, temperature=0.3, max_tokens=1200)
    if not raw:
        return None

    # Parse JSON from response
    try:
        clean = raw.strip()
        # Strip markdown code blocks if present
        if "```json" in clean:
            clean = clean.split("```json")[1].split("```")[0].strip()
        elif "```" in clean:
            clean = clean.split("```")[1].split("```")[0].strip()
        # Find JSON object
        start = clean.find("{")
        end = clean.rfind("}") + 1
        if start >= 0 and end > start:
            clean = clean[start:end]
        parsed = json.loads(clean)
        parsed["evaluation_mode"] = "ollama"
        parsed.setdefault("filler_words", [])
        parsed.setdefault("filler_count", 0)
        parsed.setdefault("words_per_minute", 0.0)
        return parsed
    except json.JSONDecodeError as e:
        logger.warning(f"Failed to parse Ollama evaluation JSON: {e}\nRaw: {raw[:300]}")
        return None


async def ollama_generate_questions(
    role: str,
    interview_type: str,
    difficulty: str,
    count: int,
    exclude_questions: Optional[List[str]] = None,
    experience_level: str = "Fresher"
) -> Optional[List[str]]:
    """
    Use Ollama to generate fresh, role-specific interview questions.
    """
    exclude_str = ""
    if exclude_questions and len(exclude_questions) > 0:
        # Only send a sample of recent exclusions to avoid huge prompts
        sample = exclude_questions[-20:]
        exclude_str = f"\n\nDo NOT generate any of these already-used questions:\n" + "\n".join(f"- {q}" for q in sample)

    role_guidance = _get_role_specific_guidance(role)

    system_prompt = f"""You are an expert technical interviewer generating interview questions for a {role} position.
You MUST generate questions that are:
1. Specifically relevant to the {role} role — NOT generic software questions unless role is Software Developer
2. Appropriate for {difficulty} difficulty and {experience_level} candidates
3. Different from each other (no repetition)
4. Clear and direct — one concept per question{exclude_str}

{role_guidance}"""

    type_guidance = {
        "Technical": f"Generate {count} purely technical questions about concepts, tools, and skills specific to {role}.",
        "HR": f"Generate {count} HR/behavioral questions about workplace situations, teamwork, goals, and character.",
        "Behavioral": f"Generate {count} behavioral questions using STAR format triggers about real experiences.",
        "Mixed": f"Generate {count} questions: {count//2 + count%2} technical (role-specific) and {count//2} behavioral. Interleave them."
    }

    user_prompt = f"""{type_guidance.get(interview_type, type_guidance['Mixed'])}

Requirements:
- Role: {role}
- Interview Type: {interview_type}
- Difficulty: {difficulty}
- Candidate Level: {experience_level}

Return ONLY a JSON array of exactly {count} question strings. No numbering, no extra text:
["question 1", "question 2", ...]"""

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

    raw = await call_ollama_chat(messages, temperature=0.85, max_tokens=1000)
    if not raw:
        return None

    try:
        clean = raw.strip()
        if "```json" in clean:
            clean = clean.split("```json")[1].split("```")[0].strip()
        elif "```" in clean:
            clean = clean.split("```")[1].split("```")[0].strip()
        start = clean.find("[")
        end = clean.rfind("]") + 1
        if start >= 0 and end > start:
            clean = clean[start:end]
        questions = json.loads(clean)
        if isinstance(questions, list):
            # Filter out excluded and deduplicate
            filtered = []
            exclude_lower = {q.lower() for q in (exclude_questions or [])}
            for q in questions:
                if isinstance(q, str) and q.strip() and q.strip().lower() not in exclude_lower:
                    filtered.append(q.strip())
            return filtered[:count]
    except json.JSONDecodeError as e:
        logger.warning(f"Failed to parse Ollama questions JSON: {e}\nRaw: {raw[:300]}")
    return None


async def ollama_generate_follow_up(
    question: str,
    user_answer: str,
    role: str,
    category: str,
    previous_questions: Optional[List[str]] = None
) -> Optional[str]:
    """
    Generate a smart follow-up question based on the candidate's actual answer.
    """
    prev_str = ""
    if previous_questions:
        prev_str = f"\n\nPrevious questions already asked:\n" + "\n".join(f"- {q}" for q in previous_questions[-5:])

    messages = [
        {"role": "system", "content": f"""You are a {role} interviewer conducting a {category} interview.
Generate ONE intelligent follow-up question based specifically on what the candidate just said.

Rules:
- The follow-up MUST be based on the candidate's actual answer (what they said or didn't say)
- Do NOT ask a completely unrelated question
- If the answer was vague, ask for specifics
- If the answer missed a key concept, probe that concept
- If the answer was strong, challenge them with a harder related scenario
- Keep it concise — one question only
- Do NOT repeat previous questions{prev_str}"""},
        {"role": "user", "content": f"""Original question: {question}
Candidate's answer: {user_answer}

Generate exactly ONE follow-up question (just the question, no preamble):"""}
    ]

    raw = await call_ollama_chat(messages, temperature=0.7, max_tokens=200)
    if raw:
        # Clean up the response
        q = raw.strip().strip('"').strip("'")
        # Remove any leading numbering
        import re
        q = re.sub(r'^[\d]+\.\s*', '', q)
        return q if len(q) > 10 else None
    return None


async def ollama_career_coach(
    user_message: str,
    profile_summary: Dict[str, Any],
    performance_summary: Dict[str, Any],
    conversation_history: Optional[List[Dict[str, str]]] = None
) -> Optional[str]:
    """
    Use Ollama to power the AI Career Coach with full conversation context.
    """
    system_prompt = f"""You are PrepSpire AI Career Coach — an expert technical interview mentor and career strategist.

Candidate Profile:
- Name: {profile_summary.get('display_name', 'Student')}
- Target Role: {profile_summary.get('target_role', 'Software Developer')}
- Experience Level: {profile_summary.get('experience_level', 'Fresher')}
- Known Skills: {', '.join(profile_summary.get('known_skills', []) or ['Not specified'])}
- Target Skills: {', '.join(profile_summary.get('target_skills', []) or ['Not specified'])}

Performance Data:
- Completed Interviews: {performance_summary.get('completed_interviews', 0)}
- Average Score: {performance_summary.get('average_interview_score', 0)}/100
- Weakest Area: {performance_summary.get('weakest_subject', 'Not identified')}

Instructions:
- Understand the FULL context and intent of the message, not just keywords
- Provide specific, actionable advice tailored to their role and level
- Reference their performance data when relevant
- Maintain conversation continuity — reference prior messages
- Be warm but substantive — not just generic encouragement
- Use markdown formatting with headers and bullet points when helpful"""

    messages = [{"role": "system", "content": system_prompt}]

    # Add conversation history (limited to last 10 exchanges)
    if conversation_history:
        for msg in conversation_history[-10:]:
            messages.append(msg)

    messages.append({"role": "user", "content": user_message})

    return await call_ollama_chat(messages, temperature=0.6, max_tokens=1500)


def _get_role_specific_guidance(role: str) -> str:
    """Return role-specific interview guidance for question generation."""
    role_lower = role.lower()

    if any(x in role_lower for x in ["data analyst", "bi analyst", "business analyst"]):
        return """Focus on: SQL queries, Excel/pandas data manipulation, statistical analysis, 
data visualization (Tableau/Power BI), A/B testing, hypothesis testing, cleaning messy datasets, 
communicating insights to non-technical stakeholders, pivot tables, regression analysis."""

    elif any(x in role_lower for x in ["ai", "ml", "machine learning", "deep learning", "data science"]):
        return """Focus on: supervised/unsupervised learning, model training and evaluation, 
overfitting/underfitting, neural networks, gradient descent, feature engineering, 
model deployment, transformers, embeddings, RAG pipelines, Python ML libraries."""

    elif any(x in role_lower for x in ["hr", "human resources", "talent", "recruiter"]):
        return """Focus on: recruitment strategies, employee engagement, conflict resolution, 
onboarding processes, performance management, labor laws, workplace culture, 
diversity and inclusion, salary negotiations, retention strategies."""

    elif any(x in role_lower for x in ["sales", "business development", "account"]):
        return """Focus on: lead generation, objection handling, negotiation, CRM tools, 
sales pipeline management, customer acquisition, closing techniques, 
quota attainment, upselling/cross-selling, customer relationship management."""

    elif any(x in role_lower for x in ["business operations", "operations manager", "process"]):
        return """Focus on: process optimization, KPIs and metrics, resource allocation, 
vendor management, cross-functional coordination, reporting and analysis, 
workflow automation, operational bottlenecks, SLAs, budget management."""

    elif any(x in role_lower for x in ["frontend", "front-end", "ui developer", "react developer"]):
        return """Focus on: React hooks, Virtual DOM, CSS flexbox/grid, JavaScript event loop, 
TypeScript, responsive design, web performance (LCP/CLS/FID), 
browser APIs, state management, accessibility, bundlers."""

    elif any(x in role_lower for x in ["backend", "back-end", "api developer", "java developer", "python developer"]):
        return """Focus on: REST API design, database indexing, caching strategies, 
authentication/authorization, microservices, message queues, SQL optimization, 
concurrency, error handling, security best practices."""

    elif any(x in role_lower for x in ["devops", "cloud", "sre", "infrastructure"]):
        return """Focus on: CI/CD pipelines, Docker/Kubernetes, infrastructure as code, 
monitoring and alerting, cloud services (AWS/Azure/GCP), incident management, 
load balancing, blue-green deployments, security hardening."""

    elif any(x in role_lower for x in ["full stack", "fullstack"]):
        return """Focus on: both frontend (React, TypeScript) and backend (APIs, databases), 
authentication flows, state management, database design, performance optimization, 
deployment, end-to-end architecture decisions."""

    else:
        return """Focus on: core programming concepts, data structures and algorithms, 
system design basics, debugging approaches, version control, 
software development lifecycle, problem-solving methodology."""
