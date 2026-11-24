import React, { useState, useEffect, useRef } from 'react';
import { Award, Camera, Video, VideoOff, Sparkles, Smile, Play, RefreshCw, Volume2, Mic, Eye } from 'lucide-react';
import { speechHandler } from '../utils/speechUtils';

export const ConfidenceBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mirror' | 'intro' | 'impromptu'>('mirror');
  
  // Mirror & Camera State
  const [mirrorTimer, setMirrorTimer] = useState(60);
  const [isMirrorActive, setIsMirrorActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [micVolume, setMicVolume] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Self Intro Builder state
  const [name, setName] = useState('Alex');
  const [role, setRole] = useState('Software Developer');
  const [project, setProject] = useState('an AI-powered web platform');
  const [strength, setStrength] = useState('rapid problem solving and clean code');

  // Impromptu Prompts
  const impromptuPrompts = [
    "If you could launch any company tomorrow, what problem would it solve?",
    "What is one failure that taught you a valuable life lesson?",
    "How do you stay calm when everything in a project seems to be going wrong?",
    "Why is adaptability more important than raw technical knowledge?",
    "Describe a technical topic you learned recently as if explaining it to a 10-year-old.",
    "How do you handle working with someone who has a completely different work style than yours?"
  ];
  const [promptIdx, setPromptIdx] = useState(0);

  // Start Camera Stream
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }, 
        audio: true 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);

      // Audio volume analyzer
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setMicVolume(Math.min(100, Math.round(avg * 1.6)));
          animFrameRef.current = requestAnimationFrame(updateVolume);
        };
        updateVolume();
      } catch (audioErr) {
        console.warn("Audio meter init error:", audioErr);
      }
    } catch (err: any) {
      console.warn("Camera access failed:", err);
      setCameraError("Camera access denied or device unavailable. You can still practice with the mirror timer!");
      setCameraActive(false);
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setMicVolume(0);
  };

  useEffect(() => {
    if (activeTab !== 'mirror') {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab]);

  useEffect(() => {
    let interval: any = null;
    if (isMirrorActive) {
      if (mirrorTimer > 0) {
        interval = setInterval(() => setMirrorTimer(t => t - 1), 1000);
      } else {
        setIsMirrorActive(false);
      }
    }
    return () => clearInterval(interval);
  }, [isMirrorActive, mirrorTimer]);

  const generatedIntro = `Hello! My name is ${name}. I am a candidate aspiring to excel as a ${role}. Recently, I worked on ${project}, where I honed my skills in ${strength}. I thrive in collaborative environments and am eager to bring my problem-solving mindset to your engineering team.`;

  const handleStartMirrorSession = () => {
    setMirrorTimer(60);
    setIsMirrorActive(true);
    if (!cameraActive) {
      startCamera();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
          <Award className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-extrabold text-white">Confidence Builder & Webcam Mirror</h2>
        <p className="text-slate-400 text-sm mt-1">
          Practice live eye contact with your webcam, monitor your posture & voice volume, and perfect your self-introduction pitch.
        </p>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button
          onClick={() => setActiveTab('mirror')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'mirror' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          📹 Webcam & Mirror Practice
        </button>

        <button
          onClick={() => setActiveTab('intro')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'intro' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          📝 Self-Introduction Pitch
        </button>

        <button
          onClick={() => setActiveTab('impromptu')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'impromptu' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          ⚡ Impromptu Prompts
        </button>
      </div>

      {/* Mirror Speaking Mode */}
      {activeTab === 'mirror' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6 text-center">
          
          <div className="relative max-w-xl mx-auto rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl min-h-[340px] flex flex-col items-center justify-center">
            
            {/* Live Video Feed */}
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover max-h-[380px] rounded-3xl transform -scale-x-100 ${cameraActive ? 'block' : 'hidden'}`}
            />

            {/* Video Feed Overlays */}
            {cameraActive && (
              <>
                {/* Target Eye Contact Circle */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 border-2 border-dashed border-amber-400/60 w-24 h-24 rounded-full pointer-events-none flex items-center justify-center animate-pulse">
                  <Eye className="w-5 h-5 text-amber-400 opacity-60" />
                </div>

                {/* Live Timer Badge */}
                <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700/60 text-xs font-extrabold text-amber-400 flex items-center gap-1.5 shadow-md">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Timer: {mirrorTimer}s</span>
                </div>

                {/* Posture & Smile Banner */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-md p-3 rounded-2xl border border-slate-700/60 flex items-center justify-between text-xs text-slate-200">
                  <div className="flex items-center gap-2 font-medium">
                    <Smile className="w-4 h-4 text-amber-400" />
                    <span>Sit Up Straight • Look at Camera • Smile</span>
                  </div>

                  {/* Audio Meter */}
                  <div className="flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-slate-400" />
                    <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-400 transition-all duration-75"
                        style={{ width: `${micVolume}%` }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Camera Stopped Placeholder */}
            {!cameraActive && (
              <div className="p-8 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-500 flex items-center justify-center shadow-xl">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                <div className="text-sm font-bold text-white">Webcam & Mic Preview</div>
                <div className="text-4xl font-extrabold text-amber-400">{mirrorTimer}s</div>
                <p className="text-xs text-slate-400 max-w-sm">
                  Enable your webcam to practice eye contact, posture alignment, and monitor your speech volume level in real time.
                </p>
                {cameraError && (
                  <div className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/40 max-w-sm">
                    {cameraError}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {!cameraActive ? (
              <button
                onClick={startCamera}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>Turn Camera ON</span>
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-2 cursor-pointer"
              >
                <VideoOff className="w-4 h-4" />
                <span>Turn Camera OFF</span>
              </button>
            )}

            <button
              onClick={handleStartMirrorSession}
              className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-xl flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{isMirrorActive ? 'Restart 60s Session' : 'Start 60s Mirror Session'}</span>
            </button>
          </div>

        </div>
      )}

      {/* Self Intro Builder */}
      {activeTab === 'intro' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
          <h3 className="text-xl font-bold text-white mb-2">Step-by-Step Self Introduction Pitch</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Target Role</label>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Key Project</label>
              <input
                type="text"
                value={project}
                onChange={e => setProject(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Top Strength</label>
              <input
                type="text"
                value={strength}
                onChange={e => setStrength(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm outline-none"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase">Generated Pitch Script:</span>
              <button
                onClick={() => speechHandler.speak(generatedIntro)}
                className="text-xs text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" /> Listen Audio
              </button>
            </div>
            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed italic">
              "{generatedIntro}"
            </p>
          </div>
        </div>
      )}

      {/* Impromptu Speaking */}
      {activeTab === 'impromptu' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6 text-center">
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase">Impromptu Question</span>
            <h3 className="text-xl font-bold text-white leading-snug">
              "{impromptuPrompts[promptIdx]}"
            </h3>
          </div>

          <button
            onClick={() => setPromptIdx((promptIdx + 1) % impromptuPrompts.length)}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 mx-auto cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Generate Next Impromptu Prompt</span>
          </button>
        </div>
      )}

    </div>
  );
};
