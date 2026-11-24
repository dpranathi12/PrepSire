import uuid
from typing import List, Dict, Any
from datetime import datetime

PHASES = [
    {"name": "Foundation", "days": range(1, 8)},
    {"name": "Skill Development", "days": range(8, 15)},
    {"name": "Interview Application", "days": range(15, 22)},
    {"name": "Final Revision", "days": range(22, 31)}
]

ROLE_TOPICS = {
    "Software Developer": [
        "Time & Space Complexity & Big-O",
        "Array & String Two-Pointer Patterns",
        "Object-Oriented Programming & SOLID Principles",
        "Hash Tables, Maps & Frequency Counters",
        "Recursion & Divide and Conquer",
        "Linked Lists & Fast/Slow Pointer Pattern",
        "Stacks & Queues in System Scenarios",
        "Trees: Traversals & Binary Search Trees",
        "Graph Fundamentals: BFS & DFS",
        "Dynamic Programming: 1D Subproblems",
        "Relational Database Indexing & ACID",
        "REST API Architecture & Status Codes",
        "Operating System Process Scheduling & Threads",
        "Computer Networks: TCP vs UDP & Handshake",
        "System Design: Caching with Redis & CDN",
        "Microservices vs Monolith Trade-offs"
    ]
}

def generate_30_day_tasks(
    target_role: str = "Software Developer",
    daily_budget_minutes: int = 60,
    baseline_score: float = 50.0,
    weak_subject: str = "Data Structures"
) -> List[Dict[str, Any]]:
    role_topic_list = ROLE_TOPICS.get(target_role, ROLE_TOPICS["Software Developer"])
    tasks = []

    for day in range(1, 31):
        week = (day - 1) // 7 + 1
        
        if day <= 7:
            phase = "Foundation"
            difficulty = "Easy"
        elif day <= 14:
            phase = "Skill Development"
            difficulty = "Medium"
        elif day <= 21:
            phase = "Interview Application"
            difficulty = "Medium"
        else:
            phase = "Final Revision"
            difficulty = "Hard"

        topic_idx = (day - 1) % len(role_topic_list)
        topic = role_topic_list[topic_idx]

        # 5 activity types per day
        day_tasks = [
            {
                "id": str(uuid.uuid4()),
                "day_number": day,
                "week_number": week,
                "phase": phase,
                "task_type": "learning_topic",
                "title": f"Study: {topic}",
                "instructions": f"Review fundamental concepts, common interview pitfalls, and trade-offs for {topic}.",
                "estimated_minutes": max(10, daily_budget_minutes // 4),
                "difficulty": difficulty,
                "status": "pending",
                "recommendation_reason": f"Essential core foundation for {target_role}.",
                "module_link": "technical"
            },
            {
                "id": str(uuid.uuid4()),
                "day_number": day,
                "week_number": week,
                "phase": phase,
                "task_type": "academic_assignment",
                "title": f"Academic Quiz on {weak_subject}",
                "instructions": f"Complete 5 diagnostic questions focusing on {weak_subject} and review explanations.",
                "estimated_minutes": max(10, daily_budget_minutes // 5),
                "difficulty": difficulty,
                "status": "pending",
                "recommendation_reason": f"Strengthens your lower diagnostic area in {weak_subject}.",
                "module_link": "technical"
            },
            {
                "id": str(uuid.uuid4()),
                "day_number": day,
                "week_number": week,
                "phase": phase,
                "task_type": "practice_activity",
                "title": f"Coding Challenge: {topic.split(':')[0]}",
                "instructions": "Solve a hands-on coding problem with sample test cases. Analyze time and space complexity.",
                "estimated_minutes": max(15, daily_budget_minutes // 3),
                "difficulty": difficulty,
                "status": "pending",
                "recommendation_reason": "Practical hands-on code writing reinforces theoretical concepts.",
                "module_link": "technical"
            },
            {
                "id": str(uuid.uuid4()),
                "day_number": day,
                "week_number": week,
                "phase": phase,
                "task_type": "interview_question",
                "title": f"Role Mock Question ({target_role})",
                "instructions": f"Deliver a clear spoken or typed answer to a real question from {target_role} interviews.",
                "estimated_minutes": 10,
                "difficulty": difficulty,
                "status": "pending",
                "recommendation_reason": "Builds spontaneous interview articulation under simulated conditions.",
                "module_link": "mock-interview"
            },
            {
                "id": str(uuid.uuid4()),
                "day_number": day,
                "week_number": week,
                "phase": phase,
                "task_type": "speaking_task",
                "title": "Impromptu JAM Speaking Challenge",
                "instructions": "Record a 60-second speech on a random topic with zero filler words.",
                "estimated_minutes": 10,
                "difficulty": "Easy" if day <= 10 else "Medium",
                "status": "pending",
                "recommendation_reason": "Builds vocal confidence, fluency, and eliminate filler words.",
                "module_link": "jam"
            }
        ]
        tasks.extend(day_tasks)

    return tasks
