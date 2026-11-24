import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Upload, CheckCircle2, AlertTriangle, ArrowRight, Download, 
  Sparkles, RefreshCw, Trash2, Calendar, Target, Award, BrainCircuit,
  FileCheck, ShieldAlert, BookOpen, Layers, Check, Copy, ExternalLink,
  ChevronRight, ChevronDown, ListOrdered, Briefcase, Zap, Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { AuthUser, UserProfile } from '../types';

interface CareerFitProps {
  currentUser: AuthUser | null;
  profile: UserProfile;
}

export const CareerFit: React.FC<CareerFitProps> = ({ currentUser, profile }) => {
  // Input State
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeTextInput, setResumeTextInput] = useState('');
  const [resumeInputMode, setResumeInputMode] = useState<'upload' | 'paste'>('upload');

  const [jobDescOption, setJobDescOption] = useState<'paste' | 'pdf' | 'doc'>('paste');
  const [jobDescTextInput, setJobDescTextInput] = useState('');
  const [jobDescFile, setJobDescFile] = useState<File | null>(null);

  // Status & Progress State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgressStep, setAnalysisProgressStep] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Analysis Result State
  const [currentResult, setCurrentResult] = useState<any | null>(null);
  const [roadmapView, setRoadmapView] = useState<'7day' | '30day'>('7day');
  const [activeTabSection, setActiveTabSection] = useState<'skills' | 'roadmap' | 'suggestions'>('skills');

  // History State
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // File Drop Refs
  const resumeDropRef = useRef<HTMLDivElement>(null);
  const jdDropRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, [currentUser]);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const list = await api.getCareerFitHistory();
      if (Array.isArray(list)) {
        setHistoryList(list);
      }
    } catch (e) {
      console.warn('Could not load history:', e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleResumeDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleJdDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetJdFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetResumeFile = (file: File) => {
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!['.pdf', '.docx', '.doc'].includes(ext)) {
      setErrorMessage('Unsupported format! Please upload a PDF (.pdf) or Word document (.docx, .doc).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('Resume file size exceeds maximum limit of 15MB.');
      return;
    }
    setErrorMessage(null);
    setResumeFile(file);
  };

  const validateAndSetJdFile = (file: File) => {
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (jobDescOption === 'pdf' && ext !== '.pdf') {
      setErrorMessage('Please upload a PDF document for Job Description.');
      return;
    }
    if (jobDescOption === 'doc' && !['.docx', '.doc'].includes(ext)) {
      setErrorMessage('Please upload a Word document (.docx or .doc) for Job Description.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('Job Description file size exceeds limit of 15MB.');
      return;
    }
    setErrorMessage(null);
    setJobDescFile(file);
  };

  const handleAnalyze = async () => {
    setErrorMessage(null);

    // Validation
    if (resumeInputMode === 'upload' && !resumeFile) {
      setErrorMessage('Please upload your resume file (.pdf, .docx, or .doc).');
      return;
    }
    if (resumeInputMode === 'paste' && !resumeTextInput.trim()) {
      setErrorMessage('Please paste your resume content in the text area.');
      return;
    }

    if (jobDescOption === 'paste' && !jobDescTextInput.trim()) {
      setErrorMessage('Please paste the target job description text.');
      return;
    }
    if ((jobDescOption === 'pdf' || jobDescOption === 'doc') && !jobDescFile) {
      setErrorMessage(`Please upload the Job Description ${jobDescOption.toUpperCase()} file.`);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgressStep('Reading and extracting document content...');

    try {
      const formData = new FormData();

      if (resumeInputMode === 'upload' && resumeFile) {
        formData.append('resume_file', resumeFile);
      } else {
        formData.append('resume_text_input', resumeTextInput);
      }

      formData.append('job_desc_option', jobDescOption);
      if (jobDescOption === 'paste') {
        formData.append('job_desc_text_input', jobDescTextInput);
      } else if (jobDescFile) {
        formData.append('job_desc_file', jobDescFile);
      }

      setTimeout(() => setAnalysisProgressStep('Identifying required technical & soft skills...'), 600);
      setTimeout(() => setAnalysisProgressStep('Running semantic qualification matching...'), 1400);
      setTimeout(() => setAnalysisProgressStep('Generating personalized learning roadmaps & suggestions...'), 2200);

      const result = await api.analyzeCareerFit(formData);
      setCurrentResult(result);

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });

      // Reload history
      loadHistory();

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);

    } catch (err: any) {
      setErrorMessage(err.message || 'Analysis failed. Please check your document and try again.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgressStep('');
    }
  };

  const handleSelectHistoryItem = async (analysisId: number) => {
    try {
      const detail = await api.getCareerFitDetail(analysisId);
      setCurrentResult(detail);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } catch (e: any) {
      setErrorMessage(e.message || 'Could not load analysis details.');
    }
  };

  const handleDeleteHistoryItem = async (analysisId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this analysis from your history?')) return;
    try {
      await api.deleteCareerFitAnalysis(analysisId);
      setHistoryList(prev => prev.filter(item => item.id !== analysisId));
      if (currentResult?.id === analysisId) {
        setCurrentResult(null);
      }
    } catch (e: any) {
      alert(e.message || 'Could not delete record.');
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered Semantic Matcher
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          CareerFit <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">AI</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Upload your resume and match it against any job description. Uncover matching skills, identify missing keywords, evaluate ATS readiness, and generate an actionable learning roadmap.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button 
            onClick={() => setErrorMessage(null)} 
            className="text-xs font-bold text-rose-400 hover:text-rose-200 uppercase tracking-wide cursor-pointer ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Input Section Grid (Resume on Left, Job Description on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ================= 1. RESUME UPLOAD ================= */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>1. Candidate Resume</span>
              </div>
              <div className="flex items-center rounded-lg bg-slate-800 p-1 border border-slate-700/60 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setResumeInputMode('upload')}
                  className={`px-3 py-1 rounded-md transition-all ${resumeInputMode === 'upload' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setResumeInputMode('paste')}
                  className={`px-3 py-1 rounded-md transition-all ${resumeInputMode === 'paste' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Paste Text
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Supports PDF (.pdf), Word (.docx, .doc) with OCR fallback. Max 15MB.
            </p>
          </div>

          {resumeInputMode === 'upload' ? (
            <div>
              {resumeFile ? (
                <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-semibold text-white truncate">{resumeFile.name}</p>
                      <p className="text-xs text-slate-400">{(resumeFile.size / 1024).toFixed(1)} KB &bull; Ready for match</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-all">
                      Replace
                      <input 
                        type="file" 
                        accept=".pdf,.docx,.doc" 
                        className="hidden" 
                        onChange={(e) => e.target.files?.[0] && validateAndSetResumeFile(e.target.files[0])}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  ref={resumeDropRef}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleResumeDrop}
                  className="p-8 border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-2xl bg-slate-950/40 text-center space-y-3 transition-all cursor-pointer group"
                  onClick={() => {
                    const input = document.getElementById('resume-file-input') as HTMLInputElement;
                    input?.click();
                  }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-600/20 flex items-center justify-center mx-auto transition-all">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition-all">
                      Click to upload or drag & drop resume
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      PDF, DOCX, or DOC (up to 15MB)
                    </p>
                  </div>
                  <input
                    id="resume-file-input"
                    type="file"
                    accept=".pdf,.docx,.doc"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && validateAndSetResumeFile(e.target.files[0])}
                  />
                </div>
              )}
            </div>
          ) : (
            <textarea
              rows={8}
              value={resumeTextInput}
              onChange={(e) => setResumeTextInput(e.target.value)}
              placeholder="Paste your complete resume text here (education, technical skills, projects, certifications, work experience)..."
              className="w-full p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-200 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none transition-all resize-none font-mono"
            />
          )}

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Documents are processed in memory and encrypted for your account only.</span>
          </div>
        </div>

        {/* ================= 2. JOB DESCRIPTION INPUT ================= */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Briefcase className="w-5 h-5 text-purple-400" />
                <span>2. Job Description (3 Options)</span>
              </div>
              <div className="flex items-center rounded-lg bg-slate-800 p-1 border border-slate-700/60 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => { setJobDescOption('paste'); setJobDescFile(null); }}
                  className={`px-2.5 py-1 rounded-md transition-all ${jobDescOption === 'paste' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Paste Text
                </button>
                <button
                  type="button"
                  onClick={() => { setJobDescOption('pdf'); setJobDescFile(null); }}
                  className={`px-2.5 py-1 rounded-md transition-all ${jobDescOption === 'pdf' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Upload PDF
                </button>
                <button
                  type="button"
                  onClick={() => { setJobDescOption('doc'); setJobDescFile(null); }}
                  className={`px-2.5 py-1 rounded-md transition-all ${jobDescOption === 'doc' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Word Doc
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Provide the job requirements via paste, multi-page PDF, or Word document.
            </p>
          </div>

          {jobDescOption === 'paste' && (
            <div className="space-y-2">
              <textarea
                rows={8}
                value={jobDescTextInput}
                onChange={(e) => setJobDescTextInput(e.target.value)}
                placeholder="Paste the complete job description text here (role title, required skills, responsibilities, minimum qualifications)..."
                className="w-full p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-200 text-xs sm:text-sm focus:border-purple-500 focus:outline-none transition-all resize-none font-sans"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{jobDescTextInput.length} characters</span>
                <button
                  type="button"
                  onClick={() => setJobDescTextInput(
                    "Job Title: Java Full Stack Developer\n\nRequirements:\n- 0 to 2 years experience with Java, Spring Boot, and RESTful APIs.\n- Strong foundation in Object-Oriented Programming (OOP) and Data Structures & Algorithms.\n- Knowledge of SQL databases (PostgreSQL or MySQL) and basic indexing concepts.\n- Experience with React, JavaScript, HTML5, and CSS3.\n- Familiarity with Git version control, Docker containers, and CI/CD pipelines.\n- Good communication, problem-solving, and teamwork abilities."
                  )}
                  className="text-purple-400 hover:text-purple-300 font-medium cursor-pointer"
                >
                  + Insert Sample Job Description
                </button>
              </div>
            </div>
          )}

          {(jobDescOption === 'pdf' || jobDescOption === 'doc') && (
            <div>
              {jobDescFile ? (
                <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-semibold text-white truncate">{jobDescFile.name}</p>
                      <p className="text-xs text-slate-400">{(jobDescFile.size / 1024).toFixed(1)} KB &bull; Ready for match</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-all">
                      Replace
                      <input 
                        type="file" 
                        accept={jobDescOption === 'pdf' ? '.pdf' : '.docx,.doc'} 
                        className="hidden" 
                        onChange={(e) => e.target.files?.[0] && validateAndSetJdFile(e.target.files[0])}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setJobDescFile(null)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  ref={jdDropRef}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleJdDrop}
                  className="p-8 border-2 border-dashed border-slate-700 hover:border-purple-500/60 rounded-2xl bg-slate-950/40 text-center space-y-3 transition-all cursor-pointer group"
                  onClick={() => {
                    const input = document.getElementById('jd-file-input') as HTMLInputElement;
                    input?.click();
                  }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-400 group-hover:text-purple-400 group-hover:bg-purple-600/20 flex items-center justify-center mx-auto transition-all">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200 group-hover:text-purple-300 transition-all">
                      Click to upload or drag & drop Job Description {jobDescOption.toUpperCase()}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {jobDescOption === 'pdf' ? 'Multi-page PDF supported' : 'Word (.docx or .doc) supported'}
                    </p>
                  </div>
                  <input
                    id="jd-file-input"
                    type="file"
                    accept={jobDescOption === 'pdf' ? '.pdf' : '.docx,.doc'}
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && validateAndSetJdFile(e.target.files[0])}
                  />
                </div>
              )}
            </div>
          )}

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Extracted using full text parsing & OCR. Feeds same AI semantic analysis.</span>
          </div>
        </div>

      </div>

      {/* ================= 3. ANALYZE ACTION BUTTON ================= */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className={`px-8 py-4 rounded-2xl font-bold text-base shadow-2xl transition-all cursor-pointer inline-flex items-center gap-3 ${
            isAnalyzing 
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700' 
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white shadow-indigo-500/25 hover:scale-105 active:scale-95'
          }`}
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
              <span>Analyzing Job Match...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Analyze My Job Match</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {isAnalyzing && (
          <div className="mt-4 max-w-md mx-auto space-y-2">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 animate-pulse rounded-full w-3/4"></div>
            </div>
            <p className="text-xs text-indigo-300 font-medium">{analysisProgressStep}</p>
          </div>
        )}
      </div>

      {/* ================= 4. RESULTS DASHBOARD ================= */}
      {currentResult && (
        <div ref={resultsRef} className="space-y-8 pt-6 border-t border-slate-800/80">
          
          {/* Header & Download Bar */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase">
                  Analysis Complete
                </span>
                <span className="text-xs text-slate-400">ID #{currentResult.id}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                Target Role: <span className="text-indigo-400">{currentResult.job_title}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Resume: <span className="text-slate-300 font-medium">{currentResult.resume_filename}</span> &bull; Evaluated using PrepSpire AI Semantic Engine
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={api.getCareerFitReportUrl(currentResult.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Report</span>
              </a>
            </div>
          </div>

          {/* Scores Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            
            {/* Overall Match Circle / Card */}
            <div className="md:col-span-2 p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* SVG Radial Gauge */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className={
                      currentResult.match_score >= 75 
                        ? 'stroke-emerald-500' 
                        : currentResult.match_score >= 50 
                        ? 'stroke-amber-500' 
                        : 'stroke-rose-500'
                    }
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - currentResult.match_score / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white">
                    {currentResult.match_score}%
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Match
                  </span>
                </div>
              </div>

              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  currentResult.match_score >= 75
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    : currentResult.match_score >= 50
                    ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                }`}>
                  {currentResult.match_score >= 75 ? 'Strong Match' : currentResult.match_score >= 50 ? 'Moderate Match' : 'Growth Potential'}
                </span>
                <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
                  {currentResult.score_explanation || 'Weighted composite score based on technical skills, projects, education, and soft skills.'}
                </p>
              </div>
            </div>

            {/* 4 Multi-Dimensional Metric Cards */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4 text-indigo-400" /> Technical Skills
                  </span>
                  <span className="text-white font-bold">{currentResult.technical_score}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${currentResult.technical_score}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-500">Weight: 40% &bull; Measures programming languages & framework overlap</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-400" /> Projects & Experience
                  </span>
                  <span className="text-white font-bold">{currentResult.experience_score}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${currentResult.experience_score}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-500">Weight: 30% &bull; Evaluates practical projects and internship relevance</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-teal-400" /> Education & Degree
                  </span>
                  <span className="text-white font-bold">{currentResult.education_score}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-teal-500 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${currentResult.education_score}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-500">Weight: 15% &bull; Degree and computer science coursework alignment</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-pink-400" /> Soft Skills
                  </span>
                  <span className="text-white font-bold">{currentResult.soft_skills_score}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-pink-500 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${currentResult.soft_skills_score}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-500">Weight: 15% &bull; Problem solving, teamwork, and communication attributes</p>
              </div>

            </div>
          </div>

          {/* Navigation Tabs (Skills Alignment, Learning Roadmap, Resume Improvement) */}
          <div className="flex items-center border-b border-slate-800 gap-4">
            <button
              onClick={() => setActiveTabSection('skills')}
              className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTabSection === 'skills'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Skill Breakdown ({currentResult.matching_skills?.length || 0} Matched, {currentResult.missing_skills?.length || 0} Missing)</span>
            </button>

            <button
              onClick={() => setActiveTabSection('roadmap')}
              className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTabSection === 'roadmap'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Personalized Learning Roadmap</span>
            </button>

            <button
              onClick={() => setActiveTabSection('suggestions')}
              className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTabSection === 'suggestions'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Resume & ATS Optimization</span>
            </button>
          </div>

          {/* TAB 1: SKILL BREAKDOWN */}
          {activeTabSection === 'skills' && (
            <div className="space-y-6">
              
              {/* Matching & Missing Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Matching Skills */}
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Matching Skills in Resume ({currentResult.matching_skills?.length || 0})</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(currentResult.matching_skills?.join(', ') || '', 'match')}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'match' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'match' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentResult.matching_skills?.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Check className="w-3 h-3 text-emerald-400" />
                        {skill}
                      </span>
                    ))}
                    {(!currentResult.matching_skills || currentResult.matching_skills.length === 0) && (
                      <p className="text-xs text-slate-500 italic">No clear matching skills identified from resume.</p>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                      <AlertTriangle className="w-5 h-5" />
                      <span>Missing Job Requirements ({currentResult.missing_skills?.length || 0})</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(currentResult.missing_skills?.join(', ') || '', 'miss')}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'miss' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'miss' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentResult.missing_skills?.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                        {skill}
                      </span>
                    ))}
                    {(!currentResult.missing_skills || currentResult.missing_skills.length === 0) && (
                      <p className="text-xs text-slate-500 italic">No major missing requirements detected.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Skills to Improve (Depth & Production Readiness) */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                  <Zap className="w-5 h-5" />
                  <span>Skills to Improve (Depth, Evidence & Production Expectation)</span>
                </div>
                <p className="text-xs text-slate-400">
                  These skills are present or implied in your profile, but require deeper practical evidence to satisfy the company's expectations:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {currentResult.improvement_skills?.map((item: any, idx: number) => (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/90 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                          {item.skill}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-semibold uppercase">
                          Action Required
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div>
                          <span className="text-slate-500 font-medium">Your Resume: </span>
                          <span className="text-slate-300">{item.current_demonstration}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium">Company Expectation: </span>
                          <span className="text-slate-300">{item.company_expectation}</span>
                        </div>
                        <div className="pt-1.5 border-t border-slate-800/60">
                          <span className="text-indigo-400 font-semibold">How to Bridge the Gap: </span>
                          <span className="text-slate-300 leading-relaxed">{item.how_to_improve}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PERSONALIZED LEARNING ROADMAP */}
          {activeTabSection === 'roadmap' && (
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    Personalized Skill Acquisition Plan
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tailored specifically for {currentResult.job_title} based on your identified gaps.
                  </p>
                </div>

                <div className="flex items-center rounded-xl bg-slate-800 p-1 border border-slate-700/60 text-xs font-semibold shrink-0">
                  <button
                    onClick={() => setRoadmapView('7day')}
                    className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                      roadmapView === '7day' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    7-Day Quick Sprint
                  </button>
                  <button
                    onClick={() => setRoadmapView('30day')}
                    className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                      roadmapView === '30day' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    30-Day Master Plan
                  </button>
                </div>
              </div>

              {/* 7-Day Sprint View */}
              {roadmapView === '7day' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-300 leading-relaxed">
                    💡 <b>7-Day Quick Improvement Plan:</b> High-intensity daily drills focusing on your highest priority missing skills. Complete 1 sprint daily (approx. 75 minutes) before applying.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentResult.roadmap_7_day?.map((day: any, idx: number) => (
                      <div key={idx} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-md bg-indigo-600/20 text-indigo-400 text-[11px] font-bold uppercase">
                              Day {day.day}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">~{day.estimated_minutes || 75} mins</span>
                          </div>
                          <h4 className="text-sm font-bold text-white">{day.title}</h4>
                          <p className="text-xs text-slate-400">Focus: <b className="text-indigo-300">{day.skill}</b></p>
                          <ul className="space-y-1.5 text-xs text-slate-300 pt-1">
                            {day.tasks?.map((t: string, tidx: number) => (
                              <li key={tidx} className="flex items-start gap-1.5">
                                <span className="text-indigo-400 font-bold">&bull;</span>
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {day.coding_exercise && (
                          <div className="pt-3 border-t border-slate-800/80 text-xs">
                            <span className="text-emerald-400 font-semibold">Coding Exercise: </span>
                            <span className="text-slate-300">{day.coding_exercise}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 30-Day Master Plan View */}
              {roadmapView === '30day' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-300 leading-relaxed">
                    🎯 <b>30-Day Detailed Learning Plan:</b> Structured four-week curriculum designed to take you from foundational understanding to production-grade deployment and technical interview readiness.
                  </div>

                  <div className="space-y-4">
                    {currentResult.roadmap_30_day?.map((week: any, idx: number) => (
                      <div key={idx} className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                          <h4 className="text-base font-bold text-white flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                            {week.title}
                          </h4>
                          <span className="text-xs text-purple-300 font-medium">
                            Focus: {week.focus_skills?.join(', ')}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="space-y-2">
                            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                              Core Technical Topics
                            </span>
                            <ul className="space-y-1.5 text-slate-300">
                              {week.topics?.map((topic: string, tidx: number) => (
                                <li key={tidx} className="flex items-start gap-2">
                                  <ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                                  <span>{topic}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                              Hands-On Practical Tasks & Projects
                            </span>
                            <ul className="space-y-1.5 text-slate-300">
                              {week.practical_tasks?.map((task: string, tidx: number) => (
                                <li key={tidx} className="flex items-start gap-2">
                                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: RESUME & ATS SUGGESTIONS */}
          {activeTabSection === 'suggestions' && (
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
              
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  Targeted Resume & ATS Optimization
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Actionable recommendations to enhance recruiter visibility and bypass Applicant Tracking Systems (ATS).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Missing Keywords Checklist */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Crucial ATS Keywords to Add
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    ATS filters scan for exact keyword occurrences. Integrate these into your skills list and project descriptions:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {currentResult.resume_suggestions?.missing_keywords?.map((kw: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills to Highlight */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Strongest Selling Points to Promote
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    These skills already in your profile strongly align with the JD. Put them prominently in your summary and top project bullets:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {currentResult.resume_suggestions?.skills_to_highlight?.map((sk: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                        &bull; {sk}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Project Description Rewrites */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> Project Bullet Point Rewriting Formula
                </h4>
                <div className="space-y-2 text-xs text-slate-300">
                  {currentResult.resume_suggestions?.project_improvements?.map((tip: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-start gap-2.5">
                      <span className="text-indigo-400 font-bold shrink-0">{idx + 1}.</span>
                      <span className="leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phrasing & Section Enhancements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <h5 className="font-bold text-white text-xs uppercase tracking-wider text-pink-400">
                    High-Impact Action Verbs & Phrasing
                  </h5>
                  <ul className="space-y-1.5 text-slate-300">
                    {currentResult.resume_suggestions?.professional_wording?.map((w: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <h5 className="font-bold text-white text-xs uppercase tracking-wider text-teal-400">
                    Sections Needing Structural Tuning
                  </h5>
                  <ul className="space-y-1.5 text-slate-300">
                    {currentResult.resume_suggestions?.sections_to_improve?.map((s: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <ChevronRight className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* ================= 5. ANALYSIS HISTORY ================= */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              Previous Analysis History
            </h3>
            <p className="text-xs text-slate-400">
              Access your saved match scores, reopen past analyses, and download reports.
            </p>
          </div>
          <button
            type="button"
            onClick={loadHistory}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            title="Refresh history"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHistory ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {historyList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Target Role</th>
                  <th className="py-3 px-4">Resume File</th>
                  <th className="py-3 px-4 text-center">Match Score</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {historyList.map((item) => (
                  <tr 
                    key={item.id}
                    onClick={() => handleSelectHistoryItem(item.id)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {item.job_title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 truncate max-w-[180px]">
                      {item.resume_filename}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        item.match_score >= 75
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : item.match_score >= 50
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        {item.match_score}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={api.getCareerFitReportUrl(item.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-300 transition-all cursor-pointer"
                          title="Download PDF Report"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/30 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 text-xs">
            <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p>No previous CareerFit analyses found. Run your first analysis above!</p>
          </div>
        )}
      </div>

    </div>
  );
};

