import React, { useState } from 'react';
import { MockInterviewSession } from '../types';
import { X, CheckCircle2, AlertTriangle, Lightbulb, FileText, Download, Copy, Check } from 'lucide-react';

interface InterviewReportModalProps {
  session: MockInterviewSession | null;
  onClose: () => void;
}

export const InterviewReportModal: React.FC<InterviewReportModalProps> = ({ session, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!session) return null;

  const handleCopy = () => {
    const summaryText = `PrepSpire AI — Interview Performance Report
Date: ${session.date} | Role: ${session.role} | Type: ${session.type}
Overall Score: ${session.overallScore}%
Communication: ${session.communicationScore}% | Technical: ${session.technicalScore}% | Confidence: ${session.confidenceScore}%

Strong Areas:
${session.strongAreas.map(s => `- ${s}`).join('\n')}

Needs Improvement:
${session.weakAreas.map(w => `- ${w}`).join('\n')}

Action Plan:
${session.actionPlan.map(a => `- ${a}`).join('\n')}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:text-black">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 relative print:border-none print:shadow-none print:bg-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-indigo-400">Mock Interview Performance Report</div>
            <h2 className="text-2xl font-extrabold text-white print:text-black">
              {session.type} Interview — {session.role}
            </h2>
            <div className="text-xs text-slate-400 mt-0.5">Date: {session.date} • Difficulty: {session.difficulty}</div>
          </div>
        </div>

        {/* Score Ring / Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 print:bg-slate-100">
            <div className="text-[11px] font-bold uppercase text-indigo-300 print:text-slate-700">Overall Score</div>
            <div className="text-3xl font-extrabold text-indigo-400 print:text-indigo-700 mt-1">{session.overallScore}%</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 print:bg-slate-100">
            <div className="text-[11px] font-bold uppercase text-slate-400 print:text-slate-700">Communication</div>
            <div className="text-2xl font-extrabold text-white print:text-black mt-1">{session.communicationScore}%</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 print:bg-slate-100">
            <div className="text-[11px] font-bold uppercase text-slate-400 print:text-slate-700">Technical</div>
            <div className="text-2xl font-extrabold text-white print:text-black mt-1">{session.technicalScore}%</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 print:bg-slate-100">
            <div className="text-[11px] font-bold uppercase text-slate-400 print:text-slate-700">Confidence</div>
            <div className="text-2xl font-extrabold text-white print:text-black mt-1">{session.confidenceScore}%</div>
          </div>
        </div>

        {/* Strong Areas & Needs Improvement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 print:bg-slate-50">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 print:text-emerald-700 uppercase">
              <CheckCircle2 className="w-4 h-4" /> Strong Areas
            </div>
            <ul className="space-y-1">
              {session.strongAreas.map((sa, idx) => (
                <li key={idx} className="text-xs text-emerald-200 print:text-slate-800 flex items-center gap-1.5">
                  <span className="text-emerald-400">•</span> {sa}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2 print:bg-slate-50">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 print:text-amber-700 uppercase">
              <AlertTriangle className="w-4 h-4" /> Needs Improvement
            </div>
            <ul className="space-y-1">
              {session.weakAreas.map((wa, idx) => (
                <li key={idx} className="text-xs text-amber-200 print:text-slate-800 flex items-center gap-1.5">
                  <span className="text-amber-400">•</span> {wa}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Question by Question Breakdown */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white print:text-black uppercase tracking-wider">Question Breakdown ({session.questions.length})</h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 print:max-h-none">
            {session.questions.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 print:bg-slate-50 print:border-slate-300 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-400 print:text-indigo-800">Q{idx + 1}: {q.question}</span>
                  {q.evaluation && (
                    <span className="font-bold text-emerald-400 print:text-emerald-800">Score: {q.evaluation.score}%</span>
                  )}
                </div>

                {q.userAnswer && (
                  <div className="text-slate-300 print:text-slate-800">
                    <span className="text-slate-500 print:text-slate-600 font-semibold">Your Answer:</span> "{q.userAnswer}"
                  </div>
                )}

                {q.evaluation?.improvedAnswer && (
                  <div className="text-indigo-200 print:text-slate-900 italic bg-indigo-950/30 print:bg-indigo-50 p-2.5 rounded-xl border border-indigo-500/20">
                    <span className="font-semibold text-indigo-400 print:text-indigo-800 not-italic">Improved Model Answer:</span> "{q.evaluation.improvedAnswer}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Plan */}
        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2 print:bg-slate-50">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 print:text-indigo-800 uppercase">
            <Lightbulb className="w-4 h-4" /> Personalized Action Plan
          </div>
          <ul className="space-y-1">
            {session.actionPlan.map((ap, idx) => (
              <li key={idx} className="text-xs text-indigo-200 print:text-slate-800 flex items-center gap-1.5">
                <span className="text-indigo-400">•</span> {ap}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-between items-center pt-2 print:hidden gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Report Copied!' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export / Print Report</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow-lg"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
};
