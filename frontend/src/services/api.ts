import {
  AuthUser,
  UserProfile,
  SkillScores,
  MockInterviewSession,
  JamSession,
  CommunicationPrompt,
  CommunicationSession,
  TechnicalQuestion,
  DailyTask,
  ReportSummaryItem,
  SessionComparisonResult,
  AISettings
} from '../types';

// Determine API Base:
// 1. If VITE_API_URL is configured (e.g. separate cloud backend domain), use it
// 2. If running behind Nginx / reverse proxy or Vite dev server, use relative '/api/v1'
// 3. Fallback to direct localhost port 8000 for direct file serving
const rawBase = (import.meta as any).env?.VITE_API_URL;
const API_BASE = rawBase 
  ? (rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase) + '/api/v1'
  : (typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '80' || !window.location.port))
    ? '/api/v1'
    : 'http://127.0.0.1:8000/api/v1';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('prepspire_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('prepspire_token', token);
    } else {
      localStorage.removeItem('prepspire_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {})
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData) {
            if (typeof errorData.detail === 'string') {
              errorMessage = errorData.detail;
            } else if (Array.isArray(errorData.detail)) {
              errorMessage = errorData.detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
            } else if (typeof errorData.message === 'string') {
              errorMessage = errorData.message;
            }
          }
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (err: any) {
      if (err.name === 'TypeError' && String(err.message).toLowerCase().includes('fetch')) {
        throw new Error('Cannot connect to PrepSpire backend server. Please verify backend is running on port 8000.');
      }
      console.warn(`API call error on ${endpoint}:`, err.message);
      throw err;
    }
  }

  // Auth
  async register(data: { email: string; full_name: string; password: string }): Promise<{ access_token: string; user_id: string; email: string; full_name: string }> {
    const res = await this.request<{ access_token: string; user_id: string; email: string; full_name: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    this.setToken(res.access_token);
    return res;
  }

  async login(data: { email: string; password: string }): Promise<{ access_token: string; user_id: string; email: string; full_name: string }> {
    const res = await this.request<{ access_token: string; user_id: string; email: string; full_name: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    this.setToken(res.access_token);
    return res;
  }

  async getMe(): Promise<any> {
    return this.request('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // Profile
  async getProfile(): Promise<any> {
    return this.request('/profile');
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<any> {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile)
    });
  }

  async submitDiagnosticAssessment(answers: Record<string, any>): Promise<any> {
    return this.request('/profile/diagnostic-assessment', {
      method: 'POST',
      body: JSON.stringify(answers)
    });
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<any> {
    return this.request('/dashboard/stats');
  }

  // Questions Bank
  async searchQuestions(params: { role?: string; category?: string; query?: string; limit?: number }): Promise<any[]> {
    const qs = new URLSearchParams();
    if (params.role) qs.append('role', params.role);
    if (params.category) qs.append('category', params.category);
    if (params.query) qs.append('query', params.query);
    if (params.limit) qs.append('limit', String(params.limit));
    return this.request(`/questions/search?${qs.toString()}`);
  }

  // Mock Interviews
  async createInterview(data: { role: string; interview_type: string; difficulty: string; total_questions: number; ai_provider?: string }): Promise<any> {
    return this.request('/interviews', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getInterviews(): Promise<any[]> {
    return this.request('/interviews');
  }

  async getInterviewDetail(sessionId: string): Promise<any> {
    return this.request(`/interviews/${sessionId}`);
  }

  async submitInterviewAnswer(sessionId: string, data: { interview_question_id: string; user_answer: string; answer_method: string; duration_seconds: number }): Promise<any> {
    return this.request(`/interviews/${sessionId}/answer`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async finishInterview(sessionId: string): Promise<any> {
    return this.request(`/interviews/${sessionId}/finish`, {
      method: 'POST'
    });
  }

  // Communication Practice
  async getCommunicationPrompts(category?: string, difficulty?: string, excludeId?: string): Promise<CommunicationPrompt[]> {
    const qs = new URLSearchParams();
    if (category) qs.append('category', category);
    if (difficulty) qs.append('difficulty', difficulty);
    if (excludeId) qs.append('exclude_id', excludeId);
    return this.request(`/communication/prompts?${qs.toString()}`);
  }

  async getRandomCommunicationPrompt(category?: string, difficulty?: string, excludeId?: string): Promise<CommunicationPrompt> {
    const qs = new URLSearchParams();
    if (category) qs.append('category', category);
    if (difficulty) qs.append('difficulty', difficulty);
    if (excludeId) qs.append('exclude_id', excludeId);
    return this.request(`/communication/random-prompt?${qs.toString()}`);
  }

  async submitCommunicationSession(data: { prompt_id?: string; category: string; prompt_text: string; prep_time_seconds: number; response_duration_seconds: number; actual_duration_seconds: number; response_text: string; response_method: string }): Promise<any> {
    return this.request('/communication/sessions', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getCommunicationSessions(): Promise<any[]> {
    return this.request('/communication/sessions');
  }

  // JAM (Just-A-Minute)
  async getJamTopic(category?: string, allowRetryId?: string, excludeId?: string): Promise<any> {
    const qs = new URLSearchParams();
    if (category) qs.append('category', category);
    if (allowRetryId) qs.append('allow_retry_id', allowRetryId);
    if (excludeId) qs.append('exclude_id', excludeId);
    return this.request(`/jam/topic?${qs.toString()}`);
  }

  async submitJamSession(data: { topic_id?: string; topic_text: string; category: string; prep_duration_seconds: number; speaking_duration_seconds: number; actual_duration_seconds: number; transcript: string; response_method: string }): Promise<any> {
    return this.request('/jam/sessions', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getJamSessions(): Promise<any[]> {
    return this.request('/jam/sessions');
  }

  // Academic Preparation
  async getAcademicSubjects(): Promise<string[]> {
    return this.request('/academic/subjects');
  }

  async getAcademicQuestions(subject?: string, difficulty?: string, limit: number = 10): Promise<any[]> {
    const qs = new URLSearchParams();
    if (subject) qs.append('subject', subject);
    if (difficulty) qs.append('difficulty', difficulty);
    qs.append('limit', String(limit));
    return this.request(`/academic/questions?${qs.toString()}`);
  }

  async submitAcademicQuiz(data: { subject: string; topic?: string; answers: { question_id: string; user_answer: string }[]; time_taken_seconds: number }): Promise<any> {
    return this.request('/academic/quiz', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getQuizAttempts(): Promise<any[]> {
    return this.request('/academic/attempts');
  }

  // Coding Practice
  async getCodingChallenges(): Promise<any[]> {
    return this.request('/coding/challenges');
  }

  async getCodingChallengeBySlug(slug: string): Promise<any> {
    return this.request(`/coding/challenges/${slug}`);
  }

  async runCode(data: { challenge_id: string; language: string; code: string }): Promise<any> {
    return this.request('/coding/run', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async submitCode(data: { challenge_id: string; language: string; code: string }): Promise<any> {
    return this.request('/coding/submit', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getCodingSubmissions(): Promise<any[]> {
    return this.request('/coding/submissions');
  }

  // 30-Day Learning Plan
  async getLearningPlan(): Promise<any> {
    return this.request('/learning-plan');
  }

  async generateLearningPlan(data: { target_role?: string; daily_prep_time_minutes?: number; regenerate?: boolean }): Promise<any> {
    return this.request('/learning-plan/generate', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async togglePlanTask(taskId: string): Promise<any> {
    return this.request(`/learning-plan/tasks/${taskId}/toggle`, {
      method: 'PUT'
    });
  }

  // Performance Reports & Session Comparison
  async getReports(): Promise<ReportSummaryItem[]> {
    return this.request('/reports');
  }

  async getReportDetail(sessionType: string, sessionId: string): Promise<any> {
    return this.request(`/reports/${sessionType}/${sessionId}`);
  }

  async compareSessions(data: { session_id_1: string; session_id_2: string; session_type: string }): Promise<SessionComparisonResult> {
    return this.request('/reports/compare', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  getExportCsvUrl(sessionType: string, sessionId: string): string {
    return `${API_BASE}/reports/${sessionType}/${sessionId}/export-csv`;
  }

  // Career Coach
  async sendCoachMessage(
    message: string, 
    history?: { sender: string; text: string }[], 
    aiMode?: string
  ): Promise<{ reply: string; mode: string }> {
    return this.request('/coach/message', {
      method: 'POST',
      body: JSON.stringify({ message, history, ai_mode: aiMode })
    });
  }

  async getProviderStatus(): Promise<any> {
    return this.request('/coach/providers/status');
  }

  // Settings
  async getSettings(): Promise<AISettings> {
    return this.request('/settings');
  }

  async updateSettings(data: Partial<AISettings> & { gemini_api_key?: string }): Promise<AISettings> {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // CareerFit AI – Resume & Job Description Matcher
  async analyzeCareerFit(formData: FormData): Promise<any> {
    return this.request('/careerfit/analyze', {
      method: 'POST',
      body: formData
    });
  }

  async getCareerFitHistory(): Promise<any[]> {
    return this.request('/careerfit/history');
  }

  async getCareerFitDetail(analysisId: number): Promise<any> {
    return this.request(`/careerfit/history/${analysisId}`);
  }

  getCareerFitReportUrl(analysisId: number): string {
    return `${API_BASE}/careerfit/report/${analysisId}`;
  }

  async deleteCareerFitAnalysis(analysisId: number): Promise<any> {
    return this.request(`/careerfit/history/${analysisId}`, {
      method: 'DELETE'
    });
  }
}

export const api = new ApiService();
