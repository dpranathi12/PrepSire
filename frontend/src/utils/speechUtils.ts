// Browser Web Speech API wrappers for Speech Recognition & Text-To-Speech

export class SpeechHandler {
  private recognition: any = null;
  private isListening: boolean = false;
  private synthesis: SpeechSynthesis | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis;
      }
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (err: any) => void
  ) {
    if (!this.recognition) {
      onError('Web Speech API is not supported in this browser.');
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.isListening = true;

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      onResult(finalTranscript || interimTranscript, !!finalTranscript);
    };

    this.recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.error('Error starting speech recognition', e);
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.synthesis) return;

    this.synthesis.cancel(); // Stop ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    // Try selecting a natural sounding English voice
    const voices = this.synthesis.getVoices();
    const preferredVoice = voices.find(
      v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    this.synthesis.speak(utterance);
  }

  public stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }
}

export const speechHandler = new SpeechHandler();
