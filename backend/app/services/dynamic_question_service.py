"""
Dynamic Interview Question Generation Service
Generates fresh, role-specific interview questions using AI or intelligent fallback.
Implements semantic similarity detection to avoid question repetition.
"""
import random
import re
import logging
from typing import List, Optional, Set
from app.core.config import settings

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Expanded, role-specific static question banks (used as AI fallback)
# These are intentionally larger and more diverse than the old fresher_questions.py
# ---------------------------------------------------------------------------

ROLE_QUESTION_BANKS = {
    "Data Analyst": {
        "Technical": [
            "Walk me through how you would clean a dataset with 30% missing values before analysis.",
            "How do you detect and handle outliers in a sales dataset using SQL or Python?",
            "What is the difference between RANK(), DENSE_RANK(), and ROW_NUMBER() in SQL? When would you use each?",
            "Explain how you would design an A/B test to measure the impact of a new feature on conversion rate.",
            "How do you calculate and interpret a p-value? What does statistical significance mean in business context?",
            "What is the difference between OLTP and OLAP databases? Give an example of each.",
            "How would you use a pivot table in Excel or pandas to summarize quarterly sales by region?",
            "Explain the difference between correlation and causation with a real business example.",
            "What is a Z-score and how would you use it to identify anomalies in customer spending data?",
            "How do you decide between using a bar chart, line chart, or scatter plot for a given dataset?",
            "Describe the steps you take to validate data quality before reporting to stakeholders.",
            "What is a window function in SQL? Write a query to calculate a 7-day rolling average of sales.",
            "How would you approach analyzing customer churn and identify the top contributing factors?",
            "What is the difference between mean, median, and mode? When is each the best measure of central tendency?",
            "How do you handle duplicate records in a dataset? What SQL query would you write to find them?",
        ],
        "HR": [
            "Tell me about a time you found an unexpected insight in a dataset that changed a business decision.",
            "Describe a situation where your data analysis was challenged by a stakeholder. How did you respond?",
            "How do you explain a complex statistical finding to a non-technical manager?",
            "Tell me about a data project you're most proud of and what impact it had.",
            "How do you prioritize when you have multiple analysis requests with competing deadlines?",
        ],
        "Behavioral": [
            "Describe a time when you identified a data quality issue that others had missed. What did you do?",
            "Tell me about a time you had to work with incomplete or unreliable data. How did you handle it?",
            "Give an example of when your analysis led to a business process improvement.",
        ]
    },

    "AI/ML Engineer": {
        "Technical": [
            "Explain the bias-variance tradeoff and how you would diagnose which problem your model has.",
            "What is the difference between L1 and L2 regularization? When would you choose each?",
            "How does the attention mechanism work in transformer models? Why does it outperform RNNs?",
            "Walk me through how you would handle a highly imbalanced classification dataset (99:1 ratio).",
            "What is the difference between precision, recall, and F1-score? When is recall more critical than precision?",
            "Explain how gradient descent works. What is the difference between batch, mini-batch, and stochastic GD?",
            "What is feature importance in a Random Forest? How would you use it for feature selection?",
            "How would you deploy a machine learning model to production? What infrastructure choices matter?",
            "Explain the concept of overfitting. List three techniques to prevent it in deep neural networks.",
            "What is a confusion matrix and how do you interpret each quadrant for a fraud detection model?",
            "How do embeddings work in NLP? What is the difference between Word2Vec and transformer-based embeddings?",
            "Explain cross-validation. Why is it better than a single train/test split?",
            "What is quantization in model optimization? How does it reduce latency in production inference?",
            "How would you evaluate a recommendation system? What metrics would you use?",
            "What is RAG (Retrieval-Augmented Generation) and how does it address LLM hallucination?",
        ],
        "HR": [
            "Tell me about an ML project where the model performed well in development but poorly in production. What happened?",
            "How do you stay current with rapidly evolving AI/ML research and new model architectures?",
            "Describe how you would explain a machine learning model's predictions to a non-technical business team.",
        ],
        "Behavioral": [
            "Tell me about a time you had to make a critical decision about model selection with limited data.",
            "Describe a situation where you identified and fixed a data leakage issue in a training pipeline.",
            "Give an example of when you advocated for a simpler model over a complex one and why.",
        ]
    },

    "HR Specialist": {
        "Technical": [
            "Walk me through your end-to-end recruitment process for a senior software engineer role.",
            "How do you source passive candidates who aren't actively applying for positions?",
            "What are the key components of an effective 90-day onboarding program for new hires?",
            "How do you measure employee engagement? What tools or surveys would you use?",
            "What is your approach to designing a performance review process that actually motivates employees?",
            "How do you handle a situation where a high-performing employee is consistently late or unengaged?",
            "Explain the difference between job satisfaction and employee engagement. Why does it matter for retention?",
            "How would you investigate a formal complaint of workplace harassment?",
            "What diversity and inclusion initiatives have you implemented or would you recommend?",
            "How do you calculate and reduce employee turnover cost?",
        ],
        "HR": [
            "Tell me about yourself and why you chose a career in human resources.",
            "What motivates you about working in HR, and what aspect do you find most challenging?",
            "Where do you see the HR function evolving in the next 5 years with AI and automation?",
        ],
        "Behavioral": [
            "Describe a time you had to deliver difficult news to an employee (like a performance improvement plan or termination).",
            "Tell me about a conflict between two team members that you helped resolve successfully.",
            "Give an example of when you had to influence a senior leader to change a people practice or policy.",
            "Describe a time you had to recruit for a hard-to-fill technical role under time pressure.",
        ]
    },

    "Sales Executive": {
        "Technical": [
            "Walk me through your complete sales process from initial prospecting to closing a deal.",
            "How do you research and qualify a prospect before making first contact?",
            "What CRM tools have you used and how do you manage your pipeline in them?",
            "How do you handle the objection: 'Your product is too expensive compared to your competitor'?",
            "What is your approach to upselling or cross-selling to existing accounts?",
            "How do you calculate and track your win rate, average deal size, and sales cycle length?",
            "Describe your cold outreach strategy — email, LinkedIn, calls. What works best and why?",
            "How do you identify decision-makers and navigate complex buying committees in enterprise sales?",
            "What is consultative selling and how does it differ from product-led selling?",
            "How do you handle a prospect who goes silent after multiple follow-ups?",
        ],
        "HR": [
            "Tell me about yourself and what drives you to work in sales.",
            "What is your proudest sales achievement and what made it special?",
            "How do you stay motivated when you're in a prolonged sales slump?",
        ],
        "Behavioral": [
            "Tell me about the largest or most complex deal you have ever closed. What was your strategy?",
            "Describe a time you lost a deal you were confident you would win. What did you learn?",
            "Give an example of when you turned a dissatisfied customer into a long-term advocate.",
            "Tell me about a time you had to sell a product you personally had concerns about.",
        ]
    },

    "Business Operations": {
        "Technical": [
            "How do you identify and prioritize operational bottlenecks in a business process?",
            "Walk me through how you would design a KPI dashboard for a customer support team.",
            "What tools have you used for process documentation (SOPs, flowcharts, RACI matrices)?",
            "How do you manage vendor relationships and ensure SLA compliance?",
            "Describe how you would transition a manual reporting process to an automated one.",
            "What is Six Sigma and how would you apply DMAIC to reduce errors in an order fulfillment process?",
            "How do you calculate and track the operational efficiency of a team or process?",
            "What is your approach to cross-functional project coordination across Sales, Tech, and Finance teams?",
            "How would you evaluate and select a new software tool for the operations team?",
            "Describe your approach to budget planning and cost optimization in an operations context.",
        ],
        "HR": [
            "Tell me about yourself and your background in operations or business management.",
            "What does 'operational excellence' mean to you in practical terms?",
            "How do you manage competing priorities when multiple departments need your attention?",
        ],
        "Behavioral": [
            "Describe a process you redesigned that resulted in significant efficiency gains.",
            "Tell me about a time you had to coordinate a complex initiative involving multiple teams with conflicting priorities.",
            "Give an example of when you caught a critical operational error before it impacted the customer.",
        ]
    },

    "Frontend Developer": {
        "Technical": [
            "Explain how React's reconciliation algorithm works and what triggers a re-render.",
            "What is the difference between useEffect and useLayoutEffect in React?",
            "How do you optimize Core Web Vitals (LCP, CLS, INP) for a React application?",
            "Explain CSS specificity and how the cascade resolves conflicting rules.",
            "What is the difference between flexbox and CSS grid? When would you use each?",
            "How does the JavaScript event loop work? What is the difference between macrotask and microtask queues?",
            "What is hydration in Next.js/React SSR? What are hydration errors and how do you fix them?",
            "How do you implement code splitting and lazy loading in a React application?",
            "What is the difference between controlled and uncontrolled components in React?",
            "How would you implement infinite scroll with pagination in React while keeping performance optimal?",
            "Explain how React's Context API works. When would you use it vs. a state management library like Zustand?",
            "What are Web Workers and when would you use one in a frontend application?",
            "How do you handle accessibility (a11y) in a web application? What ARIA attributes are most important?",
            "Explain the difference between localStorage, sessionStorage, and cookies. When would you use each?",
            "What is TypeScript's type system? Explain interfaces vs type aliases and when to use generics.",
        ],
        "HR": [
            "Tell me about yourself and how you got into frontend development.",
            "What frontend project are you most proud of and what technical challenges did you overcome?",
            "How do you keep up with the rapidly changing JavaScript ecosystem?",
        ],
        "Behavioral": [
            "Describe a time you had to optimize a slow-loading frontend page. What was your process?",
            "Tell me about a cross-browser compatibility issue you encountered and how you resolved it.",
            "Give an example of when you pushed back on a design decision because of technical or accessibility concerns.",
        ]
    },

    "Backend Developer": {
        "Technical": [
            "Design a URL shortening service like bit.ly. What database schema and API endpoints would you create?",
            "How do you prevent SQL injection in a backend API? What is parameterized query best practice?",
            "Explain the CAP theorem. What trade-offs does it impose on distributed databases?",
            "How does JWT authentication work? What are its security vulnerabilities and how do you mitigate them?",
            "What is the N+1 query problem in ORM frameworks? How do you detect and fix it?",
            "Compare Redis and Memcached. When would you choose one over the other for caching?",
            "How do you design an API rate limiter? Compare token bucket vs sliding window algorithms.",
            "What is eventual consistency in distributed systems? Give a real-world example.",
            "How do you structure error handling in a REST API to return meaningful error responses?",
            "Explain database connection pooling. Why is it critical for high-concurrency backend services?",
            "What is the difference between optimistic and pessimistic locking in databases?",
            "How would you implement a background job processing system using a message queue?",
            "Explain database sharding. What problems does it solve and what new problems does it introduce?",
            "How do you implement idempotency in a payment processing API?",
            "What is GraphQL and when would you choose it over a REST API?",
        ],
        "HR": [
            "Tell me about yourself and your journey into backend development.",
            "What backend system are you most proud of building and why?",
            "How do you approach learning a new backend framework or programming language?",
        ],
        "Behavioral": [
            "Describe a production incident you helped diagnose and resolve. Walk me through your debugging process.",
            "Tell me about a time you had to refactor a large, legacy codebase. What was your strategy?",
            "Give an example of when a performance optimization you implemented had unexpected side effects.",
        ]
    },

    "Software Developer": {
        "Technical": [
            "Explain the four pillars of OOP and give a real-world example of each.",
            "What is Big O notation? Compare O(1), O(log n), O(n), and O(n²) with examples.",
            "How does a hash table work internally? How are collisions handled?",
            "Explain recursion with an example. What are its advantages and risks?",
            "What is the difference between a stack and a queue? Give a real application of each.",
            "How does binary search work and why is it O(log n)?",
            "What is the difference between compilation and interpretation in programming languages?",
            "Explain the difference between synchronous and asynchronous programming.",
            "What is a deadlock in multi-threaded programming? How do you prevent it?",
            "What is the difference between SOLID principles? Explain the Single Responsibility Principle with an example.",
            "What is the difference between unit testing, integration testing, and end-to-end testing?",
            "What happens when you type a URL in a browser and press Enter?",
            "What is REST? What are the key constraints of a RESTful API?",
            "How does version control (git) work? What is the difference between git rebase and git merge?",
            "What is the difference between process and thread? How do they share or isolate memory?",
        ],
        "HR": [
            "Tell me about yourself and what brought you into software development.",
            "What project are you most proud of from your academic or professional experience?",
            "Where do you see yourself in 3-5 years as a software developer?",
        ],
        "Behavioral": [
            "Describe a time you encountered a difficult bug. How did you go about finding and fixing it?",
            "Tell me about a time you had to learn a new technology quickly under pressure.",
            "Give an example of when you disagreed with a technical decision. How did you handle it?",
        ]
    },

    "Java Developer": {
        "Technical": [
            "How does the Java Memory Model work? Explain the difference between Heap, Stack, and Metaspace.",
            "What is the internal implementation of HashMap in Java 8+? How does treeification work?",
            "Explain the difference between ArrayList and LinkedList. When would you choose each?",
            "What is the difference between String, StringBuilder, and StringBuffer? Why is String immutable?",
            "How does Java's Garbage Collection work? Explain the generational GC model.",
            "What is the difference between an abstract class and an interface in Java? When do you use each?",
            "Explain Java Generics. What is type erasure and why was it implemented this way?",
            "How does the synchronized keyword work in Java? What is a ReentrantLock and when is it preferred?",
            "What is the difference between Comparable and Comparator interfaces?",
            "Explain Java Streams API. How is it different from traditional loops and what is lazy evaluation?",
            "What are design patterns? Explain Singleton, Factory, and Observer with Java examples.",
            "How does Spring Boot auto-configuration work? What is the purpose of @ConditionalOnMissingBean?",
            "What is dependency injection in Spring? Compare constructor injection vs field injection.",
            "Explain the difference between checked and unchecked exceptions in Java.",
            "What is the ExecutorService in Java? Compare FixedThreadPool, CachedThreadPool, and ScheduledThreadPool.",
        ],
        "HR": [
            "Tell me about yourself and your experience with Java development.",
            "What Java project are you most proud of and what technical challenges did you overcome?",
        ],
        "Behavioral": [
            "Describe a time you optimized a slow Java application. What tools did you use and what did you find?",
            "Tell me about a time you resolved a tricky multithreading bug in Java.",
        ]
    },

    "Python Developer": {
        "Technical": [
            "Explain Python's Global Interpreter Lock (GIL). How does it affect CPU-bound vs I/O-bound programs?",
            "What is the difference between shallow copy and deep copy in Python?",
            "How do Python decorators work internally? Write a decorator that caches function results.",
            "What are Python generators and the yield keyword? How do they help with memory efficiency?",
            "How does Python manage memory? Explain reference counting and cyclic garbage collection.",
            "What is the difference between *args and **kwargs? When would you use each?",
            "Explain Python's MRO (Method Resolution Order) in multiple inheritance.",
            "What is asyncio in Python? How does it differ from threading and multiprocessing?",
            "How do Python's list comprehensions work? Compare them to generator expressions.",
            "What is the __slots__ attribute and when would you use it in a Python class?",
            "How does FastAPI handle async requests? What is the difference between async def and def endpoints?",
            "Explain SQLAlchemy's Session and how it manages transactions in a web application.",
            "What is the difference between unittest and pytest? When would you use each?",
            "How do you handle Python package versioning and virtual environments in a team project?",
            "What is Pydantic and how does it validate data in a FastAPI application?",
        ],
        "HR": [
            "Tell me about yourself and your Python development background.",
            "What Python project has had the most real-world impact that you've built?",
        ],
        "Behavioral": [
            "Describe a time you refactored a messy Python codebase. What was your approach?",
            "Tell me about a performance issue in a Python application you diagnosed and fixed.",
        ]
    }
}

