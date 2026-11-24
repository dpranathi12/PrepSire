import { DailyTask, UserProfile, SkillScores } from '../types';

export function get30DayCurriculum(profile: UserProfile, scores: SkillScores): DailyTask[] {
  const role = profile.targetRole || 'Software Developer';

  const dailyCurriculumData = [
    // WEEK 1: Communication & Self-Pitch Foundations
    {
      day: 1,
      topic: "Day 1: 60-Second Elevator Pitch & Academic Background",
      smallAssignment: "Write out a 60-second self-introduction introducing your degree, major projects, and passion for " + role + ".",
      practiceActivity: "Practice your introduction 3 times focusing on clear pronunciation and a warm opening smile.",
      interviewQuestion: "Tell me about yourself, your educational background, and why you chose your branch.",
      speakingTask: "Record a 1-minute audio introducing your academic background and project interests."
    },
    {
      day: 2,
      topic: "Day 2: STAR Framework Basics — Situation & Task",
      smallAssignment: "Identify 2 major academic or personal projects and write down the Situation and Task for each.",
      practiceActivity: "Practice describing the context of your final year project in under 30 seconds.",
      interviewQuestion: "Describe a project you worked on during college. What was the goal and what was your specific role?",
      speakingTask: "Speak for 60 seconds explaining the main problem your favorite project set out to solve."
    },
    {
      day: 3,
      topic: "Day 3: Vocal Hygiene — Eliminating Filler Words",
      smallAssignment: "List your top 3 vocal crutches (e.g. 'actually', 'like', 'um', 'basically') and write alternatives (silent pauses).",
      practiceActivity: "Answer 3 general HR questions out loud while maintaining silent 1-second pauses instead of saying 'um'.",
      interviewQuestion: "What motivates you to work hard every day?",
      speakingTask: "Record a 1-minute response to 'What motivates you?' with zero filler words."
    },
    {
      day: 4,
      topic: "Day 4: Non-Verbal Eye Contact & Posture",
      smallAssignment: "Read about eye contact techniques during remote/virtual video interviews.",
      practiceActivity: "Practice 60 seconds of mirror speaking while keeping eye contact directly on your webcam lens.",
      interviewQuestion: "Why are you interested in working for our company specifically?",
      speakingTask: "Deliver a 1-minute speech explaining your interest in " + role + " while looking straight at the camera."
    },
    {
      day: 5,
      topic: "Day 5: Handling High-Pressure Introductory Questions",
      smallAssignment: "Draft 3 compelling reasons why a recruiter should choose you over other graduates.",
      practiceActivity: "Answer 'Why should we hire you?' highlighting 2 unique technical skills.",
      interviewQuestion: "Why should we hire you for this " + role + " position over other candidates?",
      speakingTask: "Deliver a confident 60-second pitch on your top 2 competitive advantages."
    },
    {
      day: 6,
      topic: "Day 6: Tone, Volume & Vocal Pacing Control",
      smallAssignment: "Record yourself speaking at 3 different speeds (slow, normal, fast) and identify your optimal pacing.",
      practiceActivity: "Practice speaking at 130-150 words per minute for maximum clarity.",
      interviewQuestion: "What is your ideal work environment and company culture?",
      speakingTask: "Record a 1-minute response describing your ideal work environment with controlled pacing."
    },
    {
      day: 7,
      topic: "Day 7: Week 1 Communication Review & Self-Evaluation",
      smallAssignment: "Review your Communication score in the Progress tab and list 2 improvements made this week.",
      practiceActivity: "Complete 1 full Communication Test prompt in the practice module.",
      interviewQuestion: "What is the most important soft skill for a fresher entering " + role + " and why?",
      speakingTask: "Deliver a 1-minute summary of your communication progress over the past week."
    },

    // WEEK 2: Core HR Questions & Behavioral Mastery
    {
      day: 8,
      topic: "Day 8: Frame Strengths & Genuine Weaknesses",
      smallAssignment: "Write down 2 key strengths with evidence, and 1 real weakness paired with your active solution.",
      practiceActivity: "Practice framing your weakness as a positive growth trajectory (e.g. improving public speaking via daily practice).",
      interviewQuestion: "What are your greatest strengths and one major weakness you are actively working to overcome?",
      speakingTask: "Record a 1-minute answer explaining your strength and your active strategy to overcome your weakness."
    },
    {
      day: 9,
      topic: "Day 9: Overcoming Failure & Conflict Resolution",
      smallAssignment: "Structure a story using STAR framework about a time a project failed or a conflict occurred.",
      practiceActivity: "Practice taking accountability for a mistake without blaming team members.",
      interviewQuestion: "Tell me about a time you faced a disagreement with a team member or suffered a project setback.",
      speakingTask: "Speak for 60 seconds explaining how you resolved a team conflict or learned from a mistake."
    },
    {
      day: 10,
      topic: "Day 10: 5-Year Career Vision & Goal Alignment",
      smallAssignment: "Outline short-term (1-2 yrs) and long-term (3-5 yrs) career goals for " + role + ".",
      practiceActivity: "Align your personal goals with company growth and skill mastery.",
      interviewQuestion: "Where do you see yourself professionally in 5 years?",
      speakingTask: "Record a 1-minute speech articulating your 5-year career blueprint."
    },
    {
      day: 11,
      topic: "Day 11: Stress Management & Tight Deadlines",
      smallAssignment: "List 3 prioritization techniques you use when overloaded with coursework or project tasks.",
      practiceActivity: "Describe a high-pressure exam or project deadline scenario.",
      interviewQuestion: "How do you manage stress and tight project deadlines when multiple tasks compete for attention?",
      speakingTask: "Deliver a 1-minute explanation of your task prioritization framework under pressure."
    },
    {
      day: 12,
      topic: "Day 12: Leadership & Proactive Initiative",
      smallAssignment: "Write down an instance where you stepped up or took ownership of a task without being asked.",
      practiceActivity: "Practice highlighting initiative and ownership in student group work.",
      interviewQuestion: "Give an example of a situation where you demonstrated leadership or took initiative in a project.",
      speakingTask: "Record a 60-second story highlighting a moment you took ownership of a critical task."
    },
    {
      day: 13,
      topic: "Day 13: Salary Expectations & Professional Negotiation",
      smallAssignment: "Research industry standard compensation ranges for entry-level " + role + " roles.",
      practiceActivity: "Practice answering salary questions professionally without alienating employers.",
      interviewQuestion: "What are your salary expectations for this entry-level position?",
      speakingTask: "Deliver a polite 45-second response regarding your salary expectations."
    },
    {
      day: 14,
      topic: "Day 14: Full HR Mock Interview Round",
      smallAssignment: "Complete a 4-question HR Mock Interview in the simulator.",
      practiceActivity: "Review the generated report card and note down feedback scores.",
      interviewQuestion: "HR Comprehensive: Walk me through your profile, key project, strengths, and career goals.",
      speakingTask: "Deliver a 1-minute recap of your full HR Mock Interview performance."
    },

    // WEEK 3: Role-Specific Technical Deep-Dive
    {
      day: 15,
      topic: "Day 15: Core Programming Fundamentals & Memory Models",
      smallAssignment: "Review stack vs heap memory allocation, value types vs reference types in your primary language.",
      practiceActivity: "Solve 3 Easy MCQs in the Technical Practice module.",
      interviewQuestion: "What is the difference between stack and heap memory allocation in programming?",
      speakingTask: "Explain the concept of memory management to a non-technical peer in 60 seconds."
    },
    {
      day: 16,
      topic: "Day 16: Data Structures — Arrays, Strings & HashMaps",
      smallAssignment: "Solve 2 array string manipulation problems (e.g. Two Sum, Valid Anagram).",
      practiceActivity: "Write code for Two Sum using HashMaps in the code sandbox.",
      interviewQuestion: "How does a HashMap work internally and what is its average lookup time complexity?",
      speakingTask: "Explain HashMaps and collision resolution strategies out loud in 60 seconds."
    },
    {
      day: 17,
      topic: "Day 17: Stacks, Queues & Linked Lists",
      smallAssignment: "Implement Linked List reversal or Stack push/pop operations.",
      practiceActivity: "Practice explaining LIFO vs FIFO concepts in simple language.",
      interviewQuestion: "What is the difference between a Stack and a Queue? Give real-world software applications for both.",
      speakingTask: "Record a 1-minute explanation of Stack vs Queue data structures."
    },
    {
      day: 18,
      topic: "Day 18: Searching & Sorting Algorithms",
      smallAssignment: "Compare Binary Search (O(log n)) with Linear Search (O(n)).",
      practiceActivity: "Implement Binary Search in the Technical Practice sandbox.",
      interviewQuestion: "Explain QuickSort algorithm partitioning and compare its best vs worst case time complexity.",
      speakingTask: "Explain QuickSort algorithm step-by-step out loud in 60 seconds."
    },
    {
      day: 19,
      topic: "Day 19: Database Management, SQL Joins & Indexing",
      smallAssignment: "Write SQL queries demonstrating INNER JOIN, LEFT JOIN, and HAVING clauses.",
      practiceActivity: "Solve 3 SQL MCQs in the Technical Practice section.",
      interviewQuestion: "Explain SQL Joins (INNER, LEFT, RIGHT, FULL) and how B-Tree indexing speeds up queries.",
      speakingTask: "Explain SQL Indexes and how they reduce query execution time in 60 seconds."
    },
    {
      day: 20,
      topic: "Day 20: Object-Oriented Programming (OOP) & SOLID Principles",
      smallAssignment: "Write down real-world examples of Encapsulation, Abstraction, Inheritance, and Polymorphism.",
      practiceActivity: "Explain SOLID principles with code snippets.",
      interviewQuestion: "What are the 4 main pillars of OOP and how do they differ from functional programming?",
      speakingTask: "Deliver a 1-minute breakdown of Polymorphism and Abstraction."
    },
    {
      day: 21,
      topic: "Day 21: Web Architecture, REST APIs & HTTP Protocol",
      smallAssignment: "Compare REST vs GraphQL, HTTP methods (GET, POST, PUT, DELETE), and status codes (200, 404, 500).",
      practiceActivity: "Answer 3 Web Development MCQs in the Technical section.",
      interviewQuestion: "Walk me through what happens under the hood when a user types a URL into a web browser.",
      speakingTask: "Explain the client-server HTTP request-response lifecycle in 60 seconds."
    },

    // WEEK 4: Advanced Mock Interviews & Final Readiness
    {
      day: 22,
      topic: "Day 22: System Design Fundamentals & Scalability",
      smallAssignment: "Learn about Load Balancers, Caching (Redis), and Database Sharding.",
      practiceActivity: "Draw a simple block diagram of a scalable web app architecture.",
      interviewQuestion: "How would you design a simple URL shortening service (like Bitly)?",
      speakingTask: "Explain the role of Load Balancers and Caching in 60 seconds."
    },
    {
      day: 23,
      topic: "Day 23: Complex Problem Solving & Live Code Walkthrough",
      smallAssignment: "Practice solving a Medium difficulty coding problem while talking through your logic aloud.",
      practiceActivity: "Run code and test cases in the Technical Practice module.",
      interviewQuestion: "How do you approach a coding problem when you don't immediately know the optimal solution?",
      speakingTask: "Speak for 60 seconds describing your step-by-step problem-solving process when stuck."
    },
    {
      day: 24,
      topic: "Day 24: JAM (Just A Minute) Impromptu Speaking Sprint",
      smallAssignment: "Complete 3 random JAM topics in the JAM Practice module.",
      practiceActivity: "Focus on maintaining confidence and smooth transitions under time pressure.",
      interviewQuestion: "JAM Challenge: Speak for 60 seconds on 'Artificial Intelligence and the Future of Work'.",
      speakingTask: "Complete a 1-minute JAM speaking challenge on a trending tech topic."
    },
    {
      day: 25,
      topic: "Day 25: Full Technical Mock Interview Round",
      smallAssignment: "Complete a Technical Mock Interview in the simulator.",
      practiceActivity: "Analyze question-by-question ratings in the interview report.",
      interviewQuestion: "Technical Comprehensive: Explain your technical stack, favorite project, and solve a coding question.",
      speakingTask: "Record a 1-minute self-debrief on your technical interview performance."
    },
    {
      day: 26,
      topic: "Day 26: Behavioral STAR Refinement & Model Answer Practice",
      smallAssignment: "Review past interview report weak areas and rewrite improved STAR model answers.",
      practiceActivity: "Practice reciting model answers to ensure natural delivery.",
      interviewQuestion: "Tell me about a time you had to learn a completely new technology under short notice.",
      speakingTask: "Deliver a polished 60-second STAR answer about learning a new skill fast."
    },
    {
      day: 27,
      topic: "Day 27: Review Weak Skill Scorecards & Re-Test",
      smallAssignment: "Check your lowest score category in Progress Dashboard and complete targeted practice.",
      practiceActivity: "Solve 5 practice questions in your weakest subject area.",
      interviewQuestion: "What is your biggest area for professional growth and how have you worked to improve it?",
      speakingTask: "Deliver a 1-minute speech on how you turned a personal weakness into a strength."
    },
    {
      day: 28,
      topic: "Day 28: Final Full 5-Question AI Mock Simulation",
      smallAssignment: "Take a full Mixed Mock Interview under Hard difficulty setting.",
      practiceActivity: "Aim for an overall score > 80% to unlock the 'Interview Ready' badge.",
      interviewQuestion: "Final Mock: Complete full behavioral, technical, and follow-up round.",
      speakingTask: "Deliver a 1-minute final summary of your mock interview performance."
    },
    {
      day: 29,
      topic: "Day 29: Resume Pitch Alignment & Confidence Re-cap",
      smallAssignment: "Align your self-introduction pitch with the specific job description of your target role.",
      practiceActivity: "Complete 1 mirror-speaking session in Confidence Builder.",
      interviewQuestion: "What makes you uniquely qualified for this role compared to anyone else we are interviewing?",
      speakingTask: "Deliver your final, polished 60-second closing pitch for your target role."
    },
    {
      day: 30,
      topic: "Day 30: Final Skill Assessment & Certification",
      smallAssignment: "Retake the AI Skill Assessment and review your updated readiness score.",
      practiceActivity: "Verify that your overall readiness score has improved to target levels.",
      interviewQuestion: "Congratulations! What are your key takeaways from completing your 30-Day Interview Preparation Roadmap?",
      speakingTask: "Deliver a 1-minute celebration speech on completing your 30-Day Preparation Plan!"
    }
  ];

  return dailyCurriculumData.map(item => ({
    id: `day-${item.day}`,
    dayNumber: item.day,
    weekNumber: Math.ceil(item.day / 7),
    learningTopic: item.topic,
    smallAssignment: item.smallAssignment,
    practiceActivity: item.practiceActivity,
    interviewQuestion: item.interviewQuestion,
    speakingTask: item.speakingTask,
    completed: item.day <= 3 // Mark first 3 days completed by default for initial progress feedback
  }));
}
