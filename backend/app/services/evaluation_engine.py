import re
from typing import Dict, Any, List, Tuple

FILLER_WORDS = [
    "um", "uh", "like", "you know", "actually", "basically",
    "literally", "sort of", "kind of", "i mean", "right", "so yeah"
]

STAR_MARKERS = {
    "situation": ["when i was", "at my previous", "in my project", "during my college", "situation was", "in my team"],
    "task": ["my task was", "i was responsible for", "the goal was", "i needed to", "the objective was"],
    "action": ["i implemented", "i decided to", "i created", "i designed", "i resolved", "i debugged", "i collaborated"],
    "result": ["as a result", "consequently", "we achieved", "improved by", "successfully delivered", "the outcome was"]
}

TECH_KEYWORDS_MAP = {
    "software developer": ["algorithm", "complexity", "database", "api", "framework", "git", "architecture", "testing", "async", "cache", "microservices", "sql", "oop", "frontend", "backend"],
    "data analyst": ["sql", "tableau", "powerbi", "excel", "pandas", "visualization", "metric", "regression", "cleaning", "pipeline", "hypothesis"],
    "hr specialist": ["onboarding", "retention", "compliance", "culture", "performance", "conflict", "recruitment", "appraisal", "stakeholder"],
    "devops engineer": ["ci/cd", "docker", "kubernetes", "terraform", "pipeline", "monitoring", "prometheus", "aws", "linux", "security"]
}

def analyze_speech_and_text(text: str, duration_seconds: int = 60) -> Dict[str, Any]:
    text_clean = text.strip()
    words = re.findall(r'\b[a-zA-Z0-9_\-\']+\b', text_clean)
    word_count = len(words)
    
    # Calculate WPM
    effective_seconds = max(10, duration_seconds)
    wpm = round((word_count / effective_seconds) * 60, 1) if effective_seconds > 0 else 0.0

    # Filler word detection
    text_lower = text_clean.lower()
    found_fillers = []
    filler_count = 0
    for filler in FILLER_WORDS:
        # Regex word boundary for single/multi word fillers
        pattern = r'\b' + re.escape(filler) + r'\b'
        matches = re.findall(pattern, text_lower)
        if matches:
            found_fillers.append(filler)
            filler_count += len(matches)

    # STAR method detection
    star_found = {}
    for comp, markers in STAR_MARKERS.items():
        star_found[comp] = any(m in text_lower for m in markers)
    has_star = sum(star_found.values()) >= 2

    return {
        "word_count": word_count,
        "wpm": wpm,
        "found_fillers": found_fillers,
        "filler_count": filler_count,
        "star_method_used": has_star,
        "star_breakdown": star_found
    }

def evaluate_interview_answer_offline(
    question_text: str,
    user_answer: str,
    role: str = "Software Developer",
    category: str = "Technical",
    duration_seconds: int = 60
) -> Dict[str, Any]:
    analysis = analyze_speech_and_text(user_answer, duration_seconds)
    word_count = analysis["word_count"]
    filler_count = analysis["filler_count"]
    star_used = analysis["star_method_used"]
    wpm = analysis["wpm"]

    # Basic scoring heuristics
    # Relevance & Length
    if word_count < 15:
        relevance = 35.0
        clarity = 40.0
        technical = 30.0
        structure = 35.0
        communication = 40.0
    elif word_count < 40:
        relevance = 60.0
        clarity = 65.0
        technical = 55.0
        structure = 60.0
        communication = 65.0
    else:
        relevance = 80.0
        clarity = 82.0
        technical = 78.0
        structure = 75.0
        communication = 80.0

    # Bonus for STAR method in behavioral/HR
    if category.lower() in ["behavioral", "hr"] and star_used:
        structure = min(95.0, structure + 12.0)
        relevance = min(95.0, relevance + 8.0)

    # Terminology bonus
    role_key = role.lower()
    target_keywords = TECH_KEYWORDS_MAP.get(role_key, TECH_KEYWORDS_MAP["software developer"])
    terms_matched = [term for term in target_keywords if term in user_answer.lower()]
    term_score = min(95.0, 50.0 + len(terms_matched) * 9.0)

    # Filler word penalty
    if filler_count > 4:
        clarity = max(30.0, clarity - (filler_count * 2.5))
        communication = max(35.0, communication - (filler_count * 2.0))

    overall = round((relevance * 0.25 + technical * 0.25 + clarity * 0.20 + structure * 0.15 + communication * 0.15), 1)

    strengths = []
    missing_concepts = []
    suggestions = []

    if word_count >= 50:
        strengths.append("Nice! You gave a detailed answer with good depth. 👍")
    if terms_matched:
        strengths.append(f"Great use of tech terms: {', '.join(terms_matched[:4])}. Shows you know your stuff! 💡")
    if star_used:
        strengths.append("You used the STAR method well — interviewers love this structure! ⭐")

    if not strengths:
        strengths.append("Good start — you got straight to the point! 💪")

    if word_count < 40:
        missing_concepts.append("Try adding a quick example or story to make your answer stronger.")
        suggestions.append("Aim for 60-100 words — just a couple more sentences can make a big difference!")
    if filler_count >= 3:
        suggestions.append(f"You said '{', '.join(analysis['found_fillers'])}' a few times. Tip: pause silently instead — it sounds more confident! 🎯")
    if not terms_matched and category.lower() == "technical":
        missing_concepts.append("Drop in a few tech terms or tool names — it shows you know the topic.")
        suggestions.append("Mention things like time complexity, design patterns, or specific tools you've used.")

    sample_improved = (
        f"Here's how I'd answer this: First, I'd explain the main idea simply. "
        f"Then I'd walk through my approach step by step — what I considered, what I chose, and why. "
        f"Finally, I'd mention the result or what I learned from it."
    )

    return {
        "overall_score": overall,
        "relevance_score": round(relevance, 1),
        "technical_score": round(technical, 1),
        "clarity_score": round(clarity, 1),
        "structure_score": round(structure, 1),
        "communication_score": round(communication, 1),
        "terminology_score": round(term_score, 1),
        "strengths": strengths,
        "missing_concepts": missing_concepts,
        "improvement_suggestions": suggestions,
        "sample_improved_answer": sample_improved,
        "star_method_used": star_used,
        "filler_words": analysis["found_fillers"],
        "filler_count": filler_count,
        "words_per_minute": wpm,
        "evaluation_mode": "offline"
    }

