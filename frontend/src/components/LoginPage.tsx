import React, { useState } from 'react';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Zap,
  Shield,
  BookOpen,
  Mic,
  Code,
  TrendingUp
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, pass: string) => Promise<boolean>;
  onRegister: (name: string, email: string, pass: string) => Promise<boolean>;
  authError: string | null;
  isLoading: boolean;
  onSkipToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onRegister,
  authError,
  isLoading,
  onSkipToLanding
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    if (mode === 'register' && fullName.trim().length < 2) {
      setLocalError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'login') {
      await onLogin(trimmedEmail, password);
    } else {
      await onRegister(fullName.trim(), trimmedEmail, password);
    }
  };

  const displayError = localError || authError;

  const features = [
    { icon: Mic, text: 'Practice speaking & communication skills', color: 'text-pink-400' },
    { icon: Code, text: 'Solve coding challenges with instant feedback', color: 'text-blue-400' },
    { icon: TrendingUp, text: 'Track your progress with detailed reports', color: 'text-emerald-400' },
    { icon: BookOpen, text: 'Get a personalized 30-day study plan', color: 'text-amber-400' },
    { icon: Shield, text: 'AI-powered mock interviews & coaching', color: 'text-purple-400' },
    { icon: Zap, text: 'Daily challenges to build confidence', color: 'text-cyan-400' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Animated Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-pink-600/15 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* LEFT: Branding & Features */}
        <div className="hidden lg:flex flex-col gap-8 px-4">

          {/* Logo & Tagline */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-xl shadow-indigo-500/30">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  PrepSpire<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">AI</span>
                </h1>
                <p className="text-xs text-slate-400 font-medium tracking-wide">Interview & Skill Coach</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white leading-snug mt-6">
              Prepare Smarter.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
                Speak Better.
              </span><br />
              Get Interview Ready.
            </h2>

            <p className="text-slate-400 text-sm mt-4 leading-relaxed max-w-md">
              Your AI-powered interview buddy that helps you practice, improve, and feel confident — one step at a time. 🚀
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-3">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 hover:border-slate-700 transition-all group">
                  <Icon className={`w-5 h-5 ${feat.color} shrink-0 group-hover:scale-110 transition-transform`} />
                  <span className="text-sm text-slate-300">{feat.text}</span>
                </div>
              );
            })}
          </div>

          {/* Trust Badge */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>20,000+ Questions</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Your Data, Saved</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Login / Register Form Card */}
        <div className="w-full max-w-md mx-auto">
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl p-6 sm:p-8 space-y-6">

            {/* Mobile Logo (visible only on small screens) */}
            <div className="lg:hidden text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-white">
                PrepSpire<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">AI</span>
              </h1>
              <p className="text-xs text-slate-400">Prepare Smarter. Speak Better. Get Interview Ready.</p>
            </div>

            {/* Heading */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-extrabold text-white">
                {mode === 'login' ? 'Welcome Back! 👋' : 'Join PrepSpire AI 🚀'}
              </h2>
              <p className="text-xs text-slate-400">
                {mode === 'login'
                  ? 'Sign in to continue your prep journey.'
                  : 'Create your account — it takes just 30 seconds!'}
              </p>
            </div>

            {/* Tab Toggle */}
            <div className="flex p-1 rounded-xl bg-slate-950/60 border border-slate-800">
              <button
                type="button"
                onClick={() => { setMode('login'); setLocalError(null); }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setLocalError(null); }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Message */}
            {displayError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2">
                <span>⚠️</span>
                <span>{displayError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {mode === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Please wait...</span>
                  </span>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In' : 'Create My Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Guest / Skip option */}
            <button
              onClick={onSkipToLanding}
              className="w-full py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-semibold transition-all"
            >
              Continue as Guest (limited features)
            </button>

            {/* Bottom switch */}
            <p className="text-center text-xs text-slate-500">
              {mode === 'login' ? (
                <>Don't have an account?{' '}
                  <button onClick={() => { setMode('register'); setLocalError(null); }} className="text-indigo-400 hover:text-indigo-300 font-semibold transition">
                    Sign up free
                  </button>
                </>
              ) : (
                <>Already have an account?{' '}
                  <button onClick={() => { setMode('login'); setLocalError(null); }} className="text-indigo-400 hover:text-indigo-300 font-semibold transition">
                    Sign in
                  </button>
                </>
              )}
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};