# Default fallback mapping for roles not in the bank
ROLE_FALLBACK_MAP = {
    "java": "Java Developer",
    "python": "Python Developer",
    "backend": "Backend Developer",
    "frontend": "Frontend Developer",
    "front-end": "Frontend Developer",
    "ui": "Frontend Developer",
    "fullstack": "Software Developer",
    "full stack": "Software Developer",
    "ai": "AI/ML Engineer",
    "ml": "AI/ML Engineer",
    "machine learning": "AI/ML Engineer",
    "data science": "AI/ML Engineer",
    "data analyst": "Data Analyst",
    "hr": "HR Specialist",
    "human resources": "HR Specialist",
    "recruiter": "HR Specialist",
    "sales": "Sales Executive",
    "business development": "Sales Executive",
    "operations": "Business Operations",
    "business operations": "Business Operations",
    "software": "Software Developer",
    "developer": "Software Developer",
}


def _get_role_key(role: str) -> str:
    """Map a user-provided role string to the closest question bank key."""
    r = role.lower().strip()
    
    # Exact match first
    for key in ROLE_QUESTION_BANKS:
        if r == key.lower():
            return key
    
    # Substring match
    for fragment, mapped in ROLE_FALLBACK_MAP.items():
        if fragment in r:
            return mapped
    
    return "Software Developer"


