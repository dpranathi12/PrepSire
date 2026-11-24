import { 
  UserProfile, 
  SkillScores, 
  QuestionEvaluation, 
  InterviewQuestion, 
  MockInterviewSession,
  JamSession,
  TechnicalQuestion,
  DailyTask,
  TargetRole
} from '../types';
import { COMPREHENSIVE_TECHNICAL_QUESTIONS } from '../data/questionBank';
import { get30DayCurriculum } from '../data/learningPlanCurriculum';

// Preset JAM Topics
export const JAM_TOPICS = [
  "Artificial Intelligence and the Future of Work",
  "The Impact of Social Media on Modern Youth",
  "Climate Change and Renewable Energy Solutions",
  "Online Education vs Traditional Classroom Learning",
  "Role of Technology in Revolutionizing Healthcare",
  "My Favorite Role Model and What They Taught Me",
  "Importance of Soft Skills and Effective Communication",
  "Remote Work Culture: Benefits and Challenges",
  "Cybersecurity in the Era of Digital Transformation",
  "Work-Life Balance: Myth or Reality for Freshers?"
];

// Expanded Technical Question Bank (120+ Questions with 10+ per Subject)
export const TECHNICAL_QUESTIONS: TechnicalQuestion[] = COMPREHENSIVE_TECHNICAL_QUESTIONS;

// HR & Behavioral Question Bank by Role
export const HR_QUESTIONS = [
  "Tell me about yourself, your academic/professional background, and what drives you in this career path.",
  "Why are you interested in this specific role and what makes your skill set a great match for our team?",
  "What are your greatest professional strengths, and what is one area of improvement you are actively working on?",
  "Describe a challenging situation or technical conflict you faced during a group project and how you resolved it.",
  "Where do you see yourself professionally in the next 3 to 5 years, and how does this role fit into that journey?",
  "Tell me about a time you encountered a significant failure or setback. How did you react and what did you learn?",
  "How do you handle tight project deadlines, ambiguous requirements, or high-pressure situations?",
  "Why should we hire you over other qualified candidates applying for this position?",
  "Walk me through a project you are most proud of. What was your individual contribution and the measurable outcome?",
  "How do you prioritize competing tasks when multiple deliverables are due at the same time?",
  "Describe an experience where you had to adapt quickly to a completely new tool, language, or environment.",
  "How do you handle receiving critical constructive feedback from a mentor or peer?"
];

export const TECHNICAL_INTERVIEW_QUESTIONS: Record<string, string[]> = {
  'Java Developer': [
    "Explain the core principles of OOP (Encapsulation, Inheritance, Polymorphism, Abstraction) and how they are implemented in Java.",
    "What is the internal working of HashMap in Java? How are collisions handled in Java 8+?",
    "Explain the Java Memory Model: difference between Heap and Stack memory, and how Garbage Collection works.",
    "What is the difference between String, StringBuilder, and StringBuffer? Why is String immutable in Java?",
    "How does Multithreading and Concurrency work in Java? Explain synchronized blocks, volatile keyword, and ExecutorService.",
    "What is the difference between an Abstract Class and an Interface in Java? When would you use default methods?",
    "How does Spring Boot dependency injection and Inversion of Control (IoC) work under the hood?",
    "Explain the difference between fail-fast and fail-safe iterators in the Java Collections framework."
  ],
  'Python Developer': [
    "Explain Python's Global Interpreter Lock (GIL) and how it affects multi-threaded CPU-bound programs versus I/O-bound programs.",
    "What is the difference between shallow copy and deep copy in Python? How does memory allocation work for mutable objects?",
    "Explain how Python decorators work under the hood and provide an example of creating a custom timing decorator.",
    "What are Python generators and yield statements? How do they help optimize memory consumption over large lists?",
    "How does asyncio work in Python? Compare coroutines with traditional threading and multiprocessing.",
    "Explain Python's method resolution order (MRO) in multiple inheritance and how the super() function operates.",
    "How do you optimize slow database queries and ORM overhead when using Django ORM or SQLAlchemy in FastAPI?"
  ],
  'Backend Developer': [
    "How do you design a scalable RESTful API? Discuss versioning, idempotency, rate limiting, and HTTP status codes.",
    "Compare relational SQL databases (e.g., PostgreSQL) with NoSQL databases (e.g., MongoDB). When would you choose which?",
    "Explain database indexing: how B-Trees work, composite indexes, and when an index might degrade write performance.",
    "How do you implement distributed caching using Redis? What are cache stampede, cache penetration, and cache eviction strategies?",
    "Explain microservices architecture: how do services handle distributed transactions (Saga pattern) and service discovery?",
    "How do message brokers like Apache Kafka or RabbitMQ enable asynchronous event-driven decoupling between services?",
    "What security practices do you implement for backend endpoints: JWT token validation, CORS, rate-limiting, and SQL injection prevention?"
  ],
  'AI/ML Engineer': [
    "What is the difference between Supervised, Unsupervised, and Reinforcement Learning? Provide concrete industry use cases.",
    "Explain the Bias-Variance tradeoff. What techniques do you use to detect and mitigate overfitting in deep neural networks?",
    "How do gradient descent and backpropagation work? Compare Batch GD, Mini-batch GD, and Adam optimizer.",
    "Explain the Transformer architecture: what is the self-attention mechanism and why does it outperform RNNs/LSTMs in NLP?",
    "How do you evaluate classification models when dataset classes are highly imbalanced? (Precision, Recall, F1, ROC-AUC, PR-AUC).",
    "What are vector databases and embeddings? How are they utilized in Retrieval-Augmented Generation (RAG) pipelines?",
    "How do you optimize machine learning models for low-latency production inference? (Quantization, pruning, ONNX runtime)."
  ],
  'Software Developer': [
    "Explain the core principles of Object-Oriented Programming (OOP) with real-world design examples.",
    "What is the difference between synchronous and asynchronous execution? How does an event loop or thread pool work?",
    "Explain how you profile and optimize a slow-running algorithm or database query in a production environment.",
    "What is REST API architecture? Compare REST with GraphQL and gRPC.",
    "Walk me through what happens under the hood when a user types a URL in the browser and presses enter until the page renders."
  ],
  'Data Analyst': [
    "How do you clean and handle missing data, anomalies, and outliers in a messy dataset?",
    "Explain the difference between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN in SQL with examples.",
    "What statistical metrics (mean, median, IQR, p-value) do you evaluate before choosing a data visualization or modeling strategy?",
    "How do you communicate complex statistical findings and data insights to non-technical business stakeholders?",
    "Explain the concept of A/B testing: hypothesis definition, sample size calculation, and p-value significance testing."
  ],
  'HR Specialist': [
    "How would you handle a severe interpersonal conflict between two senior engineers on a high-stakes project?",
    "What strategies and sourcing channels do you use to attract, screen, and retain top technical talent?",
    "How do you measure employee engagement, eNPS, and retention across hybrid or remote teams?",
    "Walk me through a structured, welcoming 30-day onboarding program for junior engineers and fresh graduates."
  ],
  'Marketing Executive': [
    "How do you measure CAC (Customer Acquisition Cost), LTV (Lifetime Value), and ROI for a digital multi-channel campaign?",
    "Explain your launch strategy for introducing a new developer tool or educational SaaS product on social channels.",
    "How do you manage and de-escalate public negative feedback or PR crises on social media?"
  ],
  'Product Manager': [
    "How do you prioritize competing feature requests when engineering bandwidth is constrained? (RICE, MoSCoW, Kano models).",
    "Tell me about a tech product you admire. If you were its PM, what key friction point would you address next?",
    "How do you translate qualitative customer interviews and analytics telemetry into actionable product requirements documents (PRDs)?"
  ],
  'DevOps Engineer': [
    "Explain the concept of Continuous Integration and Continuous Deployment (CI/CD) and how automated quality gates work.",
    "What is Containerization and how does Docker differ from a Virtual Machine in resource isolation and architecture?",
    "How do you design a high-availability infrastructure with zero-downtime rolling updates and automated rollbacks on Kubernetes?",
    "Explain Infrastructure as Code (IaC) using Terraform: state management, drift detection, and modular architecture."
  ],
  'Full Stack Developer': [
    "How do you structure client-server communication and handle state management across a complex React + Node/FastAPI application?",
    "Explain how user authentication and authorization work using JWT tokens, refresh tokens, and HttpOnly cookies.",
    "What techniques do you employ to optimize both front-end Core Web Vitals (LCP, CLS, FID) and backend latency?",
    "How do you design a database schema and indexing strategy for a real-time collaborative feature (e.g. chat or live notifications)?"
  ],
  'Frontend Developer': [
    "How does the React Virtual DOM diffing algorithm work? What are Fiber reconciliation and synthetic events?",
    "Explain modern CSS layout mechanisms: Flexbox vs CSS Grid, and strategies for responsive mobile-first design.",
    "How do you handle client-side caching, data fetching, and optimistic UI updates using tools like React Query or Redux Toolkit?",
    "What are Web Performance metrics (FCP, LCP, INP, CLS) and how do you optimize asset bundles with code splitting and lazy loading?"
  ]
};

