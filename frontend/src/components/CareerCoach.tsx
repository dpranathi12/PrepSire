import React, { useState } from 'react';
import { ChatMessage, UserProfile, SkillScores } from '../types';
import { Bot, Send, User, Sparkles, Lightbulb } from 'lucide-react';

interface CareerCoachProps {
  profile: UserProfile;
  scores: SkillScores;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

export const CareerCoach: React.FC<CareerCoachProps> = ({
  profile,
  scores,
  messages,
  onSendMessage
}) => {
  const [inputText, setInputText] = useState('');

  const quickPrompts = [
    "How can I improve my communication score?",
    "What should I learn for a Software Developer interview?",
    "Give me Python interview questions.",
    "How should I answer 'Tell me about yourself'?",
    "What skills am I weak in?",
    "Create a 30-day preparation plan for me."
  ];

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
          <Bot className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-extrabold text-white">AI Career Coach</h2>
        <p className="text-slate-400 text-sm mt-1">
          Ask questions about interview strategy, resume pitches, role-specific guidance, and personalized study plans.
        </p>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(qp)}
            className="px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white text-xs font-medium whitespace-nowrap transition-all cursor-pointer shadow-sm"
          >
            💡 {qp}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-4 min-h-[400px] max-h-[550px] overflow-y-auto flex flex-col justify-between">
        
        <div className="space-y-4">
          {messages.map((msg) => {
            const isCoach = msg.sender === 'coach';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isCoach ? '' : 'flex-row-reverse'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                  isCoach ? 'bg-gradient-to-tr from-indigo-600 to-pink-500' : 'bg-slate-700'
                }`}>
                  {isCoach ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  isCoach 
                    ? 'bg-slate-950/80 border border-slate-800 text-slate-200' 
                    : 'bg-indigo-600 text-white font-medium'
                }`}>
                  {msg.text}
                  <div className={`text-[10px] mt-1.5 flex items-center justify-between gap-2 ${isCoach ? 'text-slate-500' : 'text-indigo-200'}`}>
                    {isCoach && msg.mode && (
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wide uppercase ${
                        msg.mode === 'ollama' 
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50' 
                          : msg.mode === 'gemini'
                          ? 'bg-blue-950/60 text-blue-400 border border-blue-800/50'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {msg.mode === 'ollama' ? '🦙 Ollama' : msg.mode === 'gemini' ? '☁️ Gemini' : '⚡ Offline'}
                      </span>
                    )}
                    <span className="ml-auto">{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Input Bar */}
        <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask your AI Career Coach anything..."
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 outline-none"
          />

          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`p-3 rounded-xl font-bold flex items-center justify-center cursor-pointer transition-all ${
              inputText.trim()
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
