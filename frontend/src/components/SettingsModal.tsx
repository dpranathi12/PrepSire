import React, { useState, useEffect } from 'react';
import { X, Cpu, Volume2, Save, ShieldCheck, Wifi, WifiOff, Zap } from 'lucide-react';
import { api } from '../services/api';
import { AISettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<AISettings>({
    active_ai_mode: 'offline',
    gemini_configured: false,
    gemini_model: 'gemini-1.5-flash',
    ollama_configured: false,
    ollama_base_url: 'http://localhost:11434',
    ollama_model: 'qwen2.5:7b',
    supported_modes: ['offline', 'gemini', 'ollama']
  });

  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [speechLang, setSpeechLang] = useState('en-US');
  const [defaultPrep, setDefaultPrep] = useState('30');
  const [defaultSpeaking, setDefaultSpeaking] = useState('60');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [providerStatus, setProviderStatus] = useState<any>(null);
  const [checkingProviders, setCheckingProviders] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.getSettings().then(s => {
        if (s) setSettings(s);
      }).catch(err => console.warn('Could not fetch settings:', err));
      checkProviders();
    }
  }, [isOpen]);

  const checkProviders = async () => {
    setCheckingProviders(true);
    try {
      const status = await api.getProviderStatus();
      setProviderStatus(status);
    } catch (e) {
      console.warn('Provider status check failed:', e);
    } finally {
      setCheckingProviders(false);
    }
  };

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const payload: any = {
        ai_mode: settings.active_ai_mode,
        gemini_model: settings.gemini_model,
        ollama_base_url: settings.ollama_base_url,
        ollama_model: settings.ollama_model
      };
      if (geminiApiKey.trim()) {
        payload.gemini_api_key = geminiApiKey.trim();
      }
      const updated = await api.updateSettings(payload);
      setSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert('Error updating settings: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const ollamaOk = providerStatus?.providers?.ollama?.available && providerStatus?.providers?.ollama?.model_ready;
  const geminiOk = providerStatus?.providers?.gemini?.available;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Platform Settings & AI Engine</h2>
              <p className="text-xs text-slate-400">Configure AI provider, speech synthesis, and practice timers.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Settings saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Provider Status Bar */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">AI Provider Status</span>
              <button
                type="button"
                onClick={checkProviders}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                {checkingProviders ? 'Checking...' : '↻ Refresh'}
              </button>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-lg font-semibold ${
                ollamaOk ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
              }`}>
                {ollamaOk ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                Ollama {ollamaOk ? '● Online' : '○ Offline'}
              </div>
              <div className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-lg font-semibold ${
                geminiOk ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-500'
              }`}>
                {geminiOk ? <Zap className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                Gemini {geminiOk ? '● Configured' : '○ Not configured'}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-lg font-semibold bg-slate-800 text-slate-400">
                <ShieldCheck className="w-3 h-3" />
                Offline ● Always Available
              </div>
            </div>
          </div>

          {/* AI Mode Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Evaluation & Coach AI Mode</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <div 
                onClick={() => setSettings(prev => ({ ...prev, active_ai_mode: 'offline' }))}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  settings.active_ai_mode === 'offline'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-sm font-bold text-white mb-1">Offline Heuristics</div>
                <div className="text-[11px] leading-snug">Built-in deterministic metrics: WPM, STAR method, and filler detector. Zero API keys needed. Always works.</div>
              </div>

              <div 
                onClick={() => setSettings(prev => ({ ...prev, active_ai_mode: 'gemini' }))}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  settings.active_ai_mode === 'gemini'
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-sm font-bold text-white mb-1">Google Gemini ☁️</div>
                <div className="text-[11px] leading-snug">Cloud-based LLM. Dynamic evaluation, context-aware feedback, and conversational coaching. Requires API key.</div>
              </div>

              <div 
                onClick={() => setSettings(prev => ({ ...prev, active_ai_mode: 'ollama' }))}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  settings.active_ai_mode === 'ollama'
                    ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-sm font-bold text-white mb-1">Ollama (Local AI) 🦙</div>
                <div className="text-[11px] leading-snug">Self-hosted open-source LLM. Full AI intelligence, 100% private, no API keys. Requires Ollama running locally.</div>
              </div>

            </div>
          </div>

          {/* Gemini Config */}
          {settings.active_ai_mode === 'gemini' && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400">Gemini API Configuration</span>
                <span className="text-[10px] text-slate-500">Stored strictly server-side</span>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">API Key {settings.gemini_configured && <span className="text-emerald-400 font-semibold">(Configured ✓)</span>}</label>
                <input
                  type="password"
                  placeholder={settings.gemini_configured ? "••••••••••••••••••••••••" : "Paste your Google Gemini API Key here"}
                  value={geminiApiKey}
                  onChange={e => setGeminiApiKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Model Identifier</label>
                <input
                  type="text"
                  value={settings.gemini_model}
                  onChange={e => setSettings(prev => ({ ...prev, gemini_model: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* Ollama Config */}
          {settings.active_ai_mode === 'ollama' && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">Ollama Configuration</span>
                <span className={`text-[10px] font-semibold ${ollamaOk ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {ollamaOk ? '● Connected' : '○ Not connected — start Ollama first'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300">Quick setup:</div>
                <div>1. Install Ollama: <span className="text-emerald-300 font-mono">ollama.com/download</span></div>
                <div>2. Pull model: <span className="text-emerald-300 font-mono">ollama pull qwen2.5:7b</span></div>
                <div>3. Ollama auto-starts and serves at localhost:11434</div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Base URL</label>
                <input
                  type="text"
                  value={settings.ollama_base_url}
                  onChange={e => setSettings(prev => ({ ...prev, ollama_base_url: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Model Name <span className="text-slate-600">(recommended: qwen2.5:7b)</span></label>
                <input
                  type="text"
                  value={settings.ollama_model}
                  onChange={e => setSettings(prev => ({ ...prev, ollama_model: e.target.value }))}
                  placeholder="e.g., qwen2.5:7b, llama3.2:3b, mistral:7b"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                {providerStatus?.providers?.ollama?.available_models?.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {providerStatus.providers.ollama.available_models.slice(0, 5).map((m: string) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSettings(prev => ({ ...prev, ollama_model: m }))}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 font-mono"
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Speech & Audio Settings */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-indigo-400" />
              Speech & Timer Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Speech Recognition Language</label>
                <select
                  value={speechLang}
                  onChange={e => setSpeechLang(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                >
                  <option value="en-US">English (United States)</option>
                  <option value="en-IN">English (India)</option>
                  <option value="en-GB">English (United Kingdom)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Default Prep Time</label>
                <select
                  value={defaultPrep}
                  onChange={e => setDefaultPrep(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                >
                  <option value="15">15 Seconds</option>
                  <option value="30">30 Seconds (Default)</option>
                  <option value="60">60 Seconds</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Default Speaking Duration</label>
                <select
                  value={defaultSpeaking}
                  onChange={e => setDefaultSpeaking(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                >
                  <option value="60">1 Minute (60s)</option>
                  <option value="120">2 Minutes (120s)</option>
                  <option value="180">3 Minutes (180s)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Save */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
