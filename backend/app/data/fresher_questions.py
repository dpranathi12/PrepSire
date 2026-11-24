"""
High-yield, concise, and approachable mock interview questions specifically tailored for freshers, college students, and entry-level campus placements.
Every question is clear, 1-2 sentences maximum, and directly assesses fundamental competence without convoluted multi-paragraph enterprise scenarios.
"""

FRESHER_QUESTIONS = {
    "Java Developer": [
        "Explain the difference between method overloading and method overriding in Java with a simple example.",
        "What is the difference between an abstract class and an interface in Java? When should you use which?",
        "How does a HashMap work internally in Java, and how are hash collisions handled?",
        "Why is String immutable in Java, and what is the difference between String, StringBuilder, and StringBuffer?",
        "What is the Java Memory Model? Explain the difference between Heap and Stack memory.",
        "How does Garbage Collection work in Java, and what is the difference between System.gc() and finalize()?",
        "What is the difference between '==' operator and '.equals()' method in Java?",
        "Explain the four pillars of OOP (Encapsulation, Inheritance, Polymorphism, Abstraction) and how they apply in Java.",
        "What is the difference between checked and unchecked exceptions in Java? Give examples of both.",
        "What are the main differences between an ArrayList and a LinkedList in the Java Collections framework?",
        "Explain the 'final', 'finally', and 'finalize' keywords in Java.",
        "What is multithreading in Java, and what is the difference between extending Thread class vs implementing Runnable interface?",
        "What are access specifiers in Java (public, private, protected, default) and what is their scope?",
        "What is Spring Boot, and what is the advantage of using it over traditional Spring Framework?",
        "What is Dependency Injection in Spring Boot, and how does the @Autowired annotation work?"
    ],
    "Python Developer": [
        "What is the difference between a list, a tuple, and a set in Python?",
        "Explain Python's memory management and how reference counting works for garbage collection.",
        "What are Python decorators, and how would you write a simple decorator to measure function execution time?",
        "What is the difference between 'is' and '==' in Python?",
        "What are Python generators and the 'yield' keyword? How do they help save memory?",
        "What is the Global Interpreter Lock (GIL) in Python, and how does it affect CPU-bound vs I/O-bound tasks?",
        "Explain the difference between shallow copy and deep copy in Python using the copy module.",
        "What are *args and **kwargs in Python function definitions, and when would you use them?",
        "How does exception handling work in Python with try, except, else, and finally blocks?",
        "What is list comprehension in Python? Provide an example of filtering even numbers from a list.",
        "What is the difference between a module and a package in Python?",
        "Explain lambda functions in Python and how they are commonly used with map() and filter().",
        "How do dictionaries work internally in Python, and what is the average time complexity for key lookup?",
        "What is the purpose of the '__init__' method in Python classes, and how does 'self' work?",
        "What is the difference between FastAPI and Flask/Django for building web APIs in Python?"
    ],
    "Backend Developer": [
        "What is a RESTful API, and what are the standard HTTP methods used for CRUD operations?",
        "What is the difference between HTTP status codes 200, 201, 400, 401, 403, 404, and 500?",
        "Explain the difference between SQL (relational) and NoSQL (document/key-value) databases with examples.",
        "What is database normalization, and why do we normalize relational tables up to 3NF?",
        "What are ACID properties in a database transaction, and why are they critical?",
        "What is an index in a database, and how does it improve query speed? When can an index hurt performance?",
        "What is the difference between an INNER JOIN, LEFT JOIN, and RIGHT JOIN in SQL?",
        "How does authentication with JSON Web Tokens (JWT) work between a client and a backend server?",
        "What is caching, and how would you use Redis to speed up database-heavy read requests?",
        "What is the difference between monolithic architecture and microservices architecture?",
        "How do you prevent SQL injection vulnerabilities when querying a database in your backend code?",
        "What is CORS (Cross-Origin Resource Sharing) and why does a browser block requests from different ports or domains?",
        "What is an API rate limiter, and why is it important for protecting backend services?",
        "What is the difference between synchronous and asynchronous request processing in backend systems?",
        "How do you design a database schema for a simple student course registration system?"
    ],
    "Frontend Developer": [
        "What is the difference between 'var', 'let', and 'const' in JavaScript?",
        "Explain the CSS Box Model (content, padding, border, margin).",
        "What is the Virtual DOM in React, and how does it improve web rendering performance?",
        "What is the difference between state and props in React components?",
        "What is the Event Loop in JavaScript, and how do Call Stack, Web APIs, and Callback Queue interact?",
        "What are React Hooks? Explain the difference between useState and useEffect.",
        "What is the difference between '==' and '===' in JavaScript?",
        "How does asynchronous JavaScript work with Promises and async/await?",
        "What is responsive web design, and how do CSS media queries help achieve it?",
        "What is the difference between localStorage, sessionStorage, and cookies in the browser?",
        "How do you handle API calls in React components and manage loading/error states?",
        "What is Flexbox in CSS, and what is the difference between 'justify-content' and 'align-items'?"
    ],
    "AI/ML Engineer": [
        "What is the difference between Supervised Learning, Unsupervised Learning, and Reinforcement Learning?",
        "Explain the Bias-Variance tradeoff in machine learning and how it relates to underfitting and overfitting.",
        "What is the difference between classification and regression tasks in machine learning?",
        "What is overfitting in a machine learning model, and what are three practical ways to prevent it?",
        "Explain the difference between Precision, Recall, and F1-Score. When is Recall more important than Precision?",
        "What is Gradient Descent, and how does learning rate affect the model's convergence?",
        "Why do we split datasets into Training, Validation, and Testing sets?",
        "What is feature scaling (normalization vs standardization), and why is it necessary for distance-based algorithms?",
        "How does a Decision Tree work, and what is Random Forest?",
        "What is the difference between a traditional machine learning algorithm and a Deep Neural Network?"
    ],
    "Software Developer": [
        "Explain the four main principles of Object-Oriented Programming with everyday real-world analogies.",
        "What is the difference between an Array and a Linked List in data structures? Compare their insertion time complexities.",
        "What is a Stack, and what is a Queue? Give one practical computing use case for each.",
        "What is Big O notation, and what is the difference between O(1), O(N), and O(N^2) time complexity?",
        "What is recursion in programming, and what happens if a recursive function does not have a base case?",
        "Explain how Binary Search works and why its time complexity is O(log N) compared to linear search O(N).",
        "What is version control, and what is the difference between 'git pull' and 'git fetch'?",
        "What are the steps you take to debug and troubleshoot an unexpected error or crash in your code?",
        "What happens behind the scenes from the moment you type a website URL in a browser to when the page loads?",
        "What is unit testing, and why is writing automated test cases important before shipping software?"
    ],
    "HR": [
        "Tell me about yourself, your educational background, and what inspired you to pursue a career in technology.",
        "What are your top two strengths, and what is one area or skill you are actively working to improve?",
        "Walk me through a college project or assignment you are proud of. What was your specific role and contribution?",
        "Tell me about a time you faced a difficult challenge or disagreement during a group project. How did you resolve it?",
        "Why do you want to join our organization as a fresher, and what are your expectations from your first role?",
        "Where do you see yourself professionally in the next 3 to 5 years?",
        "How do you prioritize your tasks when you have multiple assignments or deadlines approaching at the same time?",
        "How do you handle constructive criticism or code review feedback from teammates or professors?",
        "Are you comfortable learning new technologies, languages, and frameworks on the job as project requirements change?",
        "Do you have any questions for me or our engineering team about our culture and onboarding?"
    ],
    "Behavioral": [
        "Describe a situation where a teammate was not contributing their fair share to a project. How did you handle it?",
        "Tell me about a time you made a mistake or your code failed. How did you identify the error and fix it?",
        "Give an example of a time when you had to learn a completely new programming language or tool in a short period.",
        "Describe a time you received difficult feedback. What was your reaction, and what changes did you make?",
        "Tell me about an instance where you took initiative to solve a problem without being asked to do so.",
        "How do you stay motivated and focused when working on repetitive or tedious debugging tasks?",
        "Describe how you explain complex technical concepts to a peer or teammate who does not have a technical background.",
        "Tell me about a time you had to adapt quickly to a sudden change in project scope or requirements."
    ]
}

