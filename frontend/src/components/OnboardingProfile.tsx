import React, { useState } from 'react';
import { UserProfile, ExperienceLevel, TargetRole } from '../types';
import { User, GraduationCap, Briefcase, Code2, Target, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface OnboardingProfileProps {
  profile: UserProfile;
  onSaveProfile: (updated: Partial<UserProfile>) => void;
  onComplete: () => void;
}

const ROLES: TargetRole[] = [
  'Software Developer',
  'Data Analyst',
  'HR Specialist',
  'Marketing Executive',
  'Product Manager',
  'DevOps Engineer',
  'Full Stack Developer'
];

const SKILL_OPTIONS = [
  'Python', 'Java', 'C/C++', 'JavaScript', 'React', 'Node.js', 
  'SQL', 'Data Structures', 'Algorithms', 'DBMS', 'Operating Systems', 
  'Machine Learning', 'Communication', 'Public Speaking', 'Git'
];

export const OnboardingProfile: React.FC<OnboardingProfileProps> = ({
  profile,
  onSaveProfile,
  onComplete
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);

  const toggleKnownSkill = (skill: string) => {
    setFormData(prev => {
      const exists = prev.knownSkills.includes(skill);
      const knownSkills = exists 
        ? prev.knownSkills.filter(s => s !== skill)
        : [...prev.knownSkills, skill];
      return { ...prev, knownSkills };
    });
  };

  const toggleTargetSkill = (skill: string) => {
    setFormData(prev => {
      const exists = prev.targetSkills.includes(skill);
      const targetSkills = exists 
        ? prev.targetSkills.filter(s => s !== skill)
        : [...prev.targetSkills, skill];
      return { ...prev, targetSkills };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onComplete();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Configure Your Candidate Profile
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            PrepSpire AI customizes questions, mock interviews, and learning plans specifically for your target role and skill gaps.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                Education / Degree
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={formData.education}
                  onChange={e => setFormData({ ...formData, education: e.target.value })}
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                Branch / Specialization
              </label>
              <input
                type="text"
                required
                value={formData.branch}
                onChange={e => setFormData({ ...formData, branch: e.target.value })}
                placeholder="e.g. CSE / IT / ECE"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                Experience Level
              </label>
              <select
                value={formData.experienceLevel}
                onChange={e => setFormData({ ...formData, experienceLevel: e.target.value as ExperienceLevel })}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              >
                <option value="Beginner">Beginner (Fresher / Student)</option>
                <option value="Intermediate">Intermediate (1-2 Years / Intern)</option>
                <option value="Advanced">Advanced (Experienced Job Seeker)</option>
              </select>
            </div>
          </div>

          {/* Target Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
              Select Your Target Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {ROLES.map(role => {
                const isSelected = formData.targetRole === role;
                return (
                  <button
                    type="button"
                    key={role}
                    onClick={() => setFormData({ ...formData, targetRole: role })}
                    className={`p-3 rounded-xl text-xs font-medium border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{role}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Known Skills */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
              Skills You Currently Know
            </label>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map(skill => {
                const isKnown = formData.knownSkills.includes(skill);
                return (
                  <button
                    type="button"
                    key={`known-${skill}`}
                    onClick={() => toggleKnownSkill(skill)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isKnown
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isKnown ? '✓ ' : '+ '}{skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skills to Improve */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
              Skills You Want to Improve Most
            </label>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map(skill => {
                const isTarget = formData.targetSkills.includes(skill);
                return (
                  <button
                    type="button"
                    key={`target-${skill}`}
                    onClick={() => toggleTargetSkill(skill)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isTarget
                        ? 'bg-pink-500/20 border-pink-500/50 text-pink-300'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isTarget ? '🎯 ' : '+ '}{skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-base shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Save & Launch Personal Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