// Answer evaluation engine — friendly, simple feedback
export function evaluateAnswer(question: string, answer: string, category: 'HR' | 'Technical' | 'Behavioral'): QuestionEvaluation {
  const text = answer.trim();
  const wordCount = text.length > 0 ? text.split(/\s+/).length : 0;

  // Detect filler words
  const fillerList = ['actually', 'like', 'um', 'uh', 'you know', 'basically', 'honestly', 'literally', 'so yeah'];
  const foundFillers: string[] = [];
  let fillerCount = 0;

  const lowerText = text.toLowerCase();
  fillerList.forEach(filler => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      foundFillers.push(filler);
      fillerCount += matches.length;
    }
  });

  // STAR Method detection
  const hasSituation = /situation|task|project|when|college|team|work/i.test(lowerText);
  const hasAction = /i did|i created|i implemented|i spoke|i solved|i used|i built/i.test(lowerText);
  const hasResult = /result|outcome|learned|achieved|improved|successfully/i.test(lowerText);
  const starMethodUsed = hasSituation && hasAction && hasResult;

  let score = 70;
  if (wordCount < 15) {
    score -= 30;
  } else if (wordCount >= 40 && wordCount <= 180) {
    score += 15;
  }

  if (fillerCount === 0 && wordCount > 20) {
    score += 10;
  } else {
    score -= Math.min(20, fillerCount * 4);
  }

  if ((category === 'Behavioral' || category === 'HR') && starMethodUsed) score += 15;

  if (category === 'Technical') {
    const techKeywords = ['because', 'example', 'function', 'complexity', 'data', 'system', 'approach', 'solution', 'process'];
    const matchedKeywords = techKeywords.filter(k => lowerText.includes(k));
    score += Math.min(15, matchedKeywords.length * 3);
  }

  score = Math.max(35, Math.min(98, score));

  // Friendly "what went well" messages
  const whatWentWell: string[] = [];
  if (wordCount >= 30) whatWentWell.push("Nice detail! You gave a thorough answer. 👍");
  if (fillerCount === 0) whatWentWell.push("Great job — no filler words like 'um' or 'like'! Clean speech. ✨");
  if (starMethodUsed) whatWentWell.push("You used the STAR method nicely (Situation → Action → Result). Interviewers love this! ⭐");
  if (score >= 80) whatWentWell.push("Confident and clear — you sounded great!");
  if (whatWentWell.length === 0) whatWentWell.push("Good start — you addressed the question directly. Keep going! 💪");

  // Friendly improvement tips
  const needsImprovement: string[] = [];
  if (wordCount < 25) needsImprovement.push("Try adding a bit more detail — give an example or a short story to make your answer stronger.");
  if (fillerCount > 0) needsImprovement.push(`You said "${foundFillers.join(', ')}" a few times. Tip: just pause silently instead — it sounds more confident!`);
  if (!starMethodUsed && (category === 'Behavioral' || category === 'HR')) {
    needsImprovement.push("Try the STAR method: share a Situation, your Task, what Action you took, and the Result. It makes answers really compelling!");
  }
  if (category === 'Technical' && wordCount < 40) {
    needsImprovement.push("Add a quick example or walk through the steps — it helps the interviewer see how you think.");
  }
  if (needsImprovement.length === 0) needsImprovement.push("Almost perfect! Just keep practicing to get even smoother. 🎯");

  // Simple, friendly model answers
  let improvedAnswer = "";
  if (category === 'HR') {
    improvedAnswer = `"In my college project, we had a tight deadline. I took charge of the database part, split tasks with my team, and we finished a day early. It taught me that good planning + teamwork = great results."`;
  } else if (category === 'Technical') {
    improvedAnswer = `"Let me break it down simply: First, here's what the concept means. Then, here's how it works step by step. And here's a quick example — like when I used it in my project to solve [X problem]."`;
  } else {
    improvedAnswer = `"During my final year project (Situation), I was responsible for the backend (Task). I rewrote slow database queries and added caching (Action). This made our app 40% faster (Result)."`;
  }

  const feedback = score >= 80
    ? `Great answer! 🎉 You were clear, confident, and well-structured. Keep this up!`
    : `Good effort! 💪 You're on the right track. Try adding a specific example and cutting filler words — it'll make a big difference!`;

  return {
    score,
    feedback,
    fillerWordsFound: foundFillers,
    fillerWordCount: fillerCount,
    starMethodUsed,
    whatWentWell,
    needsImprovement,
    improvedAnswer
  };
}

// Follow-up questions — friendly and conversational
export function generateFollowUpQuestion(previousQuestion: string, userAnswer: string): string {
  const text = userAnswer.toLowerCase();

  if (text.includes('project') || text.includes('built') || text.includes('team')) {
    return "That sounds cool! 🤔 What was the toughest part of that project, and how did you handle it?";
  }
  if (text.includes('learn') || text.includes('python') || text.includes('java') || text.includes('code')) {
    return "Nice! If you had to rebuild it today to handle way more users, what would you change?";
  }
  if (text.includes('weakness') || text.includes('mistake') || text.includes('fail')) {
    return "Thanks for being honest! How have you been working on improving that? Any progress you can share?";
  }

  return "Can you give me a quick real-world example to back that up? Even a small one helps! 😊";
}

// 30-Day Personalized Plan Generator with 30 Distinct Daily Tasks
export function generatePersonalized30DayPlan(profile: UserProfile, scores: SkillScores): DailyTask[] {
  return get30DayCurriculum(profile, scores);
}

// Diagnostic Assessment Calculator
export function calculateDiagnosticAssessment(answers: Record<string, any>): SkillScores {
  const comm = Math.min(95, Math.max(45, (answers.commScore || 65) + 5));
  const tech = Math.min(95, Math.max(40, (answers.techScore || 55) + 3));
  const conf = Math.min(95, Math.max(50, (answers.confScore || 60) + 4));
  const gram = Math.min(95, Math.max(55, (answers.gramScore || 72)));
  const prob = Math.min(95, Math.max(45, (answers.probScore || 62)));

  const overall = Math.round((comm * 0.25) + (tech * 0.3) + (conf * 0.2) + (gram * 0.15) + (prob * 0.1));

  return {
    communication: comm,
    technical: tech,
    confidence: conf,
    grammar: gram,
    problemSolving: prob,
    overall
  };
}

