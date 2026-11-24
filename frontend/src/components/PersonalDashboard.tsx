import React from 'react';
import { UserProfile, SkillScores, GamificationState, DailyTask, DailyAssignment } from '../types';
import { 
  Flame, 
  Trophy, 
  Video, 
  Mic, 
  Timer, 
  Code, 
  CalendarCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  Bot, 
  Award,
  Zap,
  TrendingUp,
  Target
} from 'lucide-react';

interface PersonalDashboardProps {
  profile: UserProfile;
  scores: SkillScores;
  gamification: GamificationState;
  learningPlan: DailyTask[];
  dailyAssignments: DailyAssignment[];
  onNavigate: (tab: string) => void;
}

export const PersonalDashboard: React.FC<PersonalDashboardProps> = ({
  profile,
  scores,
  gamification,
  learningPlan,
  dailyAssignments,
  onNavigate
}) => {
  const completedPlanCount = learningPlan.filter(t => t.completed).length;
  const planProgressPct = Math.round((completedPlanCount / learningPlan.length) * 100);
  const pendingAssignment = dailyAssignments.find(a => !a.completed) || dailyAssignments[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner: Welcome + Profile summary */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-purple-950/80 border border-slate-800 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Target Role: {profile.targetRole}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {profile.name}! 👋
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              You're currently at Level {gamification.level} with a <span className="text-amber-400 font-semibold">{gamification.streak}-day practice streak</span>. Let's sharpen your interview readiness today!
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Action Button */}
            <button
              onClick={() => onNavigate('mock-interview')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Video className="w-4 h-4" />
              <span>Start Mock Interview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Readiness Score & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Readiness Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Interview Readiness</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
              Active Assessment
            </span>
          </div>

          <div className="my-6 flex items-center justify-center">
            <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1.5 shadow-xl flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white">{scores.overall}</span>
                <span className="text-[10px] uppercase font-bold text-indigo-400">Score / 100</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400">Communication</div>
              <div className="font-bold text-indigo-400 mt-0.5">{scores.communication}%</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400">Technical</div>
              <div className="font-bold text-pink-400 mt-0.5">{scores.technical}%</div>
            </div>
          </div>
        </div>

        {/* 30-Day Plan Tracker */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">30-Day Learning Plan</h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">{completedPlanCount}/30 Days</span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-pink-500" style={{ width: `${planProgressPct}%` }}></div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="text-xs font-semibold text-slate-300">Today's Focus Task:</div>
              <div className="text-xs text-slate-400 truncate">{learningPlan[completedPlanCount]?.learningTopic || 'Final Mock Interview Revision'}</div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('learning-plan')}
            className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>View Full 30-Day Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Daily Challenge Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Daily Challenge</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[10px] font-semibold">
                +{pendingAssignment.xpReward} XP
              </span>
            </div>

            <h4 className="text-lg font-bold text-white mb-2">{pendingAssignment.title}</h4>
            <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
              {pendingAssignment.prompt}
            </p>
          </div>

          <button
            onClick={() => onNavigate('daily-assignments')}
            className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>{pendingAssignment.completed ? 'Review Challenge' : 'Complete Challenge'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* CareerFit AI Promotion Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-pink-900/60 border border-indigo-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 uppercase">New Module</span>
              <h3 className="text-lg font-bold text-white">CareerFit AI – Resume & Job Matcher</h3>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Upload your resume and test how well it matches any job description. Uncover missing technical skills, calculate ATS readiness, and generate a personalized 7-day or 30-day learning roadmap.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('careerfit')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shrink-0 flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
        >
          <span>Match My Resume</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Feature Practice Launchers */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Practice Modules</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <button
            onClick={() => onNavigate('mock-interview')}
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-800/80 text-left transition-all group cursor-pointer shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">AI Mock Interview</h3>
            <p className="text-xs text-slate-400 mt-1">Simulate real HR & Technical rounds with AI follow-up questions.</p>
          </button>

          <button
            onClick={() => onNavigate('jam')}
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-pink-500/60 hover:bg-slate-800/80 text-left transition-all group cursor-pointer shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Timer className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors">JAM (Just A Minute)</h3>
            <p className="text-xs text-slate-400 mt-1">Random topic speaking timer with fluency & confidence scoring.</p>
          </button>

          <button
            onClick={() => onNavigate('technical')}
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/60 hover:bg-slate-800/80 text-left transition-all group cursor-pointer shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">Technical Practice</h3>
            <p className="text-xs text-slate-400 mt-1">Coding sandbox, MCQs, and computer science concepts across 13 topics.</p>
          </button>

          <button
            onClick={() => onNavigate('confidence')}
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/60 hover:bg-slate-800/80 text-left transition-all group cursor-pointer shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">Confidence Builder</h3>
            <p className="text-xs text-slate-400 mt-1">Mirror-speaking timer, self-intro guidance, and anxiety busters.</p>
          </button>

        </div>
      </div>

    </div>
  );
};
