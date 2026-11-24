import logging
from app.db.session import engine, Base, SessionLocal
import app.models  # Ensure all models are imported
from app.models.gamification import Badge
from app.models.communication import CommunicationPrompt
from app.models.jam import JAMTopic
from app.models.academic import AcademicQuestion
from app.models.coding import CodingChallenge

logger = logging.getLogger(__name__)

INITIAL_BADGES = [
    {
        "slug": "first_interview",
        "title": "First Interview Completed",
        "description": "Completed your first comprehensive AI Mock Interview session.",
        "icon": "🏆",
        "category": "Interview",
        "xp_reward": 100,
        "condition_type": "first_interview",
        "condition_value": 1
    },
    {
        "slug": "communication_starter",
        "title": "Communication Starter",
        "description": "Completed your first speech or communication practice drill.",
        "icon": "🎙️",
        "category": "Communication",
        "xp_reward": 50,
        "condition_type": "communication_1",
        "condition_value": 1
    },
    {
        "slug": "five_jam_sessions",
        "title": "Five JAM Sessions",
        "description": "Successfully conquered 5 Just-A-Minute impromptu speech challenges.",
        "icon": "⚡",
        "category": "JAM",
        "xp_reward": 150,
        "condition_type": "jam_5",
        "condition_value": 5
    },
    {
        "slug": "ten_coding_problems",
        "title": "Ten Coding Problems",
        "description": "Submitted solutions for 10 data structures and algorithms challenges.",
        "icon": "💻",
        "category": "Coding",
        "xp_reward": 200,
        "condition_type": "coding_10",
        "condition_value": 10
    },
    {
        "slug": "seven_day_streak",
        "title": "Seven-Day Practice Streak",
        "description": "Maintained a continuous daily preparation streak for 7 days.",
        "icon": "🔥",
        "category": "Consistency",
        "xp_reward": 250,
        "condition_type": "streak_7",
        "condition_value": 7
    },
    {
        "slug": "academic_champion",
        "title": "Academic Revision Champion",
        "description": "Achieved > 80% accuracy in core computer science academic quizzes.",
        "icon": "📚",
        "category": "Academic",
        "xp_reward": 150,
        "condition_type": "academic_80",
        "condition_value": 80
    }
]

INITIAL_JAM_TOPICS = [
    {"topic_text": "Is AI a threat or an opportunity for future software engineers?", "category": "AI and technology", "difficulty": "Medium"},
    {"topic_text": "Should college attendance be mandatory for engineering students?", "category": "Education", "difficulty": "Easy"},
    {"topic_text": "Does social media improve or degrade authentic human communication?", "category": "Social media", "difficulty": "Medium"},
    {"topic_text": "Is failure an essential prerequisite for sustainable success?", "category": "Personal experiences", "difficulty": "Easy"},
    {"topic_text": "Should tech companies prioritize practical skills over university degrees?", "category": "Career development", "difficulty": "Medium"},
    {"topic_text": "Can artificial intelligence ever replicate genuine human empathy and creativity?", "category": "AI and technology", "difficulty": "Hard"},
    {"topic_text": "The environmental impact of cryptocurrency mining and data centers", "category": "Environment", "difficulty": "Hard"},
    {"topic_text": "Work from home versus office culture: Which creates better work-life balance?", "category": "Workplace scenarios", "difficulty": "Easy"},
    {"topic_text": "Ethics in autonomous vehicles: How should algorithms make life-or-death decisions?", "category": "Ethics", "difficulty": "Hard"},
    {"topic_text": "Leadership vs Management: Leading by influence rather than authority", "category": "Leadership and teamwork", "difficulty": "Medium"},
    {"topic_text": "The gig economy: Freedom of work or erosion of job security?", "category": "Society and culture", "difficulty": "Medium"},
    {"topic_text": "Why effective listening is the most underrated communication skill", "category": "Workplace communication", "difficulty": "Easy"}
]

