import React from 'react';
import { SkillScores, GamificationState } from '../types';
import { TrendingUp, Flame, Trophy, Video, HelpCircle, Award, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';

interface ProgressDashboardProps {
  scores: SkillScores;
  gamification: GamificationState;
  onNavigate?: (tab: string) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  scores,
  gamification,
  onNavigate
}) => {
  const weeklyProgress = [
    { week: 'Week 1', score: Math.max(25, scores.overall - 18) },
    { week: 'Week 2', score: Math.max(35, scores.overall - 10) },
    { week: 'Week 3', score: Math.max(45, scores.overall - 4) },
    { week: 'Week 4', score: scores.overall }
  ];

  const categoryScoresData = [
    { name: 'Comm', score: scores.communication, fill: '#6366f1' },
    { name: 'Tech', score: scores.technical, fill: '#ec4899' },
    { name: 'Conf', score: scores.confidence, fill: '#f59e0b' },
    { name: 'Gram', score: scores.grammar, fill: '#a855f7' },
    { name: 'Prob', score: scores.problemSolving, fill: '#10b981' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/10">
          <TrendingUp className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-extrabold text-white">Progress Analytics & Achievements</h2>
        <p className="text-slate-400 text-sm mt-1">
          Real-time trajectory tracked across your completed Mock Interview assessments and technical evaluations.
        </p>
      </div>

      {/* Top Key Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{gamification.streak} Days</div>
            <div className="text-xs text-slate-400">Active Practice Streak</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{gamification.xp} XP</div>
            <div className="text-xs text-slate-400">Level {gamification.level} Candidate</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{gamification.mockInterviewsCompleted}</div>
            <div className="text-xs text-slate-400">Mock Interviews Completed</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{gamification.questionsAnswered}</div>
            <div className="text-xs text-slate-400">Questions Answered</div>
          </div>
        </div>

      </div>

      {/* Main Grid: Recharts Progression Chart & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Progression Chart with Recharts */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">4-Week Interview Readiness Trajectory</h3>
              <p className="text-xs text-slate-400">Continuous score development over time</p>
            </div>
            <span className="text-xs text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Score: {scores.overall}%
            </span>
          </div>

          <div className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyProgress}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#scoreGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Score Breakdown with Recharts BarChart */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Criterion Score Distribution</h3>
            <span className="text-xs text-slate-400">Out of 100 pts</span>
          </div>

          <div className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryScoresData}>
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Gamification Badges Section */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Achievement Badges</span>
          </h3>
          <span className="text-xs text-slate-400">
            {gamification.badges.filter(b => b.unlocked).length} / {gamification.badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {gamification.badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                badge.unlocked
                  ? 'bg-slate-950 border-amber-500/40 shadow-lg shadow-amber-500/10 scale-[1.02]'
                  : 'bg-slate-950/40 border-slate-800 opacity-40 grayscale'
              }`}
            >
              <div className="text-4xl">{badge.icon}</div>
              <div className="text-xs font-bold text-white">{badge.title}</div>
              <div className="text-[10px] text-slate-400 leading-tight">{badge.description}</div>
              {badge.unlocked ? (
                <div className="text-[9px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Unlocked</span>
                </div>
              ) : (
                <div className="text-[9px] text-slate-500 uppercase tracking-wider">Locked</div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
