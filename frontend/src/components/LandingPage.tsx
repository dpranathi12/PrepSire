import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Mic, 
  Code, 
  Bot, 
  TrendingUp, 
  CalendarCheck, 
  Brain, 
  CheckCircle2, 
  Star, 
  Play,
  Zap,
  ShieldCheck,
  Target
} from 'lucide-react';

interface LandingPageProps {
  onStartPracticing: () => void;
  onTakeAssessment: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPracticing,
  onTakeAssessment
}) => {
  const featureCards = [
    {
      icon: Mic,
      color: 'from-pink-500 to-rose-600',
      title: 'Communication Practice',
      description: 'Record or speak your answers. Analyze grammar, fluency, sentence structure, and filler word frequency with actionable tips.'
    },
    {
      icon: Code,
      color: 'from-indigo-500 to-blue-600',
      title: 'Technical Interviews',
      description: 'Practice role-specific coding problems, conceptual questions, and interactive quizzes across 13+ computer science categories.'
    },
    {
      icon: Bot,
      color: 'from-purple-500 to-indigo-600',
      title: 'AI Feedback',
      description: 'Receive real-time, constructive feedback on filler words, answer structure (STAR method), and improved model answers.'
    },
    {
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-600',
      title: 'Progress Tracking',
      description: 'Monitor your weekly score growth, streak records, XP rewards, and radar skill charts to track tangible improvement.'
    },
    {
      icon: CalendarCheck,
      color: 'from-amber-500 to-orange-600',
      title: 'Personalized Learning Plans',
      description: 'Get an automated 30-day preparation roadmap tailored to your target role, experience level, and assessment scores.'
    },
    {
      icon: Brain,
      color: 'from-cyan-500 to-blue-500',
      title: 'Confidence Building',
      description: 'Overcome interview anxiety with daily mirror-speaking challenges, self-intro builders, and impromptu speaking prompts.'
    }
  ];

  return (
    <div className="relative overflow-hidden bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Glow Orbs background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-30 blur-[120px]">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-pink-600 rounded-full mix-blend-screen"></div>
        <div className="absolute top-40 left-1/3 w-80 h-80 bg-purple-600 rounded-full mix-blend-screen"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* Top Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md shadow-lg">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
            <span>AI-Powered Interview Coach for Students & Freshers</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15]">
            Prepare Smarter. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              Speak Better.
            </span> <br />
            Get Interview Ready.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Practice interviews, improve communication, strengthen technical skills, and build confidence with AI-powered personalized feedback.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartPracticing}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Start Practicing Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onTakeAssessment}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-indigo-500/50 text-slate-200 hover:text-white font-semibold text-base backdrop-blur-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Target className="w-5 h-5 text-indigo-400" />
              <span>Take Skill Assessment</span>
            </button>
          </div>

          {/* Metrics summary */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <div>
              <div className="text-2xl font-bold text-white">94%</div>
              <div className="text-xs text-slate-400">Confidence Improvement</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-400">10k+</div>
              <div className="text-xs text-slate-400">Mock Interviews Simulated</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-400">13+</div>
              <div className="text-xs text-slate-400">Technical Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">30-Day</div>
              <div className="text-xs text-slate-400">Personalized Roadmap</div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Everything You Need to Crack Your Dream Job Interview
            </h2>
            <p className="mt-3 text-slate-400 text-sm">
              From beginner-level communication hurdles to advanced technical coding challenges, PrepSpire AI guides you step-by-step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="group relative p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 transition-all duration-300 shadow-xl hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{card.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive AI Preview Card */}
        <div className="mt-24 p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
                <Zap className="w-3.5 h-3.5" />
                <span>Live AI Performance Analytics</span>
              </div>

              <h3 className="text-3xl font-bold text-white tracking-tight leading-snug">
                Instant Feedback That Feels Like a Senior HR Manager Coaching You
              </h3>

              <p className="mt-4 text-slate-300 text-sm leading-relaxed">
                Stop guessing how you sounded. PrepSpire AI pinpoints exact filler words, checks STAR method execution, measures answer structure, and gives improved model responses in seconds.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Grammar & vocabulary score breakdown out of 100</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Filler words detection ("actually", "like", "um")</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Contextual follow-up questions tailored to your answers</span>
                </div>
              </div>
            </div>

            {/* Mock Report Graphic */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl text-left space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                  <span className="text-xs font-semibold text-white">AI Feedback Report</span>
                </div>
                <span className="text-xs text-slate-400">Score: 82%</span>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-slate-400">Grammar & Structure</div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 w-[85%] rounded-full"></div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
                <span className="font-semibold text-amber-400">AI Feedback:</span> "Your answer was clear, but you used 'actually' and 'like' frequently. Try using the STAR method for stronger impact."
              </div>

              <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
                <span className="font-semibold text-indigo-400">Model Answer:</span> "In my previous project, I designed a REST API in Python to process student submissions, reducing processing latency by 35%..."
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