INITIAL_COMMUNICATION_PROMPTS = [
    {
        "category": "Self-introduction",
        "difficulty": "Beginner",
        "prompt_text": "Deliver a professional 60-second elevator pitch introducing your academic background, core technical strengths, and what drives your ambition in tech.",
        "prep_time_seconds": 30,
        "speaking_time_seconds": 60,
        "tags": ["elevator-pitch", "introduction", "first-impression"]
    },
    {
        "category": "Conflict resolution",
        "difficulty": "Intermediate",
        "prompt_text": "Describe a scenario where you had a strong technical disagreement with a team member. How did you handle the situation and achieve a resolution?",
        "prep_time_seconds": 30,
        "speaking_time_seconds": 120,
        "tags": ["behavioral", "conflict", "teamwork"]
    },
    {
        "category": "Explaining technical concepts",
        "difficulty": "Intermediate",
        "prompt_text": "Explain the concept of API (Application Programming Interface) to a 10-year-old child using a relatable everyday analogy.",
        "prep_time_seconds": 30,
        "speaking_time_seconds": 120,
        "tags": ["technical-simplification", "clarity", "analogy"]
    },
    {
        "category": "Workplace communication",
        "difficulty": "Advanced",
        "prompt_text": "You are presenting a project update to senior stakeholders and have to break the news that a critical deadline will slip by one week due to unforeseen dependency bugs. How do you communicate this clearly and constructively?",
        "prep_time_seconds": 45,
        "speaking_time_seconds": 120,
        "tags": ["stakeholder-management", "crisis", "executive"]
    },
    {
        "category": "Career goals",
        "difficulty": "Beginner",
        "prompt_text": "Where do you envision your career trajectory in 3 to 5 years, and what concrete steps are you taking today to prepare for that milestone?",
        "prep_time_seconds": 30,
        "speaking_time_seconds": 90,
        "tags": ["vision", "planning", "hr"]
    }
]

INITIAL_ACADEMIC_QUESTIONS = [
    {
        "subject": "Data Structures and Algorithms",
        "topic": "Time Complexity",
        "difficulty": "Easy",
        "question_type": "mcq",
        "question_text": "What is the worst-case time complexity of searching for an element in an unsorted array of size N?",
        "options": ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
        "correct_answer": "O(N)",
        "explanation": "In an unsorted array, we may have to traverse every element from index 0 to N-1 to find the target item or determine it is absent, yielding O(N) linear time."
    },
    {
        "subject": "Object-Oriented Programming",
        "topic": "Polymorphism",
        "difficulty": "Medium",
        "question_type": "mcq",
        "question_text": "Which OOP concept allows the same method signature to exhibit different behaviors depending on the runtime instance?",
        "options": ["Encapsulation", "Dynamic / Runtime Polymorphism", "Data Hiding", "Inheritance"],
        "correct_answer": "Dynamic / Runtime Polymorphism",
        "explanation": "Method overriding at runtime allows a subclass to provide a specific implementation of a method that is already defined in its superclass."
    },
    {
        "subject": "DBMS",
        "topic": "ACID Properties",
        "difficulty": "Medium",
        "question_type": "mcq",
        "question_text": "In relational database ACID properties, which property ensures that all transactions are committed fully or rolled back entirely without leaving partial updates?",
        "options": ["Atomicity", "Consistency", "Isolation", "Durability"],
        "correct_answer": "Atomicity",
        "explanation": "Atomicity guarantees that all operations within a transaction unit succeed together, or the entire transaction is aborted and rolled back ('all-or-nothing')."
    },
    {
        "subject": "Operating Systems",
        "topic": "Deadlocks",
        "difficulty": "Hard",
        "question_type": "mcq",
        "question_text": "Which of the following is NOT one of the four Coffman conditions necessary for a deadlock to occur?",
        "options": ["Mutual Exclusion", "Hold and Wait", "Preemption Allowed", "Circular Wait"],
        "correct_answer": "Preemption Allowed",
        "explanation": "No preemption is a required Coffman condition. If resources can be preempted forcibly, deadlock can be broken or prevented."
    },
    {
        "subject": "Computer Networks",
        "topic": "TCP/IP vs OSI",
        "difficulty": "Easy",
        "question_type": "mcq",
        "question_text": "At which layer of the OSI model does the TCP protocol operate?",
        "options": ["Network Layer", "Transport Layer", "Data Link Layer", "Session Layer"],
        "correct_answer": "Transport Layer",
        "explanation": "TCP (Transmission Control Protocol) is a connection-oriented Transport layer (Layer 4) protocol that provides reliable end-to-end byte stream delivery."
    },
    {
        "subject": "Java",
        "topic": "Collections",
        "difficulty": "Easy",
        "question_type": "mcq",
        "question_text": "Which collection class in Java allows key-value storage and guarantees no duplicate keys?",
        "options": ["ArrayList", "HashMap", "Vector", "PriorityQueue"],
        "correct_answer": "HashMap",
        "explanation": "HashMap stores key-value pairs where each key must be unique based on its hashCode() and equals() contract."
    },
    {
        "subject": "Python",
        "topic": "Data Types",
        "difficulty": "Easy",
        "question_type": "mcq",
        "question_text": "Which of the following data structures in Python is immutable?",
        "options": ["List", "Dictionary", "Tuple", "Set"],
        "correct_answer": "Tuple",
        "explanation": "Tuples are immutable sequences in Python; their elements cannot be modified, added, or removed after creation."
    },
    {
        "subject": "SQL",
        "topic": "Queries",
        "difficulty": "Medium",
        "question_type": "mcq",
        "question_text": "Which SQL clause is used to filter aggregated grouped records resulting from a GROUP BY clause?",
        "options": ["WHERE", "HAVING", "ORDER BY", "LIMIT"],
        "correct_answer": "HAVING",
        "explanation": "WHERE filters rows before aggregation, while HAVING filters summary groups after the GROUP BY aggregation has occurred."
    },
    {
        "subject": "C and C++",
        "topic": "Pointers",
        "difficulty": "Medium",
        "question_type": "mcq",
        "question_text": "What does a dangling pointer in C/C++ refer to?",
        "options": [
            "A pointer initialized to NULL",
            "A pointer pointing to a memory location that has already been deallocated or freed",
            "A pointer to a function",
            "A void pointer with undefined cast"
        ],
        "correct_answer": "A pointer pointing to a memory location that has already been deallocated or freed",
        "explanation": "A dangling pointer arises when an object is deleted or deallocated without modifying the pointer value, leaving it pointing to invalid memory."
    },
    {
        "subject": "Software Engineering",
        "topic": "Design Principles",
        "difficulty": "Easy",
        "question_type": "mcq",
        "question_text": "In object-oriented software engineering, what is the Open/Closed Principle (OCP)?",
        "options": [
            "Software entities should be open for extension, but closed for modification",
            "Files should always be closed after opening",
            "Classes must be public or package-private",
            "Only open-source libraries should be imported"
        ],
        "correct_answer": "Software entities should be open for extension, but closed for modification",
        "explanation": "OCP states that modules should be written so that their behavior can be extended without altering their original source code."
    },
    {
        "subject": "Aptitude and Logical Reasoning",
        "topic": "Percentages",
        "difficulty": "Easy",
        "question_type": "mcq",
        "question_text": "A student scores 72 marks out of 90 in an exam. What is their percentage score?",
        "options": ["75%", "80%", "82%", "85%"],
        "correct_answer": "80%",
        "explanation": "(72 / 90) * 100 = 0.8 * 100 = 80%."
    },
    {
        "subject": "Artificial Intelligence",
        "topic": "Search Algorithms",
        "difficulty": "Easy",
        "question_type": "mcq",
        "question_text": "Which informed (heuristic) search algorithm evaluates nodes by combining g(n) (path cost) and h(n) (estimated cost to goal)?",
        "options": ["Breadth-First Search", "Depth-First Search", "A* Search", "Uniform Cost Search"],
        "correct_answer": "A* Search",
        "explanation": "A* Search evaluates f(n) = g(n) + h(n), balancing the actual path cost from start with the heuristic estimate to the goal."
    }
]

