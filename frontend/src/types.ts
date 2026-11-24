export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type TargetRole = 
  | 'Software Developer'
  | 'Java Developer'
  | 'Python Developer'
  | 'Backend Developer'
  | 'AI/ML Engineer'
  | 'Frontend Developer'
  | 'Full Stack Developer'
  | 'Data Analyst'
  | 'DevOps Engineer'
  | 'Product Manager'
  | 'HR Specialist'
  | 'Marketing Executive';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  token?: string;
  is_active: boolean;
  is_admin: boolean;
}

export interface UserProfile {
  name: string;
  education: string;
  branch: string;
  experienceLevel: ExperienceLevel;
  targetRole: TargetRole;
  knownSkills: string[];
  targetSkills: string[];
  isOnboarded: boolean;
  daily_prep_time_minutes?: number;
  target_company?: string;
}

export interface SkillScores {
  communication: number;
  technical: number;
  confidence: number;
  grammar: number;
  problemSolving: number;
  overall: number;
}

export interface QuestionEvaluation {
  score: number;
  feedback?: string;
  fillerWordsFound: string[];
  fillerWordCount: number;
  starMethodUsed: boolean;
  whatWentWell: string[];
  needsImprovement: string[];
  improvedAnswer: string;
  followUpQuestion?: string;
  evaluationMode?: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'HR' | 'Technical' | 'Behavioral';
  userAnswer?: string;
  evaluation?: QuestionEvaluation;
  isFollowUp?: boolean;
}

export interface MockInterviewSession {
  id: string;
  date: string;
  type: 'HR' | 'Technical' | 'Behavioral' | 'Mixed';
  role: TargetRole;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: InterviewQuestion[];
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  strongAreas: string[];
  weakAreas: string[];
  recommendedTopics: string[];
  actionPlan: string[];
  ai_provider?: string;
}

export interface CommunicationPrompt {
  id: string;
  category: string;
  difficulty: string;
  prompt_text: string;
  prep_time_seconds: number;
  speaking_time_seconds: number;
  tags: string[];
}

export interface CommunicationSession {
  id: string;
  date: string;
  category: string;
  prompt_text: string;
  response_text: string;
  overall_score: number;
  relevance_score: number;
  clarity_score: number;
  structure_score: number;
  grammar_score: number;
  vocabulary_score: number;
  conciseness_score: number;
  filler_words: string[];
  filler_count: number;
  words_per_minute: number;
  strengths: string[];
  weaknesses: string[];
  alternative_expressions: string[];
  improved_sample_answer?: string;
  next_step_recommendation?: string;
  evaluation_mode?: string;
}

export interface JamSession {
  id: string;
  date: string;
  topic: string;
  transcript: string;
  totalScore: number;
  fluencyScore: number;
  contentScore: number;
  vocabScore: number;
  grammarScore: number;
  confidenceScore: number;
  timeManagementScore: number;
  tips: string[];
  fillerWordsCount: number;
  sample_outline?: string[];
  example_opening?: string;
  example_closing?: string;
  evaluation_mode?: string;
}

export interface TechnicalQuestion {
  id: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'mcq' | 'short' | 'coding';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  explanation: string;
  starterCode?: string;
  testCases?: { input: string; expected: string }[];
}

export interface DailyTask {
  id: string;
  dayNumber: number;
  weekNumber: number;
  phase?: string;
  task_type?: string;
  learningTopic: string;
  smallAssignment: string;
  practiceActivity: string;
  interviewQuestion: string;
  speakingTask: string;
  completed: boolean;
  instructions?: string;
  estimated_minutes?: number;
  difficulty?: string;
  recommendation_reason?: string;
  module_link?: string;
}

export interface DailyAssignment {
  id: string;
  title: string;
  category: 'speaking' | 'coding' | 'text' | 'aptitude' | 'reasoning' | 'technical' | 'communication' | 'hr' | 'problem_solving';
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  prompt: string;
  xpReward: number;
  completed: boolean;
  userResponse?: string;
  feedback?: string;
  score?: number;
  hints?: string[];
  date?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category?: string;
}

export interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  badges: Badge[];
  questionsAnswered: number;
  mockInterviewsCompleted: number;
  jamCompleted: number;
  communicationCompleted?: number;
  codingCompleted?: number;
  quizzesCompleted?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  mode?: string;
}

export interface ReportSummaryItem {
  session_id: string;
  session_type: string;
  title: string;
  date: string;
  score: number;
  details: Record<string, any>;
}

export interface CriterionDiff {
  criterion: string;
  session_1_score: number;
  session_2_score: number;
  difference: number;
}

export interface SessionComparisonResult {
  session_type: string;
  session_1_id: string;
  session_2_id: string;
  session_1_date: string;
  session_2_date: string;
  score_1: number;
  score_2: number;
  point_difference: number;
  is_approximate_comparison: boolean;
  criterion_differences: CriterionDiff[];
  skills_improved: string[];
  persistent_weaknesses: string[];
  recommended_next_activities: string[];
}

export interface AISettings {
  active_ai_mode: string;
  gemini_configured: boolean;
  gemini_model: string;
  ollama_configured: boolean;
  ollama_base_url: string;
  ollama_model: string;
  supported_modes: string[];
}
