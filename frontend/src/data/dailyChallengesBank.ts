import { DailyAssignment } from '../types';

export interface ChallengeItem {
  id: string;
  title: string;
  category: 'aptitude' | 'reasoning' | 'technical' | 'coding' | 'communication' | 'hr' | 'problem_solving';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prompt: string;
  hints: string[];
  xpReward: number;
}

export const DAILY_CHALLENGES_BANK: ChallengeItem[] = [
  // --- APTITUDE ---
  {
    id: 'apt-1',
    title: 'Work and Time Efficiency',
    category: 'aptitude',
    difficulty: 'Easy',
    prompt: 'A can complete a project in 12 days, while B can complete the same project in 18 days. If they work together for 4 days, what fraction of the project remains unfinished? Explain your step-by-step arithmetic.',
    hints: ['Find the 1-day work rate for both A and B.', 'Add their 1-day rates: (1/12 + 1/18).', 'Multiply by 4 days, then subtract from 1.'],
    xpReward: 60
  },
  {
    id: 'apt-2',
    title: 'Speed, Time, and Distance',
    category: 'aptitude',
    difficulty: 'Medium',
    prompt: 'A train traveling at 72 km/h crosses a 250m long platform in 25 seconds. What is the length of the train in meters, and how long would it take to cross a standing signal pole?',
    hints: ['Convert 72 km/h into m/s by multiplying by 5/18 (20 m/s).', 'Total distance covered = Speed * Time = 20 * 25 = 500m.', 'Train length = 500m - 250m.'],
    xpReward: 70
  },
  {
    id: 'apt-3',
    title: 'Profit, Loss, and Discount',
    category: 'aptitude',
    difficulty: 'Medium',
    prompt: 'A merchant marks goods 40% above cost price and allows a discount of 15% on the marked price. If he makes a net profit of $380, calculate the original cost price.',
    hints: ['Let Cost Price = 100x.', 'Marked Price = 140x.', 'Selling Price after 15% discount = 140x * 0.85 = 119x.'],
    xpReward: 75
  },
  {
    id: 'apt-4',
    title: 'Permutations and Probability',
    category: 'aptitude',
    difficulty: 'Hard',
    prompt: 'A team of 5 engineers is to be selected from 6 backend developers and 4 frontend developers. What is the probability that the team has at least 3 backend developers?',
    hints: ['Total combinations = 10C5.', 'Calculate combinations with 3 backend + 2 frontend, 4 backend + 1 frontend, and 5 backend.', 'Sum the favorable outcomes and divide by total combinations.'],
    xpReward: 90
  },

  // --- LOGICAL REASONING ---
  {
    id: 'reas-1',
    title: 'Syllogisms and Deductive Logic',
    category: 'reasoning',
    difficulty: 'Easy',
    prompt: 'Statements: (1) All microservices communicate via APIs. (2) Some APIs use gRPC. (3) No monolithic application is a microservice. Conclusions: (I) Some services communicating via APIs use gRPC. (II) No monolithic application uses gRPC. Analyze which conclusions logically follow and explain why.',
    hints: ['Draw Venn diagrams for Microservices, APIs, and gRPC.', 'Check if Conclusion II is strictly necessary from the premises.'],
    xpReward: 60
  },
  {
    id: 'reas-2',
    title: 'Circular Seating Arrangement',
    category: 'reasoning',
    difficulty: 'Medium',
    prompt: 'Six engineers (A, B, C, D, E, F) sit around a circular table facing the center. A is second to the left of D. B is adjacent to D and opposite to C. E is not adjacent to C. Who is sitting immediately to the right of F? Show your step-by-step arrangement deduction.',
    hints: ['Place D at a fixed point, then place A second to the left of D.', 'Place B adjacent to D, and put C diametrically opposite to B.'],
    xpReward: 75
  },
  {
    id: 'reas-3',
    title: 'Critical Assumption and Flaw Analysis',
    category: 'reasoning',
    difficulty: 'Hard',
    prompt: 'Statement: "Adopting a microservices architecture will immediately eliminate all application downtime because services operate independently." Identify the two primary logical flaws and unstated false assumptions in this assertion.',
    hints: ['Consider network unreliability and cascading failures.', 'Think about distributed transactions, service discovery, and database bottlenecks.'],
    xpReward: 85
  },

  // --- TECHNICAL QUESTIONS ---
  {
    id: 'tech-1',
    title: 'Database Indexing Trade-offs',
    category: 'technical',
    difficulty: 'Easy',
    prompt: 'Explain the difference between a Clustered and a Non-Clustered index in relational databases (such as PostgreSQL or MySQL). Under what circumstances does adding an index degrade database performance?',
    hints: ['A clustered index determines the physical order of data in the table (only one per table).', 'Non-clustered indexes create separate lookup structures pointing to rows.', 'Indexes add overhead to INSERT, UPDATE, and DELETE operations.'],
    xpReward: 65
  },
  {
    id: 'tech-2',
    title: 'Concurrency: Deadlocks and Prevention',
    category: 'technical',
    difficulty: 'Medium',
    prompt: 'What are Coffman\'s four conditions necessary for a deadlock to occur in a concurrent application? Describe two distinct strategies you would use to prevent deadlocks in distributed transactions.',
    hints: ['Mutual exclusion, Hold and wait, No preemption, Circular wait.', 'Resource ordering (strict lock hierarchy), Timeouts with retries, Optimistic concurrency control (OCC).'],
    xpReward: 75
  },
  {
    id: 'tech-3',
    title: 'CAP Theorem and Distributed Systems',
    category: 'technical',
    difficulty: 'Hard',
    prompt: 'Explain the CAP Theorem and how network partitions force a trade-off between Consistency and Availability. How does PACELC expand upon the CAP Theorem during normal non-partitioned operation?',
    hints: ['Under network partition (P), a distributed system must choose between refusing requests (C) or returning stale data (A).', 'PACELC adds: If partition (P), tradeoff between A and C; Else (E), tradeoff between Latency (L) and Consistency (C).'],
    xpReward: 90
  },

  // --- CODING ---
  {
    id: 'code-1',
    title: 'Two Sum with Optimal Complexity',
    category: 'coding',
    difficulty: 'Easy',
    prompt: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Provide the optimal solution in Python, Java, or C++, and explain why its time complexity is O(n) using a hash map.',
    hints: ['Iterate through the array while maintaining a map of { complement: index }.', 'Check if nums[i] is already in the map.'],
    xpReward: 70
  },
  {
    id: 'code-2',
    title: 'Longest Substring Without Repeating Characters',
    category: 'coding',
    difficulty: 'Medium',
    prompt: 'Given a string s, find the length of the longest substring without repeating characters. Describe the Sliding Window technique with two pointers or a map storing the last seen indices, achieving O(n) time and O(min(m, n)) space.',
    hints: ['Use left and right pointers representing the window boundary.', 'When duplicate is found, move left pointer to index + 1.'],
    xpReward: 80
  },
  {
    id: 'code-3',
    title: 'LRU Cache Design and Implementation',
    category: 'coding',
    difficulty: 'Hard',
    prompt: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. How do you implement get(key) and put(key, value) in strict O(1) average time complexity using a Doubly Linked List and a Hash Map?',
    hints: ['Hash map provides O(1) lookup to node reference.', 'Doubly linked list allows O(1) removal and insertion at head/tail.'],
    xpReward: 95
  },

  // --- COMMUNICATION ---
  {
    id: 'comm-1',
    title: '60-Second Elevator Pitch',
    category: 'communication',
    difficulty: 'Easy',
    prompt: 'Deliver a concise 60-second elevator pitch introducing yourself to an engineering hiring manager. Clearly articulate: (1) who you are, (2) your primary technical domain and achievements, and (3) what high-impact value you bring to their team.',
    hints: ['Follow: Present (current role/studies) -> Past (tangible wins/projects) -> Future (why this role excites you).', 'Avoid filler words and keep sentence length crisp.'],
    xpReward: 65
  },
  {
    id: 'comm-2',
    title: 'Explaining Technical Debt to Non-Technical Leaders',
    category: 'communication',
    difficulty: 'Medium',
    prompt: 'Your engineering team needs two weeks to refactor legacy spaghetti code, but your Product Manager wants to ship three new client features instead. How do you explain the concept and business cost of technical debt in non-technical terms to gain their buy-in?',
    hints: ['Use real-world financial debt analogy: borrowing speed now incurs compound interest later in bug fixes.', 'Frame it around business risk: system instability, delayed future feature releases, and customer churn.'],
    xpReward: 75
  },
  {
    id: 'comm-3',
    title: 'Managing Cross-Functional Misalignment',
    category: 'communication',
    difficulty: 'Hard',
    prompt: 'During a release sprint, QA finds a critical bug 24 hours before a high-profile marketing launch. The Marketing Director insists on launching on schedule, while Engineering wants to postpone by 48 hours. How do you lead the alignment meeting?',
    hints: ['Acknowledge business goals first to avoid defensiveness.', 'Quantify blast radius and customer impact objectively.', 'Explore compromise options like feature-flagging or dark-launching.'],
    xpReward: 85
  },

  // --- HR QUESTIONS ---
  {
    id: 'hr-1',
    title: 'Tell Me About a Time You Failed',
    category: 'hr',
    difficulty: 'Medium',
    prompt: 'Answer the classic behavioral interview question: "Tell me about a time you made a significant mistake or failed to meet an objective." Use the STAR framework (Situation, Task, Action, Result) and emphasize your post-mortem learning.',
    hints: ['Choose a real technical or team mistake, not a disguised strength.', 'Spend 70% of your time on the Action (how you fixed it) and Result/Learning (safeguards put in place).'],
    xpReward: 70
  },
  {
    id: 'hr-2',
    title: 'Resolving Constructive Disagreements',
    category: 'hr',
    difficulty: 'Easy',
    prompt: 'Describe a situation where a senior teammate advocated for an approach you believed was fundamentally flawed. How did you raise your concerns professionally without damaging collaboration?',
    hints: ['Focus on data and proof-of-concept benchmarks rather than subjective opinions.', 'Show respect for their seniority while maintaining technical integrity.'],
    xpReward: 65
  },
  {
    id: 'hr-3',
    title: 'Why PrepSpire / Target Company?',
    category: 'hr',
    difficulty: 'Medium',
    prompt: 'How would you answer: "Why do you specifically want to join our organization over other companies with similar packages?" Structure an answer that highlights product mission alignment, engineering culture, and career trajectory.',
    hints: ['Reference a specific engineering blog post, open-source tool, or product feature of the company.', 'Connect how their current scaling challenge aligns with your personal learning goals.'],
    xpReward: 70
  },

  // --- PROBLEM SOLVING ---
  {
    id: 'prob-1',
    title: 'Production Latency Spike Root Cause',
    category: 'problem_solving',
    difficulty: 'Medium',
    prompt: 'At 2:00 PM, p99 latency on your checkout microservice jumps from 120ms to 4,800ms. Error rates remain under 0.5%. Outline your systematic, step-by-step diagnostic workflow to isolate whether the root cause is DB locking, garbage collection pauses, or downstream third-party payment gateway timeouts.',
    hints: ['Check APM metrics: CPU, memory, thread pool exhaustion, DB connection pool.', 'Inspect distributed traces (Jaeger/OpenTelemetry) to identify the slow span.', 'Correlate with recent deployments or traffic volume changes.'],
    xpReward: 80
  },
  {
    id: 'prob-2',
    title: 'Designing an API Rate Limiter',
    category: 'problem_solving',
    difficulty: 'Hard',
    prompt: 'You need to design a distributed rate limiter that limits each client IP to 100 requests per minute across a cluster of 20 API servers. Compare the Token Bucket, Leaky Bucket, and Sliding Window Log algorithms. How would you handle race conditions in Redis?',
    hints: ['Compare Token Bucket (bursts allowed) vs Leaky Bucket (smooth rate).', 'Redis Lua scripts ensure atomic read-and-update operations, preventing race conditions.'],
    xpReward: 90
  }
];