INITIAL_CODING_CHALLENGES = [
    {
        "title": "Two Sum",
        "slug": "two-sum",
        "difficulty": "Easy",
        "topic": "Arrays & Hash Table",
        "problem_statement": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
        "constraints": ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Only one valid answer exists."],
        "input_format": "nums = [2,7,11,15], target = 9",
        "output_format": "[0, 1]",
        "sample_test_cases": [
            {"input": "nums = [2,7,11,15], target = 9", "expected": "[0, 1]", "explanation": "nums[0] + nums[1] == 9, so return [0, 1]."},
            {"input": "nums = [3,2,4], target = 6", "expected": "[1, 2]", "explanation": "nums[1] + nums[2] == 6, so return [1, 2]."}
        ],
        "hidden_test_cases": [
            {"input": "nums = [3,3], target = 6", "expected": "[0, 1]"}
        ],
        "starter_code": {
            "python": "def two_sum(nums: list[int], target: int) -> list[int]:\n    # Write your solution here\n    pass\n",
            "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}\n",
            "cpp": "#include <vector>\n\nclass Solution {\npublic:\n    std::vector<int> twoSum(std::vector<int>& nums, int target) {\n        // Write your solution here\n        return {};\n    }\n};\n",
            "c": "int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your solution here\n    *returnSize = 0;\n    return 0;\n}\n"
        },
        "hints": [
            "A brute-force search takes O(N^2). Can you use a hash map to look up complements in O(1) time?",
            "Store each number's value and index as you iterate through the list."
        ],
        "expected_approach": "Use a hash table / dictionary to store the numbers visited along with their indices. For each number, compute target - num. If it exists in the hash table, return the saved index and current index. Time complexity O(N), space complexity O(N).",
        "explanation": "Hash mapping provides instantaneous lookup of complement values."
    },
    {
        "title": "Valid Palindrome",
        "slug": "valid-palindrome",
        "difficulty": "Easy",
        "topic": "Strings & Two Pointers",
        "problem_statement": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.",
        "constraints": ["1 <= s.length <= 2 * 10^5", "s consists only of printable ASCII characters."],
        "input_format": "s = \"A man, a plan, a canal: Panama\"",
        "output_format": "true",
        "sample_test_cases": [
            {"input": "s = \"A man, a plan, a canal: Panama\"", "expected": "true", "explanation": "\"amanaplanacanalpanama\" is a palindrome."},
            {"input": "s = \"race a car\"", "expected": "false", "explanation": "\"raceacar\" is not a palindrome."}
        ],
        "hidden_test_cases": [
            {"input": "s = \" \"", "expected": "true"}
        ],
        "starter_code": {
            "python": "def is_palindrome(s: str) -> bool:\n    # Write your solution here\n    pass\n",
            "java": "class Solution {\n    public boolean isPalindrome(String s) {\n        // Write your solution here\n        return false;\n    }\n}\n",
            "cpp": "#include <string>\n\nclass Solution {\npublic:\n    bool isPalindrome(std::string s) {\n        // Write your solution here\n        return false;\n    }\n};\n",
            "c": "#include <stdbool.h>\n\nbool isPalindrome(char* s) {\n    // Write your solution here\n    return false;\n}\n"
        },
        "hints": [
            "Filter out punctuation and spaces, then check symmetry from both ends."
        ],
        "expected_approach": "Two-pointer approach comparing left and right pointers inward, or filtering alphanumeric characters and checking string equality with its reverse.",
        "explanation": "Linear scan with O(1) auxiliary memory using two pointers."
    }
]

