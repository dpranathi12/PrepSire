import { useState, useEffect, useCallback } from 'react';
import { 
  UserProfile, 
  SkillScores, 
  MockInterviewSession, 
  JamSession, 
  GamificationState, 
  DailyTask, 
  DailyAssignment, 
  ChatMessage, 
  Badge,
  AuthUser
} from '../types';
import { api } from '../services/api';
import { generatePersonalized30DayPlan, calculateDiagnosticAssessment, getCoachResponse } from '../utils/aiEngine';
import { getDailyChallengesForDate } from '../data/dailyChallengesBank';

const INITIAL_PROFILE: UserProfile = {
  name: 'Candidate',
  education: 'B.Tech Computer Science',
  branch: 'CSE',
  experienceLevel: 'Beginner',
  targetRole: 'Software Developer',
  knownSkills: ['Python', 'SQL', 'HTML/CSS'],
  targetSkills: ['Data Structures', 'React', 'System Design'],
  isOnboarded: false
};

const INITIAL_SCORES: SkillScores = {
  communication: 65,
  technical: 50,
  confidence: 60,
  grammar: 70,
  problemSolving: 55,
  overall: 60
};

const INITIAL_BADGES: Badge[] = [
  { id: 'b1', title: 'First Interview Completed', description: 'Complete your first AI mock interview', icon: '🏆', unlocked: false },
  { id: 'b2', title: 'Communication Starter', description: 'Complete a speech or communication drill', icon: '🎙️', unlocked: false },
  { id: 'b3', title: 'Five JAM Sessions', description: 'Conquer 5 Just-A-Minute speech challenges', icon: '⚡', unlocked: false },
  { id: 'b4', title: 'Ten Coding Problems', description: 'Submit solutions for 10 coding challenges', icon: '💻', unlocked: false },
  { id: 'b5', title: 'Seven-Day Practice Streak', description: 'Maintain a 7-day practice streak', icon: '🔥', unlocked: false }
];

const INITIAL_GAMIFICATION: GamificationState = {
  xp: 150,
  level: 1,
  streak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  badges: INITIAL_BADGES,
  questionsAnswered: 0,
  mockInterviewsCompleted: 0,
  jamCompleted: 0
};

const INITIAL_DAILY_ASSIGNMENTS: DailyAssignment[] = [
  {
    id: 'da-1',
    title: 'Self Introduction (60 Seconds)',
    category: 'speaking',
    prompt: 'Deliver a structured 60-second introduction highlighting your background, major skills, and target career goals.',
    xpReward: 50,
    completed: false
  },
  {
    id: 'da-2',
    title: 'Explain OOP to a Beginner',
    category: 'text',
    prompt: 'Explain the core concept of Object-Oriented Programming (OOP) in simple everyday language using an analogy.',
    xpReward: 50,
    completed: false
  },
  {
    id: 'da-3',
    title: 'Two Sum Problem',
    category: 'coding',
    prompt: 'Write an optimized O(n) function to find pair indices that sum to target.',
    xpReward: 75,
    completed: false
  }
];

