import React, { useState } from 'react';
import { useAppState } from './hooks/useAppState';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { LandingPage } from './components/LandingPage';
import { OnboardingProfile } from './components/OnboardingProfile';
import { SkillAssessment } from './components/SkillAssessment';
import { PersonalDashboard } from './components/PersonalDashboard';
import { MockInterview } from './components/MockInterview';
import { CommunicationPractice } from './components/CommunicationPractice';
import { JamPractice } from './components/JamPractice';
import { TechnicalPractice } from './components/TechnicalPractice';
import { LearningPlan } from './components/LearningPlan';
import { DailyAssignments } from './components/DailyAssignments';
import { ConfidenceBuilder } from './components/ConfidenceBuilder';
import { CareerCoach } from './components/CareerCoach';
import { ProgressDashboard } from './components/ProgressDashboard';
import { PerformanceReports } from './components/PerformanceReports';
import { InterviewReportModal } from './components/InterviewReportModal';
import { CareerFit } from './components/CareerFit';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { MockInterviewSession } from './types';

export function App() {
  const {
    currentUser,
    login,
    register,
    logout,
    authError,
    isLoading,
    profile,
    updateProfile,
    scores,
    gamification,
    interviewHistory,
    jamHistory,
    learningPlan,
    dailyAssignments,
    chatMessages,
    activeTab,
    setActiveTab,
    addXp,
    completeDiagnosticAssessment,
    saveMockInterviewSession,
    saveJamSession,
    toggleTaskCompleted,
    sendCoachMessage
  } = useAppState();

  const [activeReportModal, setActiveReportModal] = useState<MockInterviewSession | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [guestMode, setGuestMode] = useState<boolean>(false);

  // Show full-page Login when no user is logged in and not in guest mode
  if (!currentUser && !guestMode) {
    return (
      <LoginPage
        onLogin={login}
        onRegister={register}
        authError={authError}
        isLoading={isLoading}
        onSkipToLanding={() => {
          setGuestMode(true);
          setActiveTab('landing');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        gamification={gamification}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onLogout={() => {
          logout();
          setGuestMode(false);
        }}
      />

      {/* Main Content Router */}
      <main className="pb-16">
        
        {/* Landing Page */}
        {(activeTab === 'landing' || (!profile.isOnboarded && activeTab === 'landing')) && (
          <LandingPage
            onStartPracticing={() => setActiveTab(profile.isOnboarded ? 'dashboard' : 'profile')}
            onTakeAssessment={() => setActiveTab('assessment')}
          />
        )}

        {/* Profile / Onboarding */}
        {activeTab === 'profile' && (
          <OnboardingProfile
            profile={profile}
            onSaveProfile={updateProfile}
            onComplete={() => setActiveTab('assessment')}
          />
        )}

        {/* AI Skill Assessment */}
        {activeTab === 'assessment' && (
          <SkillAssessment
            currentScores={scores}
            onCompleteAssessment={completeDiagnosticAssessment}
            onGoToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {/* Personal Dashboard */}
        {activeTab === 'dashboard' && (
          <PersonalDashboard
            profile={profile}
            scores={scores}
            gamification={gamification}
            learningPlan={learningPlan}
            dailyAssignments={dailyAssignments}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {/* AI Mock Interview Simulator */}
        {activeTab === 'mock-interview' && (
          <MockInterview
            profile={profile}
            onSaveSession={saveMockInterviewSession}
            onViewReport={(session) => setActiveReportModal(session)}
          />
        )}

        {/* Communication Skills Test */}
        {activeTab === 'communication' && (
          <CommunicationPractice />
        )}

        {/* JAM Practice */}
        {activeTab === 'jam' && (
          <JamPractice
            onSaveJam={saveJamSession}
          />
        )}

        {/* Technical Practice Suite */}
        {activeTab === 'technical' && (
          <TechnicalPractice
            onAddXp={addXp}
          />
        )}

        {/* 30-Day Personalized Learning Plan */}
        {activeTab === 'learning-plan' && (
          <LearningPlan
            profile={profile}
            plan={learningPlan}
            onToggleCompleted={toggleTaskCompleted}
          />
        )}

        {/* Performance Reports & Session Comparison */}
        {activeTab === 'reports' && (
          <PerformanceReports />
        )}

        {/* Daily Challenges */}
        {activeTab === 'daily-assignments' && (
          <DailyAssignments
            assignments={dailyAssignments}
            onAddXp={addXp}
          />
        )}

        {/* Confidence Builder */}
        {activeTab === 'confidence' && (
          <ConfidenceBuilder />
        )}

        {/* Progress & Analytics Dashboard */}
        {activeTab === 'progress' && (
          <ProgressDashboard
            scores={scores}
            gamification={gamification}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {/* AI Career Coach */}
        {activeTab === 'career-coach' && (
          <CareerCoach
            profile={profile}
            scores={scores}
            messages={chatMessages}
            onSendMessage={sendCoachMessage}
          />
        )}

        {/* CareerFit AI – Resume & Job Description Matcher */}
        {activeTab === 'careerfit' && (
          <CareerFit
            currentUser={currentUser}
            profile={profile}
          />
        )}

      </main>

      {/* Modal for Past / Active Interview Reports */}
      {activeReportModal && (
        <InterviewReportModal
          session={activeReportModal}
          onClose={() => setActiveReportModal(null)}
        />
      )}

      {/* Authentication Modal (still available for guest users clicking Sign In) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={login}
        onRegister={register}
        authError={authError}
        isLoading={isLoading}
      />

      {/* Platform & AI Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

    </div>
  );
}

export default App;