export const DAILY_CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'aptitude', label: 'Aptitude' },
  { id: 'reasoning', label: 'Logical Reasoning' },
  { id: 'technical', label: 'Technical' },
  { id: 'coding', label: 'Coding' },
  { id: 'communication', label: 'Communication' },
  { id: 'hr', label: 'HR & Behavioral' },
  { id: 'problem_solving', label: 'Problem Solving' }
];

export function getDailyChallengesForDate(dateStr: string): DailyAssignment[] {
  // Deterministic seed from dateStr (e.g. "2026-11-23")
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) & 0xffffffff;
  }
  hash = Math.abs(hash);

  const categories = ['aptitude', 'reasoning', 'technical', 'coding', 'communication', 'hr', 'problem_solving'];
  
  // Pick one challenge per category deterministically for today
  return categories.map((cat, idx) => {
    const pool = DAILY_CHALLENGES_BANK.filter(c => c.category === cat);
    const chosenIdx = (hash + idx) % pool.length;
    const challenge = pool[chosenIdx];

    return {
      id: `${challenge.id}-${dateStr}`,
      title: challenge.title,
      category: challenge.category as any,
      difficulty: challenge.difficulty,
      prompt: challenge.prompt,
      xpReward: challenge.xpReward,
      completed: false,
      hints: challenge.hints,
      date: dateStr
    };
  });
}