def evaluate_communication_offline(
    prompt_text: str,
    response_text: str,
    category: str = "Self-introduction",
    duration_seconds: int = 120
) -> Dict[str, Any]:
    analysis = analyze_speech_and_text(response_text, duration_seconds)
    word_count = analysis["word_count"]
    filler_count = analysis["filler_count"]
    wpm = analysis["wpm"]

    relevance = 80.0 if word_count >= 40 else 55.0
    clarity = max(40.0, 85.0 - (filler_count * 3.5))
    structure = 80.0 if "." in response_text and word_count >= 50 else 60.0
    grammar = 78.0
    vocabulary = 75.0 if any(len(w) > 7 for w in response_text.split()) else 65.0
    conciseness = 85.0 if 100 <= wpm <= 160 else 70.0

    overall = round((relevance + clarity + structure + grammar + vocabulary + conciseness) / 6.0, 1)

    strengths = ["Your ideas flowed well — nice job! 🗣️"]
    if analysis["found_fillers"]:
        weaknesses = [f"You used '{', '.join(analysis['found_fillers'])}' a few times. Try pausing silently instead — it sounds way more confident!"]
    else:
        weaknesses = ["Try using more descriptive words to paint a picture for the listener."]

    alt_expressions = [
        "Instead of 'I think that...', try 'In my experience...' — it sounds more sure of yourself!",
        "Instead of 'It was very hard...', try 'It was a real challenge because...' — more specific!"
    ]

    return {
        "overall_score": overall,
        "relevance_score": relevance,
        "clarity_score": clarity,
        "structure_score": structure,
        "grammar_score": grammar,
        "vocabulary_score": vocabulary,
        "conciseness_score": conciseness,
        "filler_words": analysis["found_fillers"],
        "filler_count": filler_count,
        "words_per_minute": wpm,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "alternative_expressions": alt_expressions,
        "improved_sample_answer": "Start with your main point, then give 1-2 quick examples, and wrap up with a clear takeaway. Simple and powerful! ✨",
        "next_step_recommendation": "Next time you want to say 'um', just pause for a second instead. It actually makes you sound more confident! 😊",
        "evaluation_mode": "offline"
    }

def evaluate_jam_offline(
    topic_text: str,
    transcript: str,
    prep_duration: int = 30,
    speaking_duration: int = 60
) -> Dict[str, Any]:
    analysis = analyze_speech_and_text(transcript, speaking_duration)
    word_count = analysis["word_count"]
    filler_count = analysis["filler_count"]
    wpm = analysis["wpm"]

    fluency = max(35.0, min(95.0, 85.0 - (filler_count * 4.0)))
    content = 80.0 if word_count >= 50 else 55.0
    vocab = 75.0 if any(len(w) >= 8 for w in transcript.split()) else 65.0
    grammar = 80.0
    confidence = 82.0 if filler_count <= 2 and word_count >= 45 else 62.0
    time_mgmt = 88.0 if 90 <= wpm <= 150 else 68.0

    total_score = round((fluency + content + vocab + grammar + confidence + time_mgmt) / 6.0, 1)

    strengths = ["You kept talking for the full minute — that takes guts! 💪"]
    improvements = []
    if filler_count > 2:
        improvements.append(f"Try cutting out '{', '.join(analysis['found_fillers'])}' — pause silently instead!")
    if word_count < 45:
        improvements.append("Try adding a quick example or story to fill the full 60 seconds.")

    outline = [
        "1. Start strong: State your opinion right away! 🎯",
        "2. Give 2 examples or reasons (one for, one against works great)",
        "3. End with a memorable closing thought"
    ]

    return {
        "total_score": total_score,
        "fluency_score": fluency,
        "content_score": content,
        "vocab_score": vocab,
        "grammar_score": grammar,
        "confidence_score": confidence,
        "time_management_score": time_mgmt,
        "filler_count": filler_count,
        "strengths": strengths,
        "improvements": improvements or ["Try to keep a steady pace — not too fast, not too slow. You're doing great! 😊"],
        "sample_outline": outline,
        "example_opening": f"When it comes to '{topic_text}', here's what I think is really interesting...",
        "example_closing": f"So in the end, I believe this is all about finding the right balance. And that's what makes it exciting!",
        "next_steps": ["Try this topic again and aim for zero filler words — you'll be amazed at the difference! 🚀"],
        "evaluation_mode": "offline"
    }
