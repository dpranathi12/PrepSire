import React, { useState } from 'react';
import { DailyTask, UserProfile } from '../types';
import { CalendarCheck, CheckCircle2, Circle, Sparkles, BookOpen, Mic, HelpCircle, Code, ArrowRight } from 'lucide-react';

interface LearningPlanProps {
  profile: UserProfile;
  plan: DailyTask[];
  onToggleCompleted: (id: string) => void;
}

export const LearningPlan: React.FC<LearningPlanProps> = ({
  profile,
  plan,
  onToggleCompleted
}) => {
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const completedCount = plan.filter(t => t.completed).length;
  const progressPct = Math.round((completedCount / plan.length) * 100);

  const weekTasks = plan.filter(t => t.weekNumber === activeWeek);

  const weekTitles = [
    { week: 1, title: 'Week 1: Communication & Self Pitch Foundations' },
    { week: 2, title: 'Week 2: HR Questions & Behavioral STAR Method' },
    { week: 3, title: `Week 3: Technical Mastery for ${profile.targetRole}` },
    { week: 4, title: 'Week 4: Full Mock Interviews & Final Readiness' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
          <CalendarCheck className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-extrabold text-white">30-Day Personalized Interview Roadmap</h2>
        <p className="text-slate-400 text-sm mt-1">
          Custom tailored for <span className="text-indigo-400 font-semibold">{profile.targetRole}</span>. Complete daily 15-minute tasks to transform your interview confidence.
        </p>
      </div>

      {/* Progress Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-xs font-bold uppercase text-indigo-400">Roadmap Progression</div>
          <div className="text-2xl font-extrabold text-white">
            {completedCount} of 30 Days Completed ({progressPct}%)
          </div>
        </div>

        <div className="w-full md:w-72 space-y-2">
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Week Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {weekTitles.map((w) => (
          <button
            key={w.week}
            onClick={() => setActiveWeek(w.week)}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              activeWeek === w.week
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-[11px] font-bold uppercase text-indigo-400">Week {w.week}</div>
            <div className="text-xs font-bold mt-1 line-clamp-1">{w.title.split(': ')[1]}</div>
          </button>
        ))}
      </div>

      {/* Days List */}
      <div className="space-y-4">
        {weekTasks.map((task) => (
          <div
            key={task.id}
            className={`p-6 rounded-3xl border transition-all ${
              task.completed
                ? 'bg-slate-900/40 border-emerald-500/30'
                : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-xl'
            }`}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleCompleted(task.id)}
                  className="text-emerald-400 hover:scale-110 transition-transform cursor-pointer"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 fill-emerald-500/20 text-emerald-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-600 hover:text-indigo-400" />
                  )}
                </button>

                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase">Day {task.dayNumber}</span>
                  <h3 className={`text-base font-bold text-white ${task.completed ? 'line-through text-slate-400' : ''}`}>
                    {task.learningTopic}
                  </h3>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                task.completed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}>
                {task.completed ? 'Done +30 XP' : 'Pending'}
              </span>
            </div>

            {/* Daily Task Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-indigo-400">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Small Assignment</span>
                </div>
                <div className="text-slate-300 leading-relaxed">{task.smallAssignment}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-pink-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Practice Activity</span>
                </div>
                <div className="text-slate-300 leading-relaxed">{task.practiceActivity}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-purple-400">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Interview Question</span>
                </div>
                <div className="text-slate-300 leading-relaxed">"{task.interviewQuestion}"</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Speaking Task</span>
                </div>
                <div className="text-slate-300 leading-relaxed">{task.speakingTask}</div>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
