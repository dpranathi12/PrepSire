import React, { useState, useEffect } from 'react';
import { evaluateAnswer } from '../utils/aiEngine';
import { speechHandler } from '../utils/speechUtils';
import { api } from '../services/api';
import { 
  Mic, MicOff, Send, Sparkles, CheckCircle2, AlertTriangle, 
  Lightbulb, Volume2, ArrowRight, Play, Clock, RefreshCw 
} from 'lucide-react';
import { CommunicationPrompt } from '../types';

const CATEGORIES = [
  'All Categories',
  'Self Introduction',
  'Technology',
  'Education',
  'Current Affairs',
  'Workplace Communication',
  'Social Issues',
  'Leadership',
  'Teamwork',
  'Personal Experiences',
  'General Conversation'
];

export const CommunicationPractice: React.FC = () => {
  const [category, setCategory] = useState<string>('Self Introduction');
  const [difficulty, setDifficulty] = useState<string>('Beginner');
  const [prepTimeSeconds, setPrepTimeSeconds] = useState<number>(30);
  const [speakingTimeSeconds, setSpeakingTimeSeconds] = useState<number>(120);

  const [prompts, setPrompts] = useState<CommunicationPrompt[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);
  const [currentPromptId, setCurrentPromptId] = useState<string | undefined>(undefined);
  const [currentPrompt, setCurrentPrompt] = useState<string>(
    'Deliver a professional 60-second elevator pitch introducing your academic background, core technical strengths, and career ambitions.'
  );

  const [stage, setStage] = useState<'idle' | 'prep' | 'speaking' | 'evaluated'>('idle');
  const [inputMode, setInputMode] = useState<'speech' | 'typed'>('speech');
  const [prepRemaining, setPrepRemaining] = useState<number>(30);
  const [speakingRemaining, setSpeakingRemaining] = useState<number>(120);
  const [userSpeech, setUserSpeech] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<any | null>(null);

  // Fetch prompts from backend
  const loadPrompts = async (selectedCat = category, selectedDiff = difficulty) => {
    try {
      const catParam = selectedCat === 'All Categories' ? undefined : selectedCat;
      const res = await api.getCommunicationPrompts(catParam, selectedDiff);
      if (res && res.length > 0) {
        setPrompts(res);
        setCurrentPromptIndex(0);
        setCurrentPrompt(res[0].prompt_text);
        setCurrentPromptId(res[0].id);
        if (res[0].prep_time_seconds) setPrepTimeSeconds(res[0].prep_time_seconds);
        if (res[0].speaking_time_seconds) setSpeakingTimeSeconds(res[0].speaking_time_seconds);
      }
    } catch (err) {
      console.warn('Could not fetch communication prompts:', err);
    }
  };

  useEffect(() => {
    loadPrompts();
  }, [category, difficulty]);

  const handleNextPrompt = () => {
    if (prompts.length > 1) {
      const nextIdx = (currentPromptIndex + 1) % prompts.length;
      setCurrentPromptIndex(nextIdx);
      setCurrentPrompt(prompts[nextIdx].prompt_text);
      setCurrentPromptId(prompts[nextIdx].id);
      if (prompts[nextIdx].prep_time_seconds) setPrepTimeSeconds(prompts[nextIdx].prep_time_seconds);
      if (prompts[nextIdx].speaking_time_seconds) setSpeakingTimeSeconds(prompts[nextIdx].speaking_time_seconds);
      setStage('idle');
      setEvaluation(null);
      setUserSpeech('');
    } else {
      // Fetch fresh random prompt from backend
      const catParam = category === 'All Categories' ? undefined : category;
      api.getRandomCommunicationPrompt(catParam, difficulty, currentPromptId).then(res => {
        if (res) {
          setCurrentPrompt(res.prompt_text);
          setCurrentPromptId(res.id);
          setStage('idle');
          setEvaluation(null);
          setUserSpeech('');
        }
      }).catch(e => console.warn(e));
    }
  };

  // Prep Countdown
  useEffect(() => {
    let interval: any = null;
    if (stage === 'prep') {
      if (prepRemaining > 0) {
        interval = setInterval(() => setPrepRemaining(p => p - 1), 1000);
      } else {
        setStage('speaking');
        startRecording();
      }
    }
    return () => clearInterval(interval);
  }, [stage, prepRemaining]);

  // Speaking Countdown
  useEffect(() => {
    let interval: any = null;
    if (stage === 'speaking') {
      if (speakingRemaining > 0) {
        interval = setInterval(() => setSpeakingRemaining(s => s - 1), 1000);
      } else {
        handleSubmitResponse();
      }
    }
    return () => clearInterval(interval);
  }, [stage, speakingRemaining]);

  const startPrep = () => {
    setPrepRemaining(prepTimeSeconds);
    setSpeakingRemaining(speakingTimeSeconds);
    setUserSpeech('');
    setEvaluation(null);
    setStage('prep');
  };

  const startRecording = () => {
    setIsRecording(true);
    speechHandler.startListening(
      (transcript) => setUserSpeech(transcript),
      (err) => {
        console.warn('Speech recognition warning:', err);
        setIsRecording(false);
      }
    );
  };

  const toggleRecording = () => {
    if (isRecording) {
      speechHandler.stopListening();
      setIsRecording(false);
    } else {
      startRecording();
    }
  };

  const handleSubmitResponse = async () => {
    if (!userSpeech.trim()) return;
    if (isRecording) {
      speechHandler.stopListening();
      setIsRecording(false);
    }

    setIsEvaluating(true);
    const actualDuration = speakingTimeSeconds - speakingRemaining;

    try {
      const res = await api.submitCommunicationSession({
        category,
        prompt_text: currentPrompt,
        prep_time_seconds: prepTimeSeconds,
        response_duration_seconds: speakingTimeSeconds,
        actual_duration_seconds: Math.max(15, actualDuration),
        response_text: userSpeech,
        response_method: isRecording ? 'speech' : 'typed'
      });
      if (res) {
        setEvaluation(res);
        setStage('evaluated');
        setIsEvaluating(false);
        return;
      }
    } catch (e) {
      console.warn('Backend evaluation failed, using fallback:', e);
    }

    // Local heuristic fallback
    const localEval = evaluateAnswer(currentPrompt, userSpeech, 'Behavioral');
    setEvaluation({
      overall_score: localEval.score,
      relevance_score: localEval.score,
      clarity_score: localEval.score,
      structure_score: localEval.starMethodUsed ? 88 : 70,
      grammar_score: 75,
      vocabulary_score: 75,
      conciseness_score: 80,
      filler_words: localEval.fillerWordsFound,
      filler_count: localEval.fillerWordCount,
      words_per_minute: 120,
      strengths: localEval.whatWentWell,
      weaknesses: localEval.needsImprovement,
      alternative_expressions: [
        "Instead of 'I think that...', consider 'From my engineering experience...'"
      ],
      improved_sample_answer: localEval.improvedAnswer,
      next_step_recommendation: "Focus on pausing silently for 2 seconds instead of using verbal filler sounds."
    });
    setStage('evaluated');
    setIsEvaluating(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-indigo-500/10">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-extrabold text-white">Communication Practice Module</h2>
        <p className="text-slate-400 text-xs">
          Improve speech fluency, answer structuring, and vocabulary with live timers and filler word detection.
        </p>
      </div>

      {/* Configuration Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              disabled={stage !== 'idle'}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              disabled={stage !== 'idle'}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Preparation Time</label>
            <select
              value={prepTimeSeconds}
              onChange={e => setPrepTimeSeconds(Number(e.target.value))}
              disabled={stage !== 'idle'}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
            >
              <option value={15}>15 Seconds</option>
              <option value={30}>30 Seconds (Default)</option>
              <option value={60}>60 Seconds</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Response Duration</label>
            <select
              value={speakingTimeSeconds}
              onChange={e => setSpeakingTimeSeconds(Number(e.target.value))}
              disabled={stage !== 'idle'}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
            >
              <option value={60}>1 Minute (60s)</option>
              <option value={120}>2 Minutes (120s)</option>
              <option value={180}>3 Minutes (180s)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Prompt Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold uppercase tracking-wider text-indigo-400">{category} ({difficulty})</span>
          <div className="flex items-center gap-3">
            <span>Prep: {prepTimeSeconds}s</span>
            <span>Duration: {speakingTimeSeconds / 60}m</span>
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
          "{currentPrompt}"
        </h3>

        {/* Timers & Actions */}
        {stage === 'idle' && (
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={startPrep}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Preparation Timer ({prepTimeSeconds}s)</span>
            </button>

            <button
              onClick={handleNextPrompt}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-pink-400" />
              <span>Try Another Prompt</span>
            </button>

            <button
              onClick={() => {
                setPrepRemaining(0);
                setSpeakingRemaining(speakingTimeSeconds);
                setUserSpeech('');
                setEvaluation(null);
                setStage('speaking');
              }}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold text-xs transition flex items-center gap-2"
            >
              <span>Skip Prep & Type Answer</span>
            </button>
          </div>
        )}

        {stage === 'prep' && (
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-center space-y-1">
            <div className="text-xs font-semibold text-indigo-300">Formulating Response (Prep Countdown)</div>
            <div className="text-5xl font-black text-white font-mono">{prepRemaining}s</div>
            <p className="text-[11px] text-slate-400">Speaking timer begins automatically when countdown reaches zero.</p>
          </div>
        )}

        {stage === 'speaking' && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                <span>Response Timer: {speakingRemaining}s remaining</span>
              </span>
              <button
                type="button"
                onClick={toggleRecording}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                  isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-indigo-400" />}
                <span>{isRecording ? 'Stop Mic' : 'Start Mic'}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={userSpeech}
              onChange={e => setUserSpeech(e.target.value)}
              placeholder="Speak or type your structured response..."
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />

            <div className="flex justify-between items-center pt-1">
              <span className="text-[11px] text-slate-500">
                Word Count: {userSpeech.trim().split(/\s+/).filter(Boolean).length}
              </span>
              <button
                onClick={handleSubmitResponse}
                disabled={!userSpeech.trim() || isEvaluating}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
              >
                <span>{isEvaluating ? 'Evaluating...' : 'Submit Response'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Evaluation Output */}
        {stage === 'evaluated' && evaluation && (
          <div className="space-y-6 pt-4 border-t border-slate-800 text-xs">
            
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 flex items-center justify-between">
              <div>
                <div className="text-slate-400">Overall Communication Score</div>
                <div className="text-3xl font-black text-white">{evaluation.overall_score}/100</div>
              </div>
              <div className="text-right text-slate-400 text-[11px]">
                <div>WPM: {evaluation.words_per_minute || 120}</div>
                <div>Fillers Detected: {evaluation.filler_count || 0}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Strong Elements
                </h4>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  {(evaluation.strengths || ['Good structured progression.']).map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Areas for Growth
                </h4>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  {(evaluation.weaknesses || ['Continue expanding with concrete metrics.']).map((w: string, i: number) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>

            {evaluation.improved_sample_answer && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <h4 className="font-bold text-indigo-400 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" /> Improved Candidate Sample
                </h4>
                <p className="text-slate-300 leading-relaxed italic">
                  "{evaluation.improved_sample_answer}"
                </p>
              </div>
            )}

            <div className="text-center pt-2 flex items-center justify-center gap-3">
              <button
                onClick={handleNextPrompt}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Practice Another Communication Topic</span>
              </button>
              <button
                onClick={() => setStage('idle')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Retry This Prompt
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
