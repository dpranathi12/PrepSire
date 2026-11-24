import React, { useState } from 'react';
import { SkillScores } from '../types';
import { Target, CheckCircle2, Mic, Play, ArrowRight, Award, Sparkles, RefreshCw, BarChart2 } from 'lucide-react';

interface SkillAssessmentProps {
  currentScores: SkillScores;
  onCompleteAssessment: (answers: Record<string, any>) => void;
  onGoToDashboard: () => void;
}

export const SkillAssessment: React.FC<SkillAssessmentProps> = ({
  currentScores,
  onCompleteAssessment,
  onGoToDashboard
}) => {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [answers, setAnswers] = useState<Record<string, number>>({
    commScore: 65,
    techScore: 55,
    confScore: 60,
    gramScore: 70,
    probScore: 62
  });

  const questions = [
    {
      id: 'q1',
      category: 'Communication & Fluency',
      question: 'How comfortable are you speaking in English during formal interviews without long pauses or filler words?',
      options: [
        { label: 'Very hesitant, frequently search for words', score: 45 },
        { label: 'Moderate, occasionally pause for vocabulary', score: 65 },
        { label: 'Fluent & clear with good pacing', score: 85 }
      ],
      key: 'commScore'
    },
    {
      id: 'q2',
      category: 'Technical Fundamentals',
      question: 'How would you rate your grasp of core algorithms, data structures, and programming concepts?',
      options: [
        { label: 'Basic knowledge, need practice on problem solving', score: 45 },
        { label: 'Good understanding of core concepts', score: 70 },
        { label: 'Strong, can code and explain complex logic easily', score: 90 }
      ],
      key: 'techScore'
    },
    {
      id: 'q3',
      category: 'Confidence & Pressure Handling',
      question: 'When asked an unexpected or tough follow-up question by an interviewer, how do you typically respond?',
      options: [
        { label: 'Get nervous and answer vaguely', score: 48 },
        { label: 'Take a pause, structure thoughts, and answer', score: 75 },
        { label: 'Thrive under pressure, ask clarifying questions', score: 92 }
      ],
      key: 'confScore'
    },
    {
      id: 'q4',
      category: 'Grammar & Vocabulary',
      question: 'Do you structure your responses using professional terminology and precise grammar?',
      options: [
        { label: 'Often use simple/casual words', score: 55 },
        { label: 'Generally good, occasional grammatical slips', score: 75 },
        { label: 'High vocabulary richness and correct sentence syntax', score: 90 }
      ],
      key: 'gramScore'
    },
    {
      id: 'q5',
      category: 'Problem-Solving Approach',
      question: 'When presented with a coding/business logic problem, how do you explain your solution?',
      options: [
        { label: 'Jump straight into coding without explaining thought process', score: 50 },
        { label: 'Explain high-level logic before diving into details', score: 78 },
        { label: 'Systematically discuss brute-force vs optimized approaches first', score: 95 }
      ],
      key: 'probScore'
    }
  ];

  const [currentQIndex, setCurrentQIndex] = useState(0);

  const handleSelectOption = (key: string, score: number) => {
    setAnswers(prev => ({ ...prev, [key]: score }));
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      onCompleteAssessment(answers);
      setStep('result');
    }
  };

  const currentQ = questions[currentQIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Intro Step */}
      {step === 'intro' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 text-center backdrop-blur-xl shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Target className="w-8 h-8 text-indigo-400" />
          </div>

          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            AI Skill Assessment
          </h2>

          <p className="mt-3 text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Take a 2-minute diagnostic check evaluating your Communication, Technical Knowledge, Grammar, Confidence, and Problem-Solving readiness out of 100.
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-2xl mx-auto text-left">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs text-slate-400">Communication</div>
              <div className="text-sm font-bold text-indigo-400 mt-1">Fluency & Vocabulary</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs text-slate-400">Technical</div>
              <div className="text-sm font-bold text-pink-400 mt-1">Core Logic</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs text-slate-400">Confidence</div>
              <div className="text-sm font-bold text-amber-400 mt-1">Vocal Control</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs text-slate-400">Grammar</div>
              <div className="text-sm font-bold text-purple-400 mt-1">Syntax & STAR</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 col-span-2 sm:col-span-1">
              <div className="text-xs text-slate-400">Problem Solving</div>
              <div className="text-sm font-bold text-emerald-400 mt-1">Approach</div>
            </div>
          </div>

          <button
            onClick={() => setStep('quiz')}
            className="mt-8 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 mx-auto cursor-pointer"
          >
            <span>Begin Assessment Quiz</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Quiz Step */}
      {step === 'quiz' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          
          {/* Progress bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Question {currentQIndex + 1} of {questions.length}</span>
            <span>{Math.round(((currentQIndex + 1) / questions.length) * 100)}% Completed</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-8">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-300"
              style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question */}
          <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-3">
            {currentQ.category}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
            {currentQ.question}
          </h3>

          <div className="space-y-3">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelectOption(currentQ.key, opt.score)}
                className="w-full p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-800/80 text-slate-200 hover:text-white text-left font-medium text-sm transition-all flex items-center justify-between group cursor-pointer"
              >
                <span>{opt.label}</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>

        </div>
      )}

      {/* Result Step */}
      {step === 'result' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-8">
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-3">
              <CheckCircle2 className="w-4 h-4" />
              <span>Assessment Completed!</span>
            </div>

            <h2 className="text-3xl font-extrabold text-white">
              Your AI Skill Scorecard
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Here is your baseline interview readiness breakdown based on your diagnostic evaluation.
            </p>
          </div>

          {/* Overall Score Circle */}
          <div className="flex justify-center">
            <div className="relative w-40 h-40 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 p-1.5 shadow-2xl shadow-indigo-600/30 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center">
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Overall Readiness</span>
                <span className="text-4xl font-extrabold text-white mt-1">{currentScores.overall}</span>
                <span className="text-xs text-indigo-400 font-semibold">/ 100</span>
              </div>
            </div>
          </div>

          {/* Individual Skill Progress Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Communication</span>
                <span className="text-indigo-400">{currentScores.communication}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${currentScores.communication}%` }}></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Technical Knowledge</span>
                <span className="text-pink-400">{currentScores.technical}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-pink-500 rounded-full" style={{ width: `${currentScores.technical}%` }}></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Confidence</span>
                <span className="text-amber-400">{currentScores.confidence}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${currentScores.confidence}%` }}></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Grammar & Syntax</span>
                <span className="text-purple-400">{currentScores.grammar}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${currentScores.grammar}%` }}></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 sm:col-span-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Problem Solving</span>
                <span className="text-emerald-400">{currentScores.problemSolving}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${currentScores.problemSolving}%` }}></div>
              </div>
            </div>

          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={onGoToDashboard}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Your Customized Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