def get_fresher_questions_for_role(role: str, interview_type: str, count: int = 5, exclude_texts: set = None) -> list:
    """Selects fresh, clear, entry-level questions tailored to the requested role and type."""
    import random
    exclude_texts = exclude_texts or set()

    role_key = "Software Developer"
    r_lower = role.lower()
    if "java" in r_lower:
        role_key = "Java Developer"
    elif "python" in r_lower:
        role_key = "Python Developer"
    elif "backend" in r_lower:
        role_key = "Backend Developer"
    elif "frontend" in r_lower or "web" in r_lower:
        role_key = "Frontend Developer"
    elif "ai" in r_lower or "ml" in r_lower or "machine learning" in r_lower:
        role_key = "AI/ML Engineer"
    elif "software" in r_lower or "developer" in r_lower:
        role_key = "Software Developer"

    itype = interview_type.lower()
    selected = []

    if itype in ["hr", "behavioral"]:
        pool = list(FRESHER_QUESTIONS.get("HR", [])) + list(FRESHER_QUESTIONS.get("Behavioral", []))
        random.shuffle(pool)
        unseen = [q for q in pool if q not in exclude_texts]
        selected = (unseen + pool)[:count]
    elif itype == "technical":
        pool = list(FRESHER_QUESTIONS.get(role_key, FRESHER_QUESTIONS["Software Developer"]))
        random.shuffle(pool)
        unseen = [q for q in pool if q not in exclude_texts]
        selected = (unseen + pool)[:count]
    else:  # Mixed
        hr_pool = list(FRESHER_QUESTIONS.get("HR", [])) + list(FRESHER_QUESTIONS.get("Behavioral", []))
        tech_pool = list(FRESHER_QUESTIONS.get(role_key, FRESHER_QUESTIONS["Software Developer"]))
        random.shuffle(hr_pool)
        random.shuffle(tech_pool)

        hr_count = max(1, count // 2)
        tech_count = count - hr_count

        hr_unseen = [q for q in hr_pool if q not in exclude_texts]
        tech_unseen = [q for q in tech_pool if q not in exclude_texts]

        picked_hr = (hr_unseen + hr_pool)[:hr_count]
        picked_tech = (tech_unseen + tech_pool)[:tech_count]

        # Interleave
        for i in range(max(len(picked_hr), len(picked_tech))):
            if i < len(picked_tech):
                selected.append(picked_tech[i])
            if i < len(picked_hr):
                selected.append(picked_hr[i])
        selected = selected[:count]

    return selected