def _compute_simple_similarity(q1: str, q2: str) -> float:
    """
    Compute rough word-overlap similarity between two questions.
    Returns a value from 0.0 (completely different) to 1.0 (identical).
    Uses Jaccard similarity on word sets.
    """
    stop_words = {"what", "how", "why", "when", "where", "who", "which",
                  "is", "are", "do", "does", "did", "can", "would", "could",
                  "the", "a", "an", "in", "on", "of", "to", "and", "or",
                  "you", "your", "me", "my", "we", "our", "it", "its",
                  "explain", "describe", "tell", "give", "example", "examples"}
    
    def tokenize(text: str) -> set:
        words = re.findall(r'\b[a-z]+\b', text.lower())
        return {w for w in words if w not in stop_words and len(w) > 2}
    
    set1 = tokenize(q1)
    set2 = tokenize(q2)
    
    if not set1 and not set2:
        return 1.0
    if not set1 or not set2:
        return 0.0
    
    intersection = len(set1 & set2)
    union = len(set1 | set2)
    return intersection / union


def _is_duplicate(candidate: str, existing: List[str], threshold: float = 0.45) -> bool:
    """Check if a candidate question is too similar to any existing question."""
    for existing_q in existing:
        if _compute_simple_similarity(candidate, existing_q) > threshold:
            return True
    return False