// AI Career Coach — Intelligent Conversational Interview Mentor
export function getCoachResponse(
  message: string, 
  profile: UserProfile, 
  scores: SkillScores,
  history?: { sender: string; text: string }[]
): string {
  const text = message.trim();
  const lower = text.toLowerCase();

  // Extract recent context from history if available
  let lastContext = '';
  if (history && history.length > 0) {
    const prev = history.slice(-3).map(h => h.text.toLowerCase()).join(' ');
    if (prev.includes('java')) lastContext = 'java';
    else if (prev.includes('python')) lastContext = 'python';
    else if (prev.includes('hashmap') || prev.includes('dsa')) lastContext = 'dsa';
    else if (prev.includes('behavioral') || prev.includes('hr')) lastContext = 'hr';
  }

  // 1. Student / Beginner who knows basic syntax but struggles with coding / interview problem solving
  const knowsBasics = ['know basic', 'knows basic', 'basic java', 'basic python', 'syntax', 'beginner in'].some(k => lower.includes(k));
  const strugglesCoding = ['struggle with coding', 'struggle to code', 'coding is hard', 'cannot code', 'cant code', 'stuck in coding', 'problem solving'].some(k => lower.includes(k));
  const isStudentPrep = ['student', 'prepare', 'preparation', 'interview', 'how should i', 'roadmap'].some(k => lower.includes(k));
  const isJava = lower.includes('java') || lastContext === 'java';
  const isPython = lower.includes('python') || lastContext === 'python';

  if ((knowsBasics || strugglesCoding) && (isStudentPrep || isJava || isPython)) {
    const lang = isJava ? 'Java' : (isPython ? 'Python' : profile.targetRole);
    return `I completely understand, ${profile.name || 'there'}! It is very common for CS students to understand ${lang} syntax and OOP principles from class, but freeze when facing blank code editors in technical interviews.

Here is your 4-Phase Strategy to bridge the gap:

📌 **Phase 1: Consolidate Core ${lang} Fundamentals**
• Make sure you know OOP deeply: Polymorphism, Abstract classes vs Interfaces, and Exception Handling.
• Master ${lang} Collections: know when to use ArrayList vs LinkedList, how HashMap works internally, and how HashSet eliminates duplicates.

💡 **Phase 2: Overcome the Coding Block with "Pen & Paper" First**
• **Key Mistake:** Never start typing code immediately!
• Write out your solution steps in plain English sentences on paper first.
• Trace your logic with 2 sample inputs and 1 edge case (empty array or single element).
• Start on LeetCode/HackerRank strictly on **Easy Arrays & Strings** — solve 20 Easy problems before touching Medium!

⚡ **Phase 3: Master the 4 Foundational Interview Patterns**
• Focus on: **Two Pointers**, **Sliding Window**, **HashMap frequency counting**, and **Fast & Slow pointers**.
• These 4 patterns cover over 60% of entry-level coding interview questions.

🎯 **Phase 4: Practice Thinking Aloud**
• Interviewers care about your thought process, not just final syntax. Explain your reasoning step-by-step: "I will validate the input bounds first, then use a HashMap for O(n) lookup."
• Practice with PrepSpire's Technical Practice and Mock Interview modules.

Would you like to start with a Two Pointers pattern example in ${lang}?`;
  }

  // 2. Request for 3 Practice Questions or Problems
  if (['give me 3 questions', 'give me questions', 'practice questions', 'sample questions', 'give me problems'].some(k => lower.includes(k))) {
    if (isJava) {
      return `Here are 3 high-yield Java Developer interview questions:

1. **Language Internals:** How does \`ConcurrentHashMap\` provide thread safety without locking the whole table like \`Hashtable\`?
2. **Coding Challenge:** Given an array of integers, find the length of the longest consecutive sequence in O(n) time using a HashSet.
3. **OOP & Design:** How would you design a Parking Lot system using SOLID principles in Java? Which design patterns would you apply?

Which one would you like to explore first?`;
    }
    return `Here are 3 essential interview questions tailored for a ${profile.targetRole}:

1. **Architecture:** How would you design an API rate limiter to protect backend services from denial of service?
2. **Algorithms:** How do you detect and find the starting node of a cycle in a singly linked list in O(n) time and O(1) space?
3. **Behavioral (STAR):** Describe a time when you received tough technical feedback during a code review. How did you respond?

Tell me which one you'd like to dive into!`;
  }

  // 3. Comprehensive Technical Deep Dives (OOP, Java, Python, SQL, DB, OS, Networks)

  // HashMap
  if (lower.includes('hashmap') || lower.includes('hash table')) {
    return `Here is how a **HashMap** operates under the hood — a favorite interview topic:

1. **Buckets:** It uses an internal array of Node buckets (initial capacity 16, load factor 0.75).
2. **Index Calculation:** \`key.hashCode()\` produces a hash, and bitwise index calculation \`hash & (n - 1)\` maps it to a specific bucket.
3. **Collision Handling:**
   • If two keys map to the same bucket, entries form a linked list.
   • In Java 8+, if a bucket's list exceeds 8 items and total capacity is at least 64, it transforms into a **Red-Black Tree** to guarantee **O(log n)** worst-case lookup.
4. **Rehashing:** When elements exceed 75% of capacity (12 entries), the capacity doubles and existing keys are redistributed.

💡 **Interview Tip:** Always remember: if two objects are equal by \`.equals()\`, they MUST have the same \`.hashCode()\`!`;
  }

  // Polymorphism
  if (['polymorphism', 'overloading vs overriding', 'overload vs override'].some(k => lower.includes(k))) {
    return `**Polymorphism** in OOP means 'many forms' — the ability of an object or method to behave differently based on context.

There are two main types:
1. **Compile-time (Static) Polymorphism — Method Overloading:**
   • Multiple methods in the same class share the same name but have different parameter lists (types, count, or order).
   • *Example:* \`add(int a, int b)\` vs \`add(double a, double b)\`.
   • Resolved at compile time.

2. **Runtime (Dynamic) Polymorphism — Method Overriding:**
   • A subclass provides its own specific implementation of a method already defined in its parent class with the exact same name, return type, and parameters.
   • *Example:* Parent \`Animal.makeSound()\` overridden by \`Dog.makeSound()\` to bark.
   • Resolved at runtime via dynamic method dispatch.

💡 **Interview Pro-Tip:** Interviewers often ask: *'Can we overload the main method in Java?'* Yes, you can overload \`main()\`, but the JVM will only execute \`public static void main(String[] args)\` as the entry point.`;
  }

  // Abstract Class vs Interface
  if (['abstract class vs interface', 'interface vs abstract', 'abstract class and interface'].some(k => lower.includes(k))) {
    return `Here is the exact breakdown of **Abstract Class vs Interface** that interviewers look for:

| Feature | Abstract Class | Interface |
| :--- | :--- | :--- |
| **Inheritance** | Single inheritance (\`extends\`) | Multiple inheritance (\`implements\`) |
| **Methods** | Can have abstract AND concrete methods | Pure abstract (Java 8+ allows \`default\` and \`static\` methods) |
| **Variables** | Instance variables (any access modifier) | Strictly \`public static final\` constants |
| **Constructors** | Has constructors (called via \`super()\`) | Cannot have constructors |
| **Speed** | Slightly faster (direct invocation) | Slight overhead of interface lookup |

🎯 **When to use which:**
• Use an **Abstract Class** when classes share common state/code and have an *'IS-A'* relationship (e.g., \`Car\` extends \`Vehicle\`).
• Use an **Interface** to define a contract or capability across unrelated classes with a *'CAN-DO'* relationship (e.g., \`Document\` implements \`Printable\`, \`User\` implements \`Serializable\`).`;
  }

  // Encapsulation
  if (lower.includes('encapsulation')) {
    return `**Encapsulation** is the bundling of data (variables) and the methods that operate on that data into a single unit (class), while restricting direct access from outside.

**How to implement it:**
1. Declare class fields as \`private\`.
2. Provide \`public\` getter and setter methods to access and modify field values.

**Why is it important?**
• **Data Hiding & Security:** External classes cannot tamper with internal variables directly.
• **Validation Control:** You can validate data inside setters (e.g., \`setAge(int age)\` can reject negative numbers).
• **Flexibility:** You can change internal implementation details without breaking external code calling getters/setters.

💡 **Real-world Analogy:** Think of an ATM capsule: your account balance is private inside the bank's core system; you can only view or withdraw funds through defined public operations (the ATM keypad and screen).`;
  }

  // Inheritance
  if (lower.includes('inheritance') && !lower.includes('abstract') && !lower.includes('polymorphism')) {
    return `**Inheritance** is an OOP mechanism where a new class (subclass/child) derives attributes and behaviors from an existing class (superclass/parent).

**Key Advantages:**
• **Code Reusability:** Common logic is written once in the parent class.
• **Method Overriding:** Subclasses can specialize parent methods for dynamic polymorphism.

**Types of Inheritance:**
• Single, Multilevel, and Hierarchical (supported in Java & C++).
• Multiple Inheritance (classes inheriting from multiple classes) is NOT supported in Java through classes to avoid the **Diamond Problem**, but is achieved cleanly via multiple interfaces.

💡 **Interview Pro-Tip:** Always remember: prefer *composition over inheritance* (HAS-A over IS-A) when you only need utility methods rather than polymorphic hierarchy.`;
  }

  // Abstraction
  if (lower.includes('abstraction') && !lower.includes('abstract class')) {
    return `**Abstraction** is the concept of hiding unnecessary implementation complexity and showing only the essential features to the user.

**Real-world Analogy:** When you drive a car, you press the accelerator pedal to speed up. You don't need to know how the fuel injection system, pistons, or spark plugs operate beneath the hood. The accelerator pedal is the abstract interface.

**How it's achieved in code:**
• **Abstract Classes:** Provide 0% to 100% abstraction.
• **Interfaces:** Provide up to 100% abstraction (defining method contracts without method bodies).

💡 **Difference between Abstraction and Encapsulation:**
• *Abstraction* solves the problem at design level: **'What'** does the object do?
• *Encapsulation* solves the problem at implementation level: **'How'** is the data protected and bundled?`;
  }

  // Java String Immutability
  if (['string immutable', 'why is string immutable', 'stringbuilder vs stringbuffer', 'string, stringbuilder'].some(k => lower.includes(k))) {
    return `**Why is String immutable in Java?**
Once a \`String\` object is created in Java, its value cannot be changed. Any modification creates a brand new String object.

**3 Reasons Why Java Designers Made It Immutable:**
1. **String Constant Pool (Memory Efficiency):** Different variables with the same literal (e.g. \`String a = "Prep"; String b = "Prep";\`) share the exact same memory address in the heap String Pool.
2. **Security:** Strings are used for database URLs, usernames, passwords, and network connections. If Strings were mutable, an unauthorized thread could alter the connection string.
3. **Thread Safety:** Multiple threads can read String objects concurrently without synchronization locks.

**String vs StringBuilder vs StringBuffer:**
• \`String\`: Immutable (creates new object on concat).
• \`StringBuilder\`: Mutable and fast, but **not thread-safe** (use for single-threaded string concatenation).
• \`StringBuffer\`: Mutable and **thread-safe** with \`synchronized\` methods (slower overhead).`;
  }

  // == vs .equals()
  if (['== vs equals', 'equals vs ==', 'difference between == and equals'].some(k => lower.includes(k))) {
    return `Here is the vital difference between **\`==\`** and **\`.equals()\`** in Java:

1. **\`==\` Operator (Reference Comparison):**
   • For primitives (\`int\`, \`char\`, etc.): compares actual numerical values (\`5 == 5\` is true).
   • For objects: checks whether two references point to the **exact same memory address** in Heap memory.

2. **\`.equals()\` Method (Content / Value Comparison):**
   • Checks whether the logical content of two objects is equivalent.
   • In class \`Object\`, the default \`.equals()\` uses \`==\`. Classes like \`String\`, \`Integer\`, and \`Date\` override \`.equals()\` to compare actual values character-by-character.

**Classic Interview Example:**
\`\`\`java
String s1 = new String("hello");
String s2 = new String("hello");
System.out.println(s1 == s2);      // false (different heap memory addresses)
System.out.println(s1.equals(s2)); // true (same character content)
\`\`\`
💡 **Golden Rule:** If you override \`.equals()\` in a custom class, you MUST override \`.hashCode()\` to preserve the contract for hash collections!`;
  }

  // ArrayList vs LinkedList
  if (['arraylist vs linkedlist', 'linkedlist vs arraylist', 'arraylist and linkedlist'].some(k => lower.includes(k))) {
    return `**ArrayList vs LinkedList** in the Java Collections Framework:

| Operation | ArrayList | LinkedList |
| :--- | :--- | :--- |
| **Underlying Structure** | Resizable Dynamic Array | Doubly-Linked List (Node objects) |
| **Random Access (\`get(i)\`)** | **O(1) Instantaneous** | O(N) Traversal required |
| **Insertion/Deletion at head**| O(N) (must shift elements) | **O(1) (pointer update)** |
| **Insertion/Deletion in middle**| O(N) (shifting elements) | O(N) to traverse + O(1) pointer swap |
| **Memory Overhead** | Low (only array elements) | Higher (each node stores \`data\`, \`next\`, \`prev\` pointers) |

🎯 **When to use:**
• Choose **ArrayList** when you have a **read-heavy** application with frequent index lookups.
• Choose **LinkedList** when you have frequent insertions/deletions at the beginning or end (e.g. implementing Queues/Deques).`;
  }

  // Garbage Collection
  if (['garbage collection', 'how does gc work', 'gc in java'].some(k => lower.includes(k))) {
    return `**Garbage Collection (GC)** in Java is an automated memory management process that frees up heap memory by destroying unreachable objects.

**How an Object becomes eligible for GC:**
1. Nullifying the reference variable (\`obj = null;\`).
2. Re-assigning reference variable (\`obj1 = obj2;\`).
3. Objects created inside a method going out of scope.
4. Island of isolation (objects referencing each other, but unreachable from GC Roots).

**Generational Heap Model:**
• **Young Generation:** Eden Space and Survivor Spaces (S0, S1). Most objects die young (Minor GC).
• **Old (Tenured) Generation:** Long-surviving objects promoted from Young Gen (Major / Full GC).

💡 **Interview Trap:** Can you force Garbage Collection? No! Calling \`System.gc()\` only requests or suggests to the JVM to run GC, but there is no guarantee it will run immediately.`;
  }

  // Python: List vs Tuple
  if (['list vs tuple', 'tuple vs list', 'difference between list and tuple'].some(k => lower.includes(k))) {
    return `**List vs Tuple** in Python:

1. **Mutability:**
   • \`List\` is **mutable** (\`[1, 2, 3]\`): you can append, delete, or change elements in place.
   • \`Tuple\` is **immutable** (\`(1, 2, 3)\`): once created, elements cannot be altered or appended.

2. **Memory & Performance:**
   • Tuples consume less memory because Python allocates a single fixed block of memory.
   • Lists over-allocate memory to allow O(1) amortized appending, resulting in higher memory overhead.
   • Iterating over a tuple is slightly faster than a list.

3. **Dictionary Keys:**
   • Because tuples are immutable, they are **hashable** and can be used as dictionary keys.
   • Lists are unhashable and will throw \`TypeError: unhashable type: 'list'\` if used as a dict key.

💡 **Rule of Thumb:** Use a list for collections that grow or shrink; use a tuple for fixed heterogeneous records (e.g. \`point = (x, y, z)\`).`;
  }

  // Python: Decorators
  if (['decorator', 'python decorator', 'what are decorators'].some(k => lower.includes(k))) {
    return `A **Decorator** in Python is a higher-order function that takes another function as an argument, extends or modifies its behavior without altering its source code, and returns the modified function.

**Syntax:** Defined using the \`@decorator_name\` syntax above a function.

**Practical Example (Execution Timer):**
\`\`\`python
import time

def timer_decorator(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.time() - start:.4f}s")
        return result
    return wrapper

@timer_decorator
def process_data():
    time.sleep(0.5)
\`\`\`

💡 **Common Use Cases:** Authentication checks, logging, rate limiting, and caching (e.g. \`@lru_cache\`).`;
  }

  // Python: Generators & Yield
  if (['generator', 'yield in python', 'python generator'].some(k => lower.includes(k))) {
    return `A **Generator** in Python is a special type of function that produces a sequence of values on-the-fly using the **\`yield\`** keyword instead of \`return\`.

**Key Differences:**
• A normal function executes completely and returns the entire collection at once into memory.
• A generator function pauses execution at \`yield\`, remembers its local state, and yields one item at a time when \`next()\` is called.

**Why is it so powerful? (Memory Efficiency):**
If you need to process a 10 GB file or 10,000,000 database rows:
• A list comprehension \`[x for x in range(10_000_000)]\` consumes ~400 MB of RAM immediately.
• A generator \`(x for x in range(10_000_000))\` consumes only ~120 bytes of RAM because only one item exists in memory at any given millisecond!`;
  }

  // ACID Properties
  if (['acid', 'acid properties'].some(k => lower.includes(k))) {
    return `**ACID Properties** in relational database management systems (RDBMS) guarantee that database transactions are processed reliably:

1. **A — Atomicity ('All or Nothing'):**
   • Either every single SQL query in the transaction succeeds, or the whole transaction is rolled back. If money is deducted from Account A, it MUST be credited to Account B, or both revert.
2. **C — Consistency:**
   • The database transitions from one valid state to another, enforcing all schema constraints, foreign keys, and unique checks.
3. **I — Isolation:**
   • Concurrent transactions execute independently without interfering with each other (controlled via Isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable).
4. **D — Durability:**
   • Once a transaction is committed, its changes are written permanently to disk/write-ahead log and will not be lost even during power failure or server crashes.`;
  }

  // Database Indexing
  if (['index in sql', 'database index', 'indexing', 'what is an index'].some(k => lower.includes(k))) {
    return `A **Database Index** is a data structure (typically a **B-Tree** or **B+Tree**) that improves the speed of data retrieval operations on a database table at the cost of additional storage and slower writes.

**Real-world Analogy:** Think of an index at the back of a 1,000-page textbook. Instead of reading all 1,000 pages line-by-line to find 'Polymorphism' (Full Table Scan O(N)), you look at the index and jump directly to page 245 in O(log N) time.

**Clustered vs Non-Clustered Index:**
• **Clustered Index:** Dictates the actual physical storage order of rows in the table. There can only be **ONE** clustered index per table (typically the Primary Key).
• **Non-Clustered Index:** A separate lookup table that contains sorted index keys and pointers to the actual data rows. A table can have multiple non-clustered indexes.

⚠️ **The Trade-off:** Every time you run \`INSERT\`, \`UPDATE\`, or \`DELETE\`, the database must also update all associated indexes, degrading write performance.`;
  }

  // Normalization
  if (['normalization', 'normal form', '1nf', '2nf', '3nf'].some(k => lower.includes(k))) {
    return `**Database Normalization** is a systematic approach of organizing fields and tables in a relational database to minimize data redundancy and prevent update/delete anomalies.

**The First Three Normal Forms (Most Common in Interviews):**
1. **1NF (First Normal Form):**
   • Every column must contain atomic (indivisible) values.
   • No repeating groups or arrays stored in a single column.
2. **2NF (Second Normal Form):**
   • Must be in 1NF.
   • Eliminates **partial functional dependency**: all non-key attributes must depend on the *entire* primary key, not a part of a composite key.
3. **3NF (Third Normal Form):**
   • Must be in 2NF.
   • Eliminates **transitive dependency**: non-key attributes must not depend on other non-key attributes (e.g., ZipCode determining City/State should be separated).

💡 **When do we Denormalize?** In data warehouses and read-heavy systems, we intentionally denormalize tables to avoid expensive multi-table SQL \`JOIN\` operations.`;
  }

  // SQL JOINs
  if (['sql join', 'joins in sql', 'inner join vs left join', 'types of join'].some(k => lower.includes(k))) {
    return `Here is the visual guide to **SQL JOINs**:

• **INNER JOIN:** Returns only the rows where there is a match in BOTH tables.
  → \`SELECT * FROM Students S INNER JOIN Grades G ON S.id = G.student_id;\`

• **LEFT (OUTER) JOIN:** Returns ALL rows from the left table, plus matched rows from the right table. If no match exists, NULLs are returned for right-table columns.
  → Used when you want all students, even those who haven't taken any exams yet.

• **RIGHT (OUTER) JOIN:** Returns ALL rows from the right table, plus matched rows from the left table.

• **FULL (OUTER) JOIN:** Returns all rows when there is a match in either left or right table.

💡 **Interview Question:** *'What is a CROSS JOIN?'* It produces the Cartesian product of two tables (multiplying rows: 5 rows * 4 rows = 20 rows).`;
  }

  // Process vs Thread
  if (['process vs thread', 'thread vs process', 'difference between process and thread'].some(k => lower.includes(k))) {
    return `**Process vs Thread** in Operating Systems:

1. **Definition:**
   • A **Process** is an executing program with its own dedicated memory space, registers, file descriptors, and call stack.
   • A **Thread** is the smallest unit of execution *within* a process (often called a lightweight process).

2. **Memory Sharing:**
   • Processes do NOT share memory by default (communication requires Inter-Process Communication: IPC like sockets, pipes, shared memory).
   • Threads belonging to the same process share the process's Heap memory, code segment, and global variables, but have their own independent Call Stack and Program Counter (PC).

3. **Creation & Context Switching Overhead:**
   • Creating a process and context-switching between processes is heavy on CPU resources.
   • Thread creation and context switching is significantly faster and cheaper.

⚠️ **Downside:** If one thread crashes due to a segmentation fault, it can crash the entire parent process.`;
  }

  // Deadlock
  if (['deadlock', 'coffman'].some(k => lower.includes(k))) {
    return `A **Deadlock** is a situation in concurrent computing where two or more processes are permanently blocked because each holds a resource the other needs, and neither can proceed.

**Coffman's 4 Necessary Conditions for Deadlock:**
1. **Mutual Exclusion:** Resources cannot be shared simultaneously.
2. **Hold and Wait:** A process holding at least one resource is waiting to acquire additional resources held by other processes.
3. **No Preemption:** Resources cannot be forcibly taken from a process holding them.
4. **Circular Wait:** A closed chain of processes exists where P1 waits for P2, P2 waits for P3, and Pn waits for P1.

**How to Prevent Deadlocks:**
• **Enforce Resource Ordering:** Require all processes to request resources in a strict global numerical order (breaks Circular Wait).
• **Timeouts with Retries:** If a lock cannot be acquired within 500ms, release all held locks and retry later with jitter.`;
  }

  // TCP vs UDP
  if (['tcp vs udp', 'udp vs tcp', 'difference between tcp and udp'].some(k => lower.includes(k))) {
    return `**TCP vs UDP** at the Transport Layer:

| Feature | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |
| :--- | :--- | :--- |
| **Connection** | Connection-oriented (**3-Way Handshake**: SYN, SYN-ACK, ACK) | Connectionless (sends packets immediately) |
| **Reliability** | Guaranteed delivery (retransmits lost packets) | No guarantee (best-effort delivery) |
| **Ordering** | Guarantees packets arrive in exact order | Packets may arrive out of order |
| **Speed** | Slower (acknowledgment and congestion control overhead) | Extremely fast and low latency |
| **Header Size**| 20–60 bytes | 8 bytes |

🎯 **Use Cases:**
• Use **TCP** for: Web pages (HTTP/HTTPS), File transfers (FTP), Emails (SMTP) — where missing a single byte corrupts data.
• Use **UDP** for: Live video streaming (Zoom, YouTube Live), Online gaming, DNS, Voice over IP (VoIP) — where speed matters more than retransmitting a dropped millisecond.`;
  }

  // 4. Behavioral & Interview Specific Questions

  // Project Explanation Blueprint
  if (['project', 'explain my project', 'final year project', 'how to explain project'].some(k => lower.includes(k))) {
    return `Here is the proven **5-Step Blueprint** to explain your college or portfolio project in an interview:

1. **1-Sentence Elevator Pitch (The Problem):**
   • *'I built [Project Name], a web platform that solves [Problem] for [Target Users].'*

2. **Tech Stack & Architecture (30 sec):**
   • *'For the backend, I chose [e.g. Java Spring Boot / Python FastAPI] with [PostgreSQL / SQLite] for relational transactions, and built the frontend in React.'*

3. **Your Specific Individual Ownership:**
   • Never say 'we just worked on it'. Say: *'My primary responsibility was designing the database schema, building the REST API endpoints, and implementing JWT authentication.'*

4. **The Hardest Technical Challenge You Solved:**
   • *'One major hurdle we faced was slow API response times when fetching search results. I diagnosed the bottleneck, added a database index on the product title column, and response times dropped from 850ms to 45ms.'*

5. **Impact & Outcome:**
   • *'We deployed it with Docker and tested it with 50 concurrent active test users.'*`;
  }

  // Why should we hire you
  if (['why should we hire you', 'why hire you'].some(k => lower.includes(k))) {
    return `To answer **'Why should we hire you?'** as a fresher, focus on the intersection of your technical foundation, your proactive work ethic, and your ability to learn quickly:

**Winning 3-Part Answer Formula:**
1. **Strong Core Fundamentals:** *'First, I have built a solid foundation in ${profile.targetRole} skills — particularly in core programming, clean code structure, and problem solving.'*
2. **Demonstrated Hands-on Application:** *'Unlike just reading theory, I have applied these skills in practical projects, such as building APIs and working with databases, where I learned how to troubleshoot real runtime bugs.'*
3. **High Learning Agility & Energy:** *'As an entry-level engineer, I am hungry to absorb your engineering practices, contribute immediately to sprint tickets, and take ownership of tasks with minimal hand-holding.'*`;
  }

  // Where do you see yourself in 5 years
  if (['where do you see yourself in 5 years', '5 years'].some(k => lower.includes(k))) {
    return `When interviewers ask **'Where do you see yourself in 5 years?'**, they want to know if you have clear career ambition and if you plan to stay long enough to provide a return on their training investment.

**Strong Structure for Freshers:**
• **Years 1–2 (Deep Technical Execution):** *'In the first two years, my goal is to master your codebase, write production-grade reliable code, and become an independent, go-to contributor on the engineering team.'*
• **Years 3–4 (System Design & Mentorship):** *'By years three and four, I see myself taking ownership of larger architectural modules, contributing to system design decisions, and mentoring incoming interns and junior developers.'*
• **Year 5 (Technical Leadership):** *'In five years, I aim to lead critical technical features from ideation to production while aligning engineering outcomes with business goals.'*`;
  }

  // Questions to ask the interviewer
  if (['questions to ask the interviewer', 'what questions should i ask'].some(k => lower.includes(k))) {
    return `Never say *'No, I don't have any questions'*. Asking intelligent questions at the end of an interview proves you are genuinely invested in their team.

Here are **3 high-impact questions** to ask the hiring manager or technical interviewer:
1. **Engineering Culture:** *'What does the typical deployment pipeline look like here — how frequently does the team ship code to production, and how are code reviews conducted?'*
2. **Onboarding & Expectations:** *'For someone starting in this role, what would a successful first 90 days look like to you?'*
3. **Current Engineering Challenges:** *'What is one of the most interesting technical challenges or scaling bottlenecks your team is currently working through?'*`;
  }

  // Career gap / low GPA / backlogs
  if (['gap', 'low gpa', 'low marks', 'backlog'].some(k => lower.includes(k))) {
    return `How to address a **career gap, low GPA, or past backlogs** with confidence:

1. **Be Honest and Direct (15 Seconds):** Don't make defensive excuses. Acknowledge it briefly: *'During my second year of college, my grades dipped because I struggled with time management and over-committed across multiple activities.'*
2. **Show the Pivot & Action Taken (30 Seconds):** *'I recognized this as a wake-up call. I restructured my study habits, adopted a strict schedule, and dedicated focused hours to technical problem solving.'*
3. **Pivot to Tangible Proof of Competence (Now):** *'Since then, I channeled my energy into building real projects on GitHub, solving algorithmic coding challenges, and mastering ${profile.targetRole} fundamentals. My hands-on project results reflect the disciplined engineer I am today.'*`;
  }

  // Weaknesses
  if (['weakness', 'greatest weakness'].some(k => lower.includes(k))) {
    return `Answering **'What is your greatest weakness?'** requires authentic self-awareness paired with active corrective measures. Never give cliché non-answers like 'I work too hard'.

**Winning 3-Part Formula:**
1. **Name a genuine, non-fatal professional trait:** *'Early in my projects, I had a tendency to dive directly into coding before spending adequate time mapping out edge cases and architectural diagrams.'*
2. **Describe the realization:** *'During a group project, this led to refactoring mid-sprint when a dependency changed.'*
3. **Show your active mitigation:** *'Since then, I adopted a mandatory pre-coding workflow: I sketch data flows and write test cases on paper first. This discipline has made my implementations significantly cleaner and reduced bugs.'*

This proves you are reflective, coachable, and proactive.`;
  }

  // Salary & Negotiation
  if (['salary', 'pay', 'compensation', 'package', 'expectation'].some(k => lower.includes(k))) {
    return `Great question! Here's a structured approach to salary conversations: 💰

1. **Benchmark Beforehand:** Research entry-level salaries for "${profile.targetRole}" in your region on Glassdoor so you have an accurate target band.
2. **Deflect Early In The Process:** If asked before an offer is made, say: "I am primarily focused on finding the right role where I can make an impact. I am confident we can agree on a competitive package based on company standards."
3. **Give a Range, Not a Single Fixed Number:** If pressed, provide a reasonable range (e.g., $X to $Y) emphasizing total growth opportunities.

Keep your tone collaborative and confident!`;
  }

  // STAR Method
  if (['star method', 'star framework', 'behavioral question', 'behavioral interview'].some(k => lower.includes(k))) {
    return `The STAR method is the gold standard for behavioral interviews: ⭐

• **S (Situation):** Set the stage concisely in 1-2 sentences. (Where were you? What was the context?)
• **T (Task):** What was your specific goal or challenge?
• **A (Action):** What specific actions did YOU take? (Use "I", not just "we". Highlight technical choices and teamwork.)
• **R (Result):** What was the tangible, measurable outcome? (e.g., "Reduced response latency by 35% and shipped 2 days early.")

Spend 70% of your time on Action and Result — that's where hiring managers evaluate your capability!`;
  }

  // Communication
  if (['communication', 'speak', 'fluency', 'filler', 'stammer'].some(k => lower.includes(k))) {
    return `Want to elevate your interview speaking delivery? Try these 3 proven techniques: 🎙️

1. **Embrace Silent Pauses:** When you need a second to think, pause in complete silence instead of saying "um", "uh", or "like". Silence projects executive confidence.
2. **Daily 60-Second JAM Drills:** Pick a random topic from our JAM module and speak continuously for 60 seconds without filler words.
3. **Structure Every Answer:** Before speaking, mentally group your thoughts into 2-3 points: "There are two main reasons: first... and second..."

Your current communication score is ${scores.communication}/100 — consistent daily practice will boost it rapidly! 📈`;
  }

  // Self Introduction
  if (['tell me about yourself', 'self intro', 'introduction', 'pitch'].some(k => lower.includes(k))) {
    return `Here is a winning 3-part framework for "Tell me about yourself": 🗣️

1. **Present (30 sec):** "Hi! I am a ${profile.branch || 'computer science'} student focused on ${profile.targetRole} roles with a strong background in ${(profile.knownSkills && profile.knownSkills.slice(0, 2).join(' and ')) || 'software development'}."
2. **Past (40 sec):** "Over the past year, I've built practical applications including an API backend where I implemented database indexing and authentication."
3. **Future (20 sec):** "I'm excited about this opportunity because your team is solving large-scale challenges, and I want to contribute to high-performance systems."

Practice this out loud in under 90 seconds!`;
  }

  // Direct Technical Answers
  if (['quicksort', 'quick sort'].some(k => lower.includes(k))) {
    return `**QuickSort** is a comparison-based divide-and-conquer sorting algorithm:
1. **Choose Pivot:** Pick an element (first, last, random, or median-of-three).
2. **Partition:** Rearrange elements so values smaller than pivot go left, and greater go right. Pivot is now in sorted position.
3. **Recurse:** Recursively sort left and right sub-arrays.
• **Time Complexity:** Average \`O(N log N)\`, Worst \`O(N^2)\` (mitigated by random pivot).
• **Space Complexity:** \`O(log N)\` auxiliary stack space (in-place).`;
  }

  if (['mergesort', 'merge sort'].some(k => lower.includes(k))) {
    return `**MergeSort** is a stable divide-and-conquer sorting algorithm:
1. **Divide:** Recursively split the array in half until single elements remain.
2. **Conquer:** Merge sorted halves back together in linear time.
• **Time Complexity:** Guaranteed \`O(N log N)\` in best, average, and worst cases!
• **Space Complexity:** \`O(N)\` extra memory for merge buffers.`;
  }

  if (['binary search', 'bsearch'].some(k => lower.includes(k))) {
    return `**Binary Search** finds an element in a sorted array in **O(log N)**:
\`\`\`python
def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
\`\`\`
Always compute \`mid = low + (high - low) // 2\` to prevent integer overflow!`;
  }

  if (['rest api', 'restful', 'rest vs graphql'].some(k => lower.includes(k))) {
    return `**REST (Representational State Transfer):**
• **Stateless:** Server stores no client session context (uses JWT in Authorization header).
• **Uniform Interface:** Clean resource URIs (\`/api/v1/users\`) with standard HTTP verbs: GET (read), POST (create), PUT/PATCH (update), DELETE (remove).
• **Idempotent:** GET, PUT, DELETE produce same result on repeated calls.
• **vs GraphQL:** REST can over/under-fetch data; GraphQL queries exact fields in one request but has higher backend caching complexity.`;
  }

  if (['microservice', 'microservices vs monolith', 'monolith'].some(k => lower.includes(k))) {
    return `**Monolith vs Microservices:**
• **Monolith:** Single unified deployment. Easy to develop, debug, and test locally early on. Bottlenecks when scaling large teams.
• **Microservices:** Loosely coupled independent services per business domain. Enables independent deployments and polyglot tech stacks, but introduces distributed tracing, network latency, and eventual consistency challenges.`;
  }

  if (['sql vs nosql', 'nosql vs sql'].some(k => lower.includes(k))) {
    return `**SQL vs NoSQL Databases:**
1. **SQL (PostgreSQL, MySQL):** Strict schema, ACID transactional guarantees, relational JOINs. Best for financial, order management, and core business models.
2. **NoSQL (MongoDB, Redis, Cassandra):** Flexible schema, BASE eventual consistency, high horizontal write scaling. Best for real-time analytics, user sessions, or unstructured documents.`;
  }

  if (['docker', 'container vs vm'].some(k => lower.includes(k))) {
    return `**Docker Containers vs Virtual Machines:**
• **Virtual Machines:** Hypervisor runs a full Guest OS (GBs of RAM, slow boot).
• **Docker Containers:** Isolated user-space processes sharing the Host OS kernel via Linux namespaces and cgroups (MBs of RAM, millisecond boot).
• **Core Triad:** \`Dockerfile\` (recipe) -> \`Image\` (immutable snapshot) -> \`Container\` (live execution instance).`;
  }

  if (['tcp vs udp', 'tcp and udp'].some(k => lower.includes(k))) {
    return `**TCP vs UDP:**
• **TCP:** Connection-oriented (3-way handshake SYN->SYN/ACK->ACK), guaranteed ordered delivery via ACKs, congestion/flow control. Used by HTTP/HTTPS, SSH.
• **UDP:** Connectionless best-effort delivery, minimal 8-byte header, ultra-low latency. Used by DNS, live gaming, video streaming (VoIP).`;
  }

  // Data Analyst & Business Intelligence Skills
  if (['data analyst', 'data analytics', 'business analyst', 'bi analyst', 'business intelligence'].some(k => lower.includes(k))) {
    return `**Essential Skills Required for a Data Analyst:**

📊 **1. Advanced SQL & Database Querying (Most Critical)**
• **Complex Joins & Aggregations:** Inner, Left, Full Outer joins, \`GROUP BY\`, \`HAVING\` filters.
• **Window Functions:** \`ROW_NUMBER()\`, \`RANK()\`, \`DENSE_RANK()\`, \`LEAD()\`, \`LAG()\`, running totals.
• **Subqueries & CTEs:** Common Table Expressions (\`WITH\` clauses) to organize complex analytical queries.
• **Query Optimization:** Understanding indexes, execution plans, and reducing table scan overhead.

📈 **2. Business Intelligence & Dashboarding (Power BI or Tableau)**
• **Power BI:** DAX expressions (\`CALCULATE\`, \`SUMX\`, \`RELATED\`), Star Schema data modeling, Power Query transformations.
• **Tableau:** Level of Detail (LOD) expressions, calculated fields, dynamic parameters, interactive storytelling dashboards.
• Translating messy business data into intuitive, executive-ready KPI visuals.

📑 **3. Advanced Excel & Google Sheets**
• Lookups: \`XLOOKUP\`, \`INDEX-MATCH\`, multi-condition lookups.
• Dynamic Pivot Tables, Pivot Charts, Slicers, and Power Pivot.
• Scenario Manager, Goal Seek, and automated macros.

🐍 **4. Python (or R) for Exploratory Data Analysis (EDA)**
• **Pandas:** Data munging, handling missing/null values, filtering, grouping, merging datasets.
• **NumPy:** Vectorized numerical operations and array manipulations.
• **Matplotlib & Seaborn:** Heatmaps, histograms, box plots, scatter plots for correlation discovery.

📐 **5. Applied Business Statistics & Storytelling**
• Descriptive stats (Mean, Median, Standard Deviation, Percentiles, Outlier detection).
• Inferential stats (Hypothesis testing, p-values, A/B testing frameworks, confidence intervals).
• **Business Acumen:** Ability to translate numbers into actionable revenue, retention, and conversion recommendations.

💡 **Portfolio Project Idea:** Build an end-to-end Sales or Customer Churn Analytics dashboard: extract raw transactions from PostgreSQL, clean with Python Pandas, model in Power BI/Tableau, and present key takeaways in an executive summary.`;
  }

  // Frontend Developer Skills
  if (['frontend', 'front-end', 'react developer', 'web developer'].some(k => lower.includes(k)) && ['skill', 'skills', 'learn', 'roadmap', 'become', 'require', 'needed'].some(k => lower.includes(k))) {
    return `**Essential Skills Required for a Frontend Developer:**

🎨 **1. Web Standards & Markup:** HTML5 semantic structure, modern CSS3 (Flexbox, CSS Grid), responsive design, and Tailwind CSS.
⚡ **2. JavaScript & TypeScript:** Modern ES6+, Async/Await, Event Loop, DOM performance (debouncing/throttling), and strict TypeScript typing.
⚛️ **3. React & Next.js:** Functional components, hooks (\`useState\`, \`useEffect\`, \`useMemo\`, custom hooks), state management (Zustand/Redux), Next.js App Router for SSR/SSG.
🛠️ **4. Build & Testing Tooling:** Vite, npm/pnpm, Git workflows, Jest/React Testing Library, and Core Web Vitals optimization.`;
  }

  // Backend Developer Skills
  if (['backend', 'back-end'].some(k => lower.includes(k)) && ['skill', 'skills', 'learn', 'roadmap', 'become', 'require', 'needed'].some(k => lower.includes(k))) {
    return `**Essential Skills Required for a Backend Developer:**

☕ **1. Core Language & Framework:** Java (Spring Boot), Python (FastAPI/Django), or Node.js (Express/NestJS).
🗄️ **2. Databases & Caching:** Relational databases (PostgreSQL/MySQL) with indexing, ACID transactions, and Redis in-memory caching.
🔌 **3. API Architecture:** RESTful API standards, status codes, JWT authentication, OAuth 2.0, WebSockets, and GraphQL.
☁️ **4. Microservices & DevOps:** Docker containerization, Kafka/RabbitMQ message queues, and CI/CD pipelines.`;
  }

  // Cloud & DevOps Skills
  if (['devops', 'cloud engineer', 'cloud computing'].some(k => lower.includes(k)) && ['skill', 'skills', 'learn', 'roadmap', 'become', 'require', 'needed'].some(k => lower.includes(k))) {
    return `**Skills Required for a Cloud & DevOps Engineer:**

🐧 **1. Linux & Scripting:** Bash scripting, process monitoring, permissions, SSH, networking commands.
🐳 **2. Containerization & Orchestration:** Docker multi-stage images and Kubernetes (Pods, Deployments, Services, Helm).
☁️ **3. Public Cloud Platform:** Deep proficiency in AWS (EC2, S3, RDS, Lambda, IAM, VPC), Azure, or GCP.
🏗️ **4. Infrastructure as Code (IaC):** Terraform deterministic provisioning and Ansible.
🔄 **5. CI/CD & Observability:** GitHub Actions/GitLab CI pipelines, Prometheus metrics, and Grafana dashboards.`;
  }

  // Bubble Sort
  if (['bubble sort', 'bubblesort'].some(k => lower.includes(k))) {
    return `**Bubble Sort** is a comparison-based sorting algorithm:
1. **Mechanism:** It repeatedly steps through the array, compares adjacent elements, and swaps them if they are in the wrong order.
2. In each pass, the largest unsorted element "bubbles up" to its correct position at the end.
• **Time Complexity:** Average & Worst: \`O(N^2)\`, Best Case: \`O(N)\` (with an early-termination \`swapped\` flag).
• **Space Complexity:** \`O(1)\` auxiliary memory (in-place).
• **Stability:** Stable (preserves relative order of equal elements).

\`\`\`python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr
\`\`\``;
  }

  // Cybersecurity Skills & Overview
  if (['cybersecurity', 'cyber security', 'infosec'].some(k => lower.includes(k))) {
    return `**Essential Skills Required for Cybersecurity:**

🛡️ **1. Networking Fundamentals:**
• Deep knowledge of the OSI Model, TCP/IP stack, DNS, DHCP, and Subnetting.
• Packet analysis using **Wireshark** and network scanning using **Nmap**.
• Understanding Firewalls, VPNs, and IDS/IPS architectures.

🐧 **2. Operating Systems & Scripting:**
• **Linux:** Permissions (\`chmod\`, \`chown\`), process management, system log auditing.
• **Python & Bash:** Writing security audit scripts, log scrapers, and automation tools.

🔐 **3. Security Concepts & Cryptography:**
• The **CIA Triad** (Confidentiality, Integrity, Availability).
• Encryption (AES, RSA), Hashing (SHA-256), SSL/TLS handshakes, and Public Key Infrastructure.
• OWASP Top 10 vulnerabilities (SQL Injection, XSS, CSRF).

📜 **4. Certifications & Pathways:**
• CompTIA Security+, CEH (Certified Ethical Hacker), eJPT, and OSCP.`;
  }

  // Binary Search Tree (BST)
  if (['binary search tree', 'bst', 'binary tree'].some(k => lower.includes(k))) {
    return `**Binary Tree vs Binary Search Tree (BST):**
• **Binary Tree:** A tree where every node has at most two children (left and right). No value ordering is enforced.
• **Binary Search Tree (BST):** Enforces a strict ordering invariant:
  1. All values in left subtree < root value.
  2. All values in right subtree > root value.
• **Time Complexity:** \`O(log N)\` average search/insert/delete; \`O(N)\` in degenerate skewed trees.
• **Key Property:** An **in-order traversal** of a BST visits nodes in strictly sorted ascending order!`;
  }

  // Greetings / Brief query
  if (lower.split(' ').length <= 3 && ['hi', 'hello', 'help', 'hey', 'start'].some(k => lower.includes(k))) {
    return `Hello ${profile.name || 'there'}! I'm your PrepSpire AI Career Coach. I'm here to help you ace your ${profile.targetRole} interviews.

Here are a few ways we can work together right now:
1. **Technical Prep:** Ask me to explain concepts (Bubble Sort, Java HashMaps, SQL indexing, REST APIs, or Cybersecurity).
2. **Coding Roadmaps:** Tell me your current comfort level and we'll create a step-by-step problem-solving strategy.
3. **Behavioral & HR Practice:** Practice 'Tell me about yourself' or answer conflict questions with the STAR method.
4. **Diagnostic Review:** Review your weakest areas based on your latest interview scores.

What would you like to focus on today?`;
  }

  // Dynamic Topic Responder for any arbitrary question
  // 1. Role skills/roadmap detection
  const rolePattern = /^(?:what\s+(?:are\s+)?(?:the\s+)?(?:essential\s+|key\s+|required\s+)?skills?\s+(?:are\s+)?(?:required|require|needed|necessary)?\s*(?:for|of|to\s+become\s+a?|to\s+become)?|skills?\s+(?:required|require|needed|necessary)?\s*(?:for|of|to\s+become\s+a?|to\s+become)?|how\s+to\s+become\s+(?:a|an)?|roadmap\s+(?:for|to\s+become\s+a?)?)\s*(.+)$/i;
  const mRole = text.match(rolePattern);
  const mRoleSuffix = text.match(/^(.*?)\s+(?:required\s+|needed\s+)?(?:skills?|roadmap)$/i);

  let extractedRole = '';
  if (mRole) {
    extractedRole = mRole[1].replace(/[?!.]/g, '').trim();
  } else if (mRoleSuffix) {
    extractedRole = mRoleSuffix[1].replace(/[?!.]/g, '').trim();
  } else if (['skills for', 'skills required', 'skills require', 'skills needed', 'roadmap for'].some(k => lower.includes(k))) {
    extractedRole = text.replace(/^(?:.*?\b(?:skills\s+(?:for|required\s+for|require\s+for|needed\s+for)|roadmap\s+for)\s+)/i, '').replace(/[?!.]/g, '').trim();
  }

  if (extractedRole && extractedRole.length > 1) {
    const roleTitle = extractedRole.charAt(0).toUpperCase() + extractedRole.slice(1);
    return `**Career Blueprint & Skills Required for ${roleTitle}:**

🎯 **1. Role Overview & Industry Purpose:**
A **${roleTitle}** is responsible for delivering reliable, scalable, and high-impact solutions in this domain. Industry employers prioritize candidates who blend strong technical execution with problem-solving acumen.

🛠️ **2. Core Technical Competencies & Tooling:**
• **Domain Foundations:** Core theory, architecture standards, and best practices standard in ${roleTitle} positions.
• **Primary Tech Stack:** Industry-standard programming languages, frameworks, libraries, and automated testing tools.
• **Version Control & DevOps:** Git branching workflows, CI/CD pipeline triggers, and cloud environment deployments.

💻 **3. Recommended Portfolio Projects:**
• Build 2 end-to-end, production-grade applications that solve genuine problems (with live demo URLs and clean GitHub code).
• Document your system architecture diagrams, database schema, and operational trade-offs in clear README files.

🚀 **4. Interview Preparation Strategy:**
• **Technical Screening:** Review high-frequency domain concepts, data structures, and edge-case handling.
• **Behavioral Round (STAR):** Prepare 3 narrative examples highlighting teamwork, technical problem-solving, and overcoming project bottlenecks.

Would you like a step-by-step 30-day study roadmap or project ideas tailored to ${roleTitle}?`;
  }

  // 2. Concept / Architecture / Algorithm explanation
  const cleanConcept = text.replace(/^(what\s+is|what\s+are|how\s+does|how\s+to|explain|describe|tell\s+me\s+about|give\s+details\s+on)\s+/i, '').replace(/[?!.]/g, '').trim();
  const displayTopic = cleanConcept ? (cleanConcept.charAt(0).toUpperCase() + cleanConcept.slice(1)) : text;

  if (lower.includes(' vs ') || lower.includes('versus') || lower.includes('difference between')) {
    return `**Technical Comparison: ${displayTopic}**

1. **Core Distinction & Architecture:**
• When evaluating technologies or concepts in this comparison, top engineering teams analyze operational trade-offs, scalability constraints, and development velocity.
• Choose the approach that minimizes operational overhead while satisfying latency, throughput, and consistency requirements.

2. **Key Trade-off Matrix:**
• **Performance & Latency:** Evaluate CPU and memory footprint under high traffic.
• **Complexity & Maintainability:** Avoid premature optimization; prefer simpler patterns until benchmarks justify complexity.
• **Use Case Alignment:** Align your architectural choice strictly with business requirements and data patterns.

3. **Interview Pro-Tip:**
In technical interviews, never state that one option is always superior. Frame your answer using trade-offs: *"Option A excels when high concurrency and low latency are needed, whereas Option B is optimal for rapid development and strict ACID guarantees."*`;
  }

  return `**Technical Deep Dive: ${displayTopic}**

📌 **1. Core Definition & Purpose:**
• **${displayTopic}** is a critical architectural and computational building block used to solve core engineering and system challenges efficiently.

⚙️ **2. Working Mechanism & Operational Flow:**
• It operates by breaking down operations into systematic, deterministic execution steps.
• In modern software engineering, systems leverage ${displayTopic} to maintain optimal complexity, high reliability, and predictable latency under scale.

⚖️ **3. Complexity & Architectural Trade-offs:**
• **Time vs Space:** Evaluate whether pre-computation, caching, or iterative traversal provides the optimal balance for your traffic profile.
• **Edge Cases:** Always account for null or empty inputs, concurrency boundaries, and data integrity guarantees.

💡 **4. High-Yield Interview Takeaway:**
When interviewers ask about ${displayTopic}, articulate your approach step-by-step: first clarify assumptions, explain the brute-force or baseline design, and then present the optimized solution with exact time and space complexity.`;
}