export function useAppState() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [scores, setScores] = useState<SkillScores>(INITIAL_SCORES);
  const [gamification, setGamification] = useState<GamificationState>(INITIAL_GAMIFICATION);
  const [interviewHistory, setInterviewHistory] = useState<MockInterviewSession[]>([]);
  const [jamHistory, setJamHistory] = useState<JamSession[]>([]);
  const [learningPlan, setLearningPlan] = useState<DailyTask[]>([]);
  const [dailyAssignments, setDailyAssignments] = useState<DailyAssignment[]>(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    try {
      const saved = localStorage.getItem(`prepspire_daily_challenges_${todayStr}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return getDailyChallengesForDate(todayStr);
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'coach',
      text: 'Hello! I am your PrepSpire AI Career Coach. How would you like to prepare today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync data from backend
  const refreshBackendData = useCallback(async () => {
    try {
      const stats = await api.getDashboardStats();
      if (stats) {
        if (stats.scores) setScores(stats.scores);
        if (stats.gamification) setGamification(stats.gamification);
      }

      const planRes = await api.getLearningPlan();
      if (planRes && planRes.tasks) {
        const mappedTasks: DailyTask[] = planRes.tasks.map((t: any) => ({
          id: t.id,
          dayNumber: t.day_number,
          weekNumber: t.week_number,
          phase: t.phase,
          task_type: t.task_type,
          learningTopic: t.title,
          smallAssignment: t.instructions,
          practiceActivity: t.recommendation_reason || 'Core Practice',
          interviewQuestion: `Day ${t.day_number} Interview Prompt`,
          speakingTask: '60s Impromptu Speaking Drill',
          completed: t.status === 'completed',
          instructions: t.instructions,
          estimated_minutes: t.estimated_minutes,
          difficulty: t.difficulty,
          module_link: t.module_link
        }));
        setLearningPlan(mappedTasks);
      }

      const profileRes = await api.getProfile();
      if (profileRes) {
        setProfile({
          name: profileRes.display_name || 'Candidate',
          education: profileRes.education || 'B.Tech',
          branch: profileRes.degree_branch || 'CSE',
          experienceLevel: profileRes.experience_level || 'Beginner',
          targetRole: profileRes.target_role || 'Software Developer',
          knownSkills: profileRes.known_skills || [],
          targetSkills: profileRes.target_skills || [],
          isOnboarded: profileRes.is_onboarded || false,
          daily_prep_time_minutes: profileRes.daily_prep_time_minutes || 60,
          target_company: profileRes.target_company
        });
      }
    } catch (e) {
      console.warn('Backend sync failed, maintaining local state:', e);
    }
  }, []);

  // Initialize session on load
  useEffect(() => {
    const initSession = async () => {
      const token = api.getToken();
      if (token) {
        try {
          const user = await api.getMe();
          if (user) {
            setCurrentUser(user);
            await refreshBackendData();
          }
        } catch (e) {
          console.warn('Existing token expired or invalid:', e);
          api.logout();
        }
      }
    };
    initSession();
  }, [refreshBackendData]);

  // Auth actions
  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await api.login({ email, password: pass });
      const user = await api.getMe();
      setCurrentUser(user);
      await refreshBackendData();
      setActiveTab('dashboard');
      return true;
    } catch (err: any) {
      setAuthError(err.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await api.register({ email: email.trim(), full_name: name.trim(), password: pass });
      const user = await api.getMe();
      setCurrentUser(user);
      await refreshBackendData();
      setActiveTab('dashboard');
      return true;
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setCurrentUser(null);
    setActiveTab('landing');
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updated, isOnboarded: true }));
    try {
      if (currentUser) {
        await api.updateProfile(updated);
        await refreshBackendData();
      }
    } catch (e) {
      console.warn('Error saving profile to backend:', e);
    }
  };

  const addXp = (amount: number) => {
    setGamification(prev => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 200) + 1;
      return { ...prev, xp: newXp, level: newLevel };
    });
  };

  const completeDiagnosticAssessment = async (answers: Record<string, any>) => {
    try {
      if (currentUser) {
        const res = await api.submitDiagnosticAssessment(answers);
        if (res) {
          setScores(prev => ({
            ...prev,
            overall: res.baseline_score,
            communication: res.communication_score,
            technical: res.technical_score,
            problemSolving: res.problem_solving_score
          }));
          await refreshBackendData();
        }
      } else {
        const newScores = calculateDiagnosticAssessment(answers);
        setScores(newScores);
        setLearningPlan(generatePersonalized30DayPlan(profile, newScores));
      }
      addXp(100);
      setActiveTab('dashboard');
    } catch (e) {
      console.warn('Diagnostic assessment error:', e);
    }
  };

  const saveMockInterviewSession = async (session: MockInterviewSession) => {
    setInterviewHistory(prev => [session, ...prev]);
    addXp(150);
    try {
      if (currentUser) {
        await refreshBackendData();
      }
    } catch (e) {
      console.warn('Error syncing interview session:', e);
    }
  };

  const saveJamSession = async (session: JamSession) => {
    setJamHistory(prev => [session, ...prev]);
    addXp(80);
    try {
      if (currentUser) {
        await refreshBackendData();
      }
    } catch (e) {
      console.warn('Error syncing JAM session:', e);
    }
  };

  const toggleTaskCompleted = async (taskId: string) => {
    setLearningPlan(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        if (nextState) addXp(30);
        return { ...t, completed: nextState };
      }
      return t;
    }));

    try {
      if (currentUser) {
        await api.togglePlanTask(taskId);
        await refreshBackendData();
      }
    } catch (e) {
      console.warn('Error updating task in backend:', e);
    }
  };

  const sendCoachMessage = async (userText: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const history = [...chatMessages.slice(-6).map(m => ({ sender: m.sender, text: m.text })), { sender: 'user', text: userText }];
    setChatMessages(prev => [...prev, userMsg]);

    try {
      let coachReply = '';
      let mode = 'offline';
      if (currentUser) {
        const res = await api.sendCoachMessage(userText, history);
        coachReply = res.reply;
        mode = res.mode;
      } else {
        coachReply = getCoachResponse(userText, profile, scores, history);
      }

      const coachMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'coach',
        text: coachReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode
      };
      setChatMessages(prev => [...prev, coachMsg]);
    } catch (e) {
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'coach',
        text: getCoachResponse(userText, profile, scores, history),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: 'offline'
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    }
  };

  return {
    currentUser,
    login,
    register,
    logout,
    authError,
    isLoading,
    profile,
    updateProfile,
    scores,
    gamification,
    interviewHistory,
    jamHistory,
    learningPlan,
    dailyAssignments,
    chatMessages,
    activeTab,
    setActiveTab,
    addXp,
    completeDiagnosticAssessment,
    saveMockInterviewSession,
    saveJamSession,
    toggleTaskCompleted,
    sendCoachMessage,
    refreshBackendData
  };
}