async def generate_interview_questions(
    role: str,
    interview_type: str,
    difficulty: str,
    count: int,
    exclude_questions: Optional[List[str]] = None,
    experience_level: str = "Fresher"
) -> List[str]:
    """
    Generate fresh, role-specific interview questions.
    1. Try Ollama if mode is ollama
    2. Fall back to enriched static bank with semantic deduplication
    """
    from app.core.config import settings
    from app.services.ollama_service import ollama_generate_questions

    exclude = list(exclude_questions or [])
    mode = settings.DEFAULT_EVALUATION_MODE

    # Try Ollama first if configured
    if mode == "ollama":
        try:
            ai_questions = await ollama_generate_questions(
                role=role,
                interview_type=interview_type,
                difficulty=difficulty,
                count=count,
                exclude_questions=exclude,
                experience_level=experience_level
            )
            if ai_questions and len(ai_questions) >= max(1, count // 2):
                # Semantic dedup against excluded
                deduped = []
                for q in ai_questions:
                    if not _is_duplicate(q, exclude + deduped, threshold=0.5):
                        deduped.append(q)
                if len(deduped) >= max(1, count // 2):
                    logger.info(f"Ollama generated {len(deduped)} questions for {role}")
                    return deduped[:count]
                logger.warning("Ollama questions had too many duplicates, using static bank")
        except Exception as e:
            logger.warning(f"Ollama question generation failed: {e}")

    # Static bank fallback with semantic deduplication
    return _get_static_questions(role, interview_type, count, exclude)


def _get_static_questions(
    role: str,
    interview_type: str,
    count: int,
    exclude_questions: List[str]
) -> List[str]:
    """Pick questions from the enriched static bank, avoiding duplicates."""
    role_key = _get_role_key(role)
    bank = ROLE_QUESTION_BANKS.get(role_key, ROLE_QUESTION_BANKS["Software Developer"])

    itype = interview_type.lower()

    if itype == "technical":
        pool = list(bank.get("Technical", []))
    elif itype in ["hr", "behavioral"]:
        pool = list(bank.get("HR", [])) + list(bank.get("Behavioral", []))
    else:
        # Mixed: interleave technical and HR
        tech_pool = list(bank.get("Technical", []))
        hr_pool = list(bank.get("HR", [])) + list(bank.get("Behavioral", []))
        random.shuffle(tech_pool)
        random.shuffle(hr_pool)
        hr_count = max(1, count // 3)
        tech_count = count - hr_count
        pool = tech_pool[:tech_count] + hr_pool[:hr_count]

    random.shuffle(pool)

    # Apply semantic deduplication
    selected = []
    for q in pool:
        if len(selected) >= count:
            break
        if not _is_duplicate(q, exclude_questions + selected):
            selected.append(q)

    # If not enough unique questions, allow some repeats (from pool not in exclude_questions exact matches)
    if len(selected) < count:
        for q in pool:
            if len(selected) >= count:
                break
            if q not in exclude_questions and q not in selected:
                selected.append(q)

    return selected[:count]
