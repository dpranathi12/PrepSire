import React, { useState, useEffect } from 'react';
import { UserProfile, TargetRole, MockInterviewSession, InterviewQuestion } from '../types';
import { 
  HR_QUESTIONS, 
  TECHNICAL_INTERVIEW_QUESTIONS, 
  evaluateAnswer, 
  generateFollowUpQuestion 
} from '../utils/aiEngine';
import { speechHandler } from '../utils/speechUtils';
import { api } from '../services/api';
import { 
  Video, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Sparkles, 
  Bot, 
  RefreshCw, 
  Award, 
  FileText,
  Play,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MockInterviewProps {
  profile: UserProfile;
  onSaveSession: (session: MockInterviewSession) => void;
  onViewReport: (session: MockInterviewSession) => void;
}

export const MockInterview: React.FC<MockInterviewProps> = ({
  profile,
  onSaveSession,
  onViewReport
}) => {
  const [phase, setPhase] = useState<'setup' | 'interview' | 'finished'>('setup');
  const [type, setType] = useState<'HR' | 'Technical' | 'Behavioral' | 'Mixed'>('Mixed');
  const [role, setRole] = useState<TargetRole>(profile.targetRole || 'Software Developer');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [totalQuestions, setTotalQuestions] = useState<number>(5);

  const [backendSessionId, setBackendSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userText, setUserText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [finishedSession, setFinishedSession] = useState<MockInterviewSession | null>(null);

  // Initialize Interview Questions (via Backend or fallback)
  const startInterview = async () => {
    try {
      const backendRes = await api.createInterview({
        role,
        interview_type: type,
        difficulty,
        total_questions: totalQuestions
      });

      if (backendRes && backendRes.id && backendRes.questions && backendRes.questions.length > 0) {
        setBackendSessionId(backendRes.id);
        const mappedQuestions: InterviewQuestion[] = backendRes.questions.map((q: any) => ({
          id: q.id,
          question: q.question_text,
          category: q.category || 'Technical',
          isFollowUp: q.is_follow_up || false
        }));
        setQuestions(mappedQuestions);
        setCurrentIdx(0);
        setPhase('interview');
        if (mappedQuestions[0]) {
          speakQuestion(mappedQuestions[0].question);
        }
        return;
      }
    } catch (e) {
      console.warn('Backend interview creation failed, using curated question bank:', e);
    }

    // Local fallback with randomized fresh question selection
    let pool: { question: string; category: 'HR' | 'Technical' | 'Behavioral' }[] = [];
    
    // Shuffle helper
    const shuffleArray = <T,>(arr: T[]): T[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    const shuffledHR = shuffleArray(HR_QUESTIONS);
    const roleKey = role in TECHNICAL_INTERVIEW_QUESTIONS ? role : 'Software Developer';
    const shuffledTech = shuffleArray(TECHNICAL_INTERVIEW_QUESTIONS[roleKey] || TECHNICAL_INTERVIEW_QUESTIONS['Software Developer']);

    if (type === 'HR') {
      shuffledHR.slice(0, totalQuestions).forEach(q => pool.push({ question: q, category: 'HR' }));
    } else if (type === 'Technical') {
      shuffledTech.slice(0, totalQuestions).forEach(q => pool.push({ question: q, category: 'Technical' }));
    } else if (type === 'Behavioral') {
      shuffledHR.slice(0, totalQuestions).forEach(q => pool.push({ question: q, category: 'Behavioral' }));
    } else {
      // Mixed
      const hrCount = Math.max(1, Math.floor(totalQuestions / 2));
      const techCount = totalQuestions - hrCount;
      shuffledHR.slice(0, hrCount).forEach(q => pool.push({ question: q, category: 'HR' }));
      shuffledTech.slice(0, techCount).forEach(q => pool.push({ question: q, category: 'Technical' }));
      pool = shuffleArray(pool);
    }

    const formatted: InterviewQuestion[] = pool.slice(0, totalQuestions).map((q, idx) => ({
      id: `local-q-${Date.now()}-${idx}`,
      question: q.question,
      category: q.category
    }));

    setQuestions(formatted);
    setCurrentIdx(0);
    setPhase('interview');
    if (formatted[0]) {
      speakQuestion(formatted[0].question);
    }
  };

  const speakQuestion = (qText: string) => {
    setIsSpeaking(true);
    speechHandler.speak(qText, () => setIsSpeaking(false));
  };

  const toggleRecording = () => {
    if (isRecording) {
      speechHandler.stopListening();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      speechHandler.startListening(
        (transcript) => setUserText(transcript),
        (err) => {
          console.warn(err);
          setIsRecording(false);
        }
      );
    }
  };

  const handleNextQuestion = async () => {
    if (!userText.trim()) return;

    if (isRecording) {
      speechHandler.stopListening();
      setIsRecording(false);
    }

    setIsEvaluating(true);
    const currentQ = questions[currentIdx];
    let evaluation: any = null;

    if (backendSessionId) {
      try {
        const evalRes = await api.submitInterviewAnswer(backendSessionId, {
          interview_question_id: currentQ.id,
          user_answer: userText,
          answer_method: isRecording ? 'speech' : 'typed',
          duration_seconds: 45
        });
        if (evalRes) {
          evaluation = {
            score: Math.round(evalRes.overall_score),
            feedback: evalRes.sample_improved_answer,
            fillerWordsFound: evalRes.filler_words || [],
            fillerWordCount: evalRes.filler_count || 0,
            starMethodUsed: evalRes.star_method_used || false,
            whatWentWell: evalRes.strengths || [],
            needsImprovement: evalRes.improvement_suggestions || [],
            improvedAnswer: evalRes.sample_improved_answer || '',
            followUpQuestion: evalRes.follow_up_question,
            evaluationMode: evalRes.evaluation_mode
          };
        }
      } catch (err) {
        console.warn('Backend evaluation failed, evaluating locally:', err);
      }
    }

    if (!evaluation) {
      evaluation = evaluateAnswer(currentQ.question, userText, currentQ.category);
    }

    const updatedQ: InterviewQuestion = {
      ...currentQ,
      userAnswer: userText,
      evaluation
    };

    const updatedQuestions = [...questions];
    updatedQuestions[currentIdx] = updatedQ;

    // Follow-up question insertion
    if (evaluation?.followUpQuestion && !currentQ.isFollowUp && currentIdx === 1) {
      const followUpQ: InterviewQuestion = {
        id: `followup-${Date.now()}`,
        question: evaluation.followUpQuestion,
        category: currentQ.category,
        isFollowUp: true
      };
      updatedQuestions.splice(currentIdx + 1, 0, followUpQ);
    }

    setQuestions(updatedQuestions);
    setUserText('');
    setIsEvaluating(false);

    if (currentIdx < updatedQuestions.length - 1) {
      const nextIndex = currentIdx + 1;
      setCurrentIdx(nextIndex);
      speakQuestion(updatedQuestions[nextIndex].question);
    } else {
      completeSession(updatedQuestions);
    }
  };

  const completeSession = async (finalQuestions: InterviewQuestion[]) => {
    let finalScore = 75;
    let commScore = 75;
    let techScore = 75;
    let confScore = 75;
    let strengths = ['Clear technical approach', 'Direct communication'];
    let weaknesses = ['Could elaborate on scale and trade-offs'];

    if (backendSessionId) {
      try {
        const finishRes = await api.finishInterview(backendSessionId);
        if (finishRes) {
          finalScore = Math.round(finishRes.overall_score);
          commScore = Math.round(finishRes.communication_score);
          techScore = Math.round(finishRes.technical_score);
          confScore = Math.round(finishRes.confidence_score);
          strengths = finishRes.strengths || strengths;
          weaknesses = finishRes.weaknesses || weaknesses;
        }
      } catch (err) {
        console.warn('Backend finish call failed:', err);
      }
    } else {
      const validEvals = finalQuestions.map(q => q.evaluation!).filter(Boolean);
      if (validEvals.length > 0) {
        finalScore = Math.round(validEvals.reduce((acc, curr) => acc + curr.score, 0) / validEvals.length);
        commScore = Math.min(98, finalScore + 4);
        techScore = type === 'HR' ? finalScore : Math.min(98, finalScore - 2);
        confScore = Math.min(98, finalScore + 2);
      }
    }

    const session: MockInterviewSession = {
      id: backendSessionId || `mock-${Date.now()}`,
      date: new Date().toISOString(),
      type,
      role,
      difficulty,
      questions: finalQuestions,
      overallScore: finalScore,
      communicationScore: commScore,
      technicalScore: techScore,
      confidenceScore: confScore,
      strongAreas: strengths,
      weakAreas: weaknesses,
      recommendedTopics: [
        `${role} Fundamentals`,
        'System Design Trade-offs',
        'STAR Method Structuring'
      ],
      actionPlan: [
        'Practice 60-second elevator pitch to eliminate filler words.',
        'Review core time complexity analysis for data structures.',
        'Simulate high-pressure scenarios in JAM practice.'
      ]
    };

    setFinishedSession(session);
    setPhase('finished');
    onSaveSession(session);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Confetti fallback
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Setup View */}
      {phase === 'setup' && (
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-8">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-2">
              <Video className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-white">AI Mock Interview Simulator</h2>
            <p className="text-slate-400 text-xs">
              Simulate high-pressure placement interviews powered by our 20,000+ question database with AI evaluation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Target Role */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Target Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as TargetRole)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Java Developer">Java Developer</option>
                <option value="Python Developer">Python Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="AI/ML Engineer">AI/ML Engineer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Software Developer">Software Developer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="HR Specialist">HR Specialist</option>
                <option value="Marketing Executive">Marketing Executive</option>
              </select>
            </div>

            {/* Interview Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Interview Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Mixed">Mixed (Technical + Behavioral + HR)</option>
                <option value="Technical">Technical Assessment Round</option>
                <option value="Behavioral">Behavioral (STAR Method)</option>
                <option value="HR">HR Screening Round</option>
              </select>
            </div>

            {/* Questions Count */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Questions in Session</label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 5, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTotalQuestions(num)}
                    className={`py-2.5 rounded-xl font-bold text-xs border transition ${
                      totalQuestions === num
                        ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {num} Questions
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Difficulty Level</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Easy', 'Medium', 'Hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-2.5 rounded-xl font-bold text-xs border transition ${
                      difficulty === diff
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/25'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Evaluation Engine Badge */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Evaluation Engine</label>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span>Real-Time Feedback & STAR Analysis</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">Active</span>
              </div>
            </div>

          </div>

          <div className="text-center pt-4">
            <button
              onClick={startInterview}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/25 transition-all flex items-center gap-2 mx-auto"
            >
              <Play className="w-4 h-4" />
              <span>Begin Mock Interview Session</span>
            </button>
          </div>

        </div>
      )}

      {/* Live Interview Session View */}
      {phase === 'interview' && questions[currentIdx] && (
        <div className="space-y-6">
          
          {/* Progress Banner */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <div>Question {currentIdx + 1} of {questions.length}</div>
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
              {questions[currentIdx].category} Round
            </span>
          </div>

          {/* Question Box */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Interviewer Asked</span>
                <h3 className="text-lg font-bold text-white leading-relaxed">
                  {questions[currentIdx].question}
                </h3>
              </div>
              <button
                onClick={() => speakQuestion(questions[currentIdx].question)}
                className={`p-2.5 rounded-xl border transition shrink-0 ${
                  isSpeaking ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
                title="Speak Question"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Answer Input Area */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Your Answer</label>
              
              <button
                type="button"
                onClick={toggleRecording}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-indigo-400" />}
                <span>{isRecording ? 'Listening...' : 'Voice Input'}</span>
              </button>
            </div>

            <textarea
              rows={5}
              placeholder="Structure your answer clearly. For behavioral questions, use Situation, Task, Action, and Result (STAR)..."
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-slate-500">
                Word count: {userText.trim().split(/\s+/).filter(Boolean).length}
              </span>

              <button
                type="button"
                disabled={!userText.trim() || isEvaluating}
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition disabled:opacity-50 flex items-center gap-2"
              >
                {isEvaluating ? (
                  <span>Evaluating answer...</span>
                ) : (
                  <>
                    <span>{currentIdx < questions.length - 1 ? 'Next Question' : 'Complete Interview'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Finished Summary View */}
      {phase === 'finished' && finishedSession && (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 text-center">
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center mx-auto text-white shadow-xl shadow-emerald-500/20">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">Interview Complete!</h2>
            <p className="text-slate-400 text-xs">Your performance was evaluated and saved to your permanent record.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-2xl font-black text-white">{finishedSession.overallScore}/100</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Overall</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-2xl font-black text-indigo-400">{finishedSession.communicationScore}/100</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Communication</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-2xl font-black text-pink-400">{finishedSession.technicalScore}/100</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Technical</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-2xl font-black text-amber-400">{finishedSession.confidenceScore}/100</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Confidence</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <button
              onClick={() => onViewReport(finishedSession)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>View Full Feedback Report</span>
            </button>
            
            <button
              onClick={() => {
                setPhase('setup');
                setBackendSessionId(null);
                setQuestions([]);
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Another Round</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