def init_db():
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")
    
    db = SessionLocal()
    try:
        # Seed badges if empty
        if db.query(Badge).count() == 0:
            for b in INITIAL_BADGES:
                badge = Badge(**b)
                db.add(badge)
            db.commit()
            logger.info("Seeded initial gamification badges.")
            
        # Seed JAM topics
        from app.data.seed_data import EXPANDED_COMMUNICATION_PROMPTS, EXPANDED_JAM_TOPICS
        existing_jam_texts = {t.topic_text for t in db.query(JAMTopic.topic_text).all()}
        all_jam_to_seed = INITIAL_JAM_TOPICS + EXPANDED_JAM_TOPICS
        added_jams = 0
        for t in all_jam_to_seed:
            if t["topic_text"] not in existing_jam_texts:
                topic = JAMTopic(**t)
                db.add(topic)
                existing_jam_texts.add(t["topic_text"])
                added_jams += 1
        if added_jams > 0:
            db.commit()
            logger.info(f"Seeded {added_jams} new JAM topics.")

        # Seed Communication Prompts
        existing_comm_texts = {p.prompt_text for p in db.query(CommunicationPrompt.prompt_text).all()}
        all_comm_to_seed = INITIAL_COMMUNICATION_PROMPTS + EXPANDED_COMMUNICATION_PROMPTS
        added_comms = 0
        for p in all_comm_to_seed:
            if p["prompt_text"] not in existing_comm_texts:
                prompt = CommunicationPrompt(**p)
                db.add(prompt)
                existing_comm_texts.add(p["prompt_text"])
                added_comms += 1
        if added_comms > 0:
            db.commit()
            logger.info(f"Seeded {added_comms} new communication prompts.")
            
        # Seed Academic Questions
        existing_aq_texts = {q.question_text for q in db.query(AcademicQuestion.question_text).all()}
        added_aqs = 0
        for q in INITIAL_ACADEMIC_QUESTIONS:
            if q["question_text"] not in existing_aq_texts:
                aq = AcademicQuestion(**q)
                db.add(aq)
                existing_aq_texts.add(q["question_text"])
                added_aqs += 1
        if added_aqs > 0:
            db.commit()
            logger.info(f"Seeded {added_aqs} new academic questions.")
            
        # Seed Coding Challenges if empty
        if db.query(CodingChallenge).count() == 0:
            for c in INITIAL_CODING_CHALLENGES:
                cc = CodingChallenge(**c)
                db.add(cc)
            db.commit()
            logger.info("Seeded initial coding challenges.")
            
    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding initial data: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
    print("Database initialization complete.")
