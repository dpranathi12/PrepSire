import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Trophy, 
  User, 
  LayoutDashboard, 
  Mic, 
  Video, 
  Timer, 
  Code, 
  CalendarCheck, 
  TrendingUp, 
  Bot, 
  Award,
  Zap,
  Settings,
  FileText,
  Target,
  LogIn,
  LogOut
} from 'lucide-react';
import { UserProfile, GamificationState, AuthUser } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: UserProfile;
  gamification: GamificationState;
  currentUser: AuthUser | null;
  onOpenAuth: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  gamification,
  currentUser,
  onOpenAuth,
  onOpenSettings,
  onLogout
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'mock-interview', label: 'Mock Interview', icon: Video },
    { id: 'communication', label: 'Communication', icon: Mic },
    { id: 'jam', label: 'JAM (1 Min)', icon: Timer },
    { id: 'technical', label: 'Technical', icon: Code },
    { id: 'learning-plan', label: '30-Day Plan', icon: CalendarCheck },
    { id: 'reports', label: 'Reports & Compare', icon: FileText },
    { id: 'careerfit', label: 'CareerFit AI', icon: Target },
    { id: 'daily-assignments', label: 'Daily Challenges', icon: Zap },
    { id: 'confidence', label: 'Confidence', icon: Award },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'career-coach', label: 'AI Coach', icon: Bot }
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/85 border-b border-slate-800/80 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <button 
            onClick={() => setActiveTab(profile.isOnboarded ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-all">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-extrabold text-xl tracking-tight text-white">
                PrepSpire<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">AI</span>
              </div>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Interview & Skill Coach</p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-inner' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Status, Badges & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold shadow-sm" title="Daily Practice Streak">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
              <span>{gamification.streak} d</span>
            </div>

            {/* XP & Level */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5 text-purple-400" />
              <span>Lvl {gamification.level}</span>
              <span className="text-slate-500">•</span>
              <span className="text-purple-400">{gamification.xp} XP</span>
            </div>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition"
              title="AI & Speech Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User Account / Auth Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                    activeTab === 'profile'
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 flex items-center justify-center font-bold text-[11px] text-white">
                    {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-medium max-w-[90px] truncate hidden md:inline">
                    {currentUser.full_name.split(' ')[0]}
                  </span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

          </div>

        </div>

        {/* Mobile / Tablet Sub-Navigation Scrollable Bar */}
        <div className="xl:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow' 
                    : 'bg-slate-800/60 text-slate-300'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
