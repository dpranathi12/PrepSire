import React, { useState, useEffect } from 'react';
import { TECHNICAL_QUESTIONS } from '../utils/aiEngine';
import { TechnicalQuestion } from '../types';
import { api } from '../services/api';
import { 
  Code, CheckCircle2, XCircle, Play, Sparkles, HelpCircle, 
  Check, Filter, ShieldAlert, BookOpen, Send, Lightbulb 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TechnicalPracticeProps {
  onAddXp: (amount: number) => void;
}

const REQUIRED_SUBJECTS = [
  'All Subjects',
  'Java',
  'Data Structures and Algorithms',
  'Object-Oriented Programming',
  'DBMS',
  'SQL',
  'Operating Systems',
  'Computer Networks',
  'Software Engineering',
  'Python',
  'C and C++',
  'Web Development',
  'Artificial Intelligence',
  'Machine Learning',
  'Aptitude and Logical Reasoning'
];

const DIFFICULTIES = ['All Difficulties', 'Easy', 'Medium', 'Hard'] as const;

export const TechnicalPractice: React.FC<TechnicalPracticeProps> = ({ onAddXp }) => {
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All Difficulties');
  const [selectedType, setSelectedType] = useState<'all' | 'mcq' | 'coding'>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'java' | 'cpp' | 'c'>('python');
  
  const [questions, setQuestions] = useState<TechnicalQuestion[]>(TECHNICAL_QUESTIONS);
  const [activeQuestion, setActiveQuestion] = useState<TechnicalQuestion>(TECHNICAL_QUESTIONS[0]);
  const [selectedMcqOption, setSelectedMcqOption] = useState<number | null>(null);
  const [isMcqSubmitted, setIsMcqSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const [codeContent, setCodeContent] = useState(activeQuestion.starterCode || '');
  const [codeOutput, setCodeOutput] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showSolutionConfirmed, setShowSolutionConfirmed] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);

  const getLanguageTemplate = (lang: string, q: any) => {
    if (q.starterCodeTemplates && q.starterCodeTemplates[lang]) {
      return q.starterCodeTemplates[lang];
    }
    if (lang === 'python') {
      return q.starterCode || '# Write your Python solution here\n';
    } else if (lang === 'java') {
      return 'class Solution {\n    // Write your Java solution here\n}\n';
    } else if (lang === 'cpp') {
      return '#include <vector>\n#include <string>\n\nclass Solution {\npublic:\n    // Write your C++ solution here\n};\n';
    } else if (lang === 'c') {
      return '#include <stdio.h>\n#include <stdlib.h>\n\n// Write your C solution here\n';
    }
    return '';
  };

  // Sync academic questions & coding challenges from backend
  useEffect(() => {
    const loadBackendQuestions = async () => {
      try {
        const [backendAcad, backendCoding] = await Promise.all([
          api.getAcademicQuestions(selectedSubject === 'All Subjects' ? undefined : selectedSubject, selectedDifficulty === 'All Difficulties' ? undefined : selectedDifficulty),
          api.getCodingChallenges()
        ]);

        const combined: TechnicalQuestion[] = [];
        if (backendAcad && backendAcad.length > 0) {
          backendAcad.forEach((aq: any) => {
            combined.push({
              id: aq.id,
              category: aq.subject,
              difficulty: aq.difficulty as any,
              type: (aq.question_type || 'mcq') as any,
              question: aq.question_text,
              options: aq.options,
              correctAnswer: aq.options ? aq.options.indexOf(aq.correct_answer) : aq.correct_answer,
              explanation: aq.explanation
            });
          });
        }

        if (backendCoding && backendCoding.length > 0) {
          backendCoding.forEach((c: any) => {
            const pythonStarter = c.starter_code?.python || 'def solution():\n    # Write your solution here\n    pass\n';
            combined.push({
              id: c.id,
              category: c.topic || 'Coding',
              difficulty: c.difficulty as any,
              type: 'coding',
              question: `${c.title}: ${c.problem_statement}`,
              starterCode: pythonStarter,
              starterCodeTemplates: c.starter_code || {},
              explanation: c.explanation || c.expected_approach,
              testCases: c.sample_test_cases?.map((st: any) => ({ input: st.input, expected: st.expected, explanation: st.explanation })),
              constraints: c.constraints,
              hints: c.hints
            } as any);
          });
        }

        // Merge backend questions with full local question bank so every subject has abundant questions
        const existingIds = new Set(combined.map(q => q.id));
        const merged = [...combined];
        TECHNICAL_QUESTIONS.forEach(localQ => {
          if (!existingIds.has(localQ.id)) {
            merged.push(localQ);
          }
        });

        if (merged.length > 0) {
          setQuestions(merged);
        }
      } catch (err) {
        console.warn('Backend questions load warning, using local question bank:', err);
      }
    };
    loadBackendQuestions();
  }, [selectedSubject, selectedDifficulty]);

  const matchesSubject = (qCat: string, subject: string): boolean => {
    if (subject === 'All Subjects') return true;
    const s1 = qCat.toLowerCase();
    const s2 = subject.toLowerCase();
    if (s1 === s2 || s1.includes(s2) || s2.includes(s1)) return true;

    if (s2.includes('oop') || s2.includes('object-oriented')) {
      return s1.includes('oop') || s1.includes('object-oriented');
    }
    if (s2.includes('data structures') || s2.includes('algorithm') || s2.includes('dsa')) {
      return s1.includes('data structure') || s1.includes('algorithm') || s1.includes('dsa');
    }
    if (s2.includes('c and c++') || s2.includes('c/c++') || s2.includes('c++')) {
      return s1.includes('c/c++') || s1.includes('c++') || s1.includes('c and c++') || s1 === 'c';
    }
    if (s2.includes('ai') || s2.includes('artificial') || s2.includes('machine learning') || s2.includes('ml')) {
      return s1.includes('ai') || s1.includes('artificial') || s1.includes('machine learning') || s1.includes('ml');
    }
    if (s2.includes('aptitude') || s2.includes('reasoning')) {
      return s1.includes('aptitude') || s1.includes('reasoning') || s1.includes('math');
    }
    if (s2.includes('software engineering') || s2.includes('software')) {
      return s1.includes('software') || s1.includes('engineering') || s1.includes('architecture') || s1.includes('system design');
    }
    return false;
  };

  const filteredQuestions = questions.filter(q => {
    const matchSubj = matchesSubject(q.category, selectedSubject);
    const matchDiff = selectedDifficulty === 'All Difficulties' || q.difficulty === selectedDifficulty;
    const matchType = selectedType === 'all' || q.type === selectedType;
    return matchSubj && matchDiff && matchType;
  });

  // When selectedSubject or filters change, auto-select the first filtered question
  useEffect(() => {
    if (filteredQuestions.length > 0) {
      const isCurrentInFiltered = filteredQuestions.some(q => q.id === activeQuestion.id);
      if (!isCurrentInFiltered) {
        handleSelectQuestion(filteredQuestions[0]);
      }
    }
  }, [selectedSubject, selectedDifficulty, selectedType, questions]);

  const handleLanguageChange = (lang: 'python' | 'java' | 'cpp' | 'c') => {
    setSelectedLanguage(lang);
    setCodeContent(getLanguageTemplate(lang, activeQuestion));
    setCodeOutput(null);
    setTestResults([]);
  };

  const handleSelectQuestion = (q: any) => {
    setActiveQuestion(q);
    setSelectedMcqOption(null);
    setIsMcqSubmitted(false);
    setCodeContent(getLanguageTemplate(selectedLanguage, q));
    setCodeOutput(null);
    setTestResults([]);
    setShowExplanation(false);
    setShowSolutionConfirmed(false);
    setHintsRevealed(0);
  };

  const handleMcqSubmit = async () => {
    if (selectedMcqOption === null) return;
    setIsMcqSubmitted(true);
    setShowExplanation(true);
    setIsSubmitting(true);

    const isCorrect = (selectedMcqOption === activeQuestion.correctAnswer);
    try {
      await api.submitAcademicQuiz({
        subject: activeQuestion.category,
        answers: [{
          question_id: activeQuestion.id,
          user_answer: String(activeQuestion.options ? activeQuestion.options[selectedMcqOption] : selectedMcqOption)
        }],
        time_taken_seconds: 30
      });
    } catch (e) {
      console.warn('Backend quiz submission warning:', e);
    } finally {
      setIsSubmitting(false);
    }

    if (isCorrect) {
      onAddXp(30);
      try {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setCodeOutput(null);
    setTestResults([]);

    try {
      const res = await api.runCode({
        challenge_id: activeQuestion.id,
        language: selectedLanguage,
        code: codeContent
      });
      if (res) {
        setCodeOutput(`[${res.execution_mode.toUpperCase()}] ${res.feedback}\nExecution Time: ${res.execution_time_ms}ms | Passed: ${res.passed_count}/${res.total_test_cases}`);
        if (res.test_results && res.test_results.length > 0) {
          setTestResults(res.test_results);
        }
      }
    } catch (e: any) {
      setCodeOutput(`Run Code Notice:\n${e.message || 'Execution error.'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setCodeOutput(null);

    try {
      const res = await api.submitCode({
        challenge_id: activeQuestion.id,
        language: selectedLanguage,
        code: codeContent
      });
      if (res) {
        setCodeOutput(`[SUBMISSION] Status: ${res.status.toUpperCase()}\n${res.feedback}\nExecution Time: ${res.execution_time_ms}ms | Test Cases Passed: ${res.passed_count}/${res.total_test_cases}`);
        if (res.test_results && res.test_results.length > 0) {
          setTestResults(res.test_results);
        }
        if (res.status === 'passed') {
          onAddXp(75);
          try {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          } catch (e) {}
        }
      }
    } catch (e: any) {
      setCodeOutput(`Submission Error: ${e.message || 'Could not submit code.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-purple-500/10">
          <Code className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-extrabold text-white">Academic Question Bank & Coding Suite</h2>
        <p className="text-slate-400 text-xs">
          14 core engineering subjects covering MCQs, architectural concepts, and data structures challenges.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Subject Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Subject:
          </span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
          >
            {REQUIRED_SUBJECTS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold uppercase text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Difficulty:
          </span>
          {DIFFICULTIES.map(diff => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedDifficulty === diff
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold uppercase text-slate-400 mr-1">Type:</span>
          {(['all', 'mcq', 'coding'] as const).map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase transition ${
                selectedType === t
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

      </div>

      {/* Main Grid: Question Browser & Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Question List */}
        <div className="lg:col-span-4 p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 max-h-[600px] overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            Available Problems ({filteredQuestions.length})
          </div>

          <div className="space-y-2">
            {filteredQuestions.map((q) => {
              const isSelected = activeQuestion.id === q.id;
              return (
                <div
                  key={q.id}
                  onClick={() => handleSelectQuestion(q)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-purple-600/20 border-purple-500 shadow-md shadow-purple-500/10'
                      : 'bg-slate-950/60 border-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-bold text-indigo-400 uppercase">{q.category}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">{q.difficulty}</span>
                  </div>
                  <div className="text-xs font-bold text-white line-clamp-2">{q.question}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Interactive Workspace */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
              {activeQuestion.category} • {activeQuestion.difficulty}
            </span>
            <span className="uppercase text-[10px] font-bold text-slate-500">
              {activeQuestion.type.toUpperCase()} Challenge
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white leading-relaxed">
              {activeQuestion.question}
            </h3>
          </div>

          {/* MCQ Mode */}
          {activeQuestion.type === 'mcq' && activeQuestion.options && (
            <div className="space-y-3 pt-2">
              <div className="space-y-2">
                {activeQuestion.options.map((opt, idx) => {
                  let optStyle = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
                  if (selectedMcqOption === idx && !isMcqSubmitted) {
                    optStyle = 'bg-indigo-600/20 border-indigo-500 text-white shadow-md';
                  }
                  if (isMcqSubmitted) {
                    if (idx === activeQuestion.correctAnswer) {
                      optStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                    } else if (selectedMcqOption === idx) {
                      optStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                    }
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => !isMcqSubmitted && setSelectedMcqOption(idx)}
                      className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {isMcqSubmitted && idx === activeQuestion.correctAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {isMcqSubmitted && selectedMcqOption === idx && idx !== activeQuestion.correctAnswer && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              {!isMcqSubmitted ? (
                <button
                  onClick={handleMcqSubmit}
                  disabled={selectedMcqOption === null || isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Evaluating...' : 'Submit Answer'}
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                  <div className="font-bold text-indigo-400 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4" />
                    <span>Concept Explanation</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{activeQuestion.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* Coding Challenge Mode */}
          {activeQuestion.type === 'coding' && (
            <div className="space-y-4 pt-2">
              
              {/* Language Selection & Execution Mode Header */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Language:</span>
                  {(['python', 'java', 'cpp', 'c'] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        selectedLanguage === lang
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {lang === 'python' ? 'Python 3' : lang === 'java' ? 'Java' : lang === 'cpp' ? 'C++' : 'C'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Active Execution Sandbox</span>
                </div>
              </div>

              {/* Sample Examples & Constraints */}
              {activeQuestion.testCases && activeQuestion.testCases.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">Sample Test Cases</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {activeQuestion.testCases.slice(0, 2).map((tc: any, i: number) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] space-y-1">
                        <div><span className="text-slate-500">Input:</span> <span className="text-slate-200">{tc.input}</span></div>
                        <div><span className="text-slate-500">Output:</span> <span className="text-emerald-400 font-bold">{tc.expected}</span></div>
                        {tc.explanation && <div className="text-[10px] text-slate-400 font-sans italic">{tc.explanation}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Code Editor */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[11px] text-slate-400 capitalize">{selectedLanguage} Solution Editor</span>
                  <span className="text-[11px] text-slate-500">Write independent solution without pre-filled answers</span>
                </div>
                <textarea
                  rows={9}
                  value={codeContent}
                  onChange={e => setCodeContent(e.target.value)}
                  placeholder="Write your code here..."
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              {/* Action Buttons: Run Code, Submit Code, Show Hints, Show Solution */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning || isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 border border-slate-700 disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                  </button>

                  <button
                    onClick={handleSubmitCode}
                    disabled={isRunning || isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Code'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Hints */}
                  {(activeQuestion as any).hints && (activeQuestion as any).hints.length > 0 && (
                    <button
                      onClick={() => setHintsRevealed(prev => Math.min(prev + 1, (activeQuestion as any).hints.length))}
                      className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Hint {hintsRevealed > 0 ? `(${hintsRevealed}/${(activeQuestion as any).hints.length})` : ''}</span>
                    </button>
                  )}

                  {/* Show Solution (Hidden until explicitly confirmed) */}
                  {!showSolutionConfirmed ? (
                    <button
                      onClick={() => setShowSolutionConfirmed(true)}
                      className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-amber-300 text-xs font-semibold transition"
                    >
                      Show Solution
                    </button>
                  ) : (
                    <span className="text-[11px] text-amber-400 font-semibold px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                      Solution Unlocked
                    </span>
                  )}
                </div>
              </div>

              {/* Hints Box */}
              {hintsRevealed > 0 && (activeQuestion as any).hints && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" />
                    <span>Hints</span>
                  </div>
                  <ul className="list-disc list-inside text-amber-200/90 space-y-1">
                    {(activeQuestion as any).hints.slice(0, hintsRevealed).map((hint: string, hIdx: number) => (
                      <li key={hIdx}>{hint}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Execution Output */}
              {codeOutput && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Execution Output</div>
                  <pre className="whitespace-pre-wrap">{codeOutput}</pre>
                </div>
              )}

              {/* Detailed Test Results */}
              {testResults.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>Test Case Breakdown</span>
                  </div>
                  <div className="space-y-2">
                    {testResults.map((tr: any) => (
                      <div
                        key={tr.test_number}
                        className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono ${
                          tr.passed
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                        }`}
                      >
                        <div>
                          <span className="font-bold">Test {tr.test_number}:</span> {tr.passed ? 'PASSED ✅' : 'FAILED ❌'}
                          <div className="text-slate-400 mt-0.5">Input: {tr.input}</div>
                        </div>
                        <div className="sm:text-right">
                          <div>Expected: {tr.expected}</div>
                          <div>Actual: {tr.actual}</div>
                          {tr.error && <div className="text-rose-400 text-[10px] mt-0.5">{tr.error}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Unlocked Solution Display */}
              {showSolutionConfirmed && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 text-xs space-y-1.5">
                  <div className="font-bold text-indigo-400 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4" />
                    <span>Algorithmic Approach & Explanation</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{activeQuestion.explanation}</p>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
