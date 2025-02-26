export interface AudioContextConfig {
  fftSize?: number;
  smoothingTimeConstant?: number;
}

export interface AudioContextState {
  isInitialized: boolean;
  isPermissionGranted: boolean;
  audioContext: AudioContext | null;
  analyzer: AnalyserNode | null;
  frequencyData: Uint8Array;
  timeData: Uint8Array;
  mediaStream: MediaStream | null;
}

class AudioContextManager {
  private state: AudioContextState = {
    isInitialized: false,
    isPermissionGranted: false,
    audioContext: null,
    analyzer: null,
    frequencyData: new Uint8Array(0),
    timeData: new Uint8Array(0),
    mediaStream: null,
  };

  private config: AudioContextConfig = {
    fftSize: 2048,
    smoothingTimeConstant: 0.8,
  };

  private onUpdateCallbacks: Array<(state: AudioContextState) => void> = [];

  constructor(config?: AudioContextConfig) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  public async initialize(): Promise<boolean> {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyzer = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      // Connect the source to the analyzer
      source.connect(analyzer);
      
      // Configure the analyzer
      analyzer.fftSize = this.config.fftSize || 2048;
      analyzer.smoothingTimeConstant = this.config.smoothingTimeConstant || 0.8;
      
      // Create data arrays
      const frequencyData = new Uint8Array(analyzer.frequencyBinCount);
      const timeData = new Uint8Array(analyzer.frequencyBinCount);
      
      // Update state
      this.state = {
        isInitialized: true,
        isPermissionGranted: true,
        audioContext,
        analyzer,
        frequencyData,
        timeData,
        mediaStream: stream,
      };
      
      this.notifyUpdate();
      return true;
    } catch (error) {
      console.error('Error initializing audio context:', error);
      
      this.state = {
        ...this.state,
        isPermissionGranted: false,
      };
      
      this.notifyUpdate();
      return false;
    }
  }

  public updateAnalyzerConfig(config: AudioContextConfig): void {
    if (!this.state.analyzer) return;
    
    if (config.fftSize) {
      this.state.analyzer.fftSize = config.fftSize;
      
      // Recreate data arrays with new size
      this.state.frequencyData = new Uint8Array(this.state.analyzer.frequencyBinCount);
      this.state.timeData = new Uint8Array(this.state.analyzer.frequencyBinCount);
    }
    
    if (config.smoothingTimeConstant !== undefined) {
      this.state.analyzer.smoothingTimeConstant = config.smoothingTimeConstant;
    }
    
    this.config = { ...this.config, ...config };
    this.notifyUpdate();
  }

  public getAudioData(): { frequencyData: Uint8Array, timeData: Uint8Array } {
    if (this.state.analyzer) {
      this.state.analyzer.getByteFrequencyData(this.state.frequencyData);
      this.state.analyzer.getByteTimeDomainData(this.state.timeData);
    }
    
    return {
      frequencyData: this.state.frequencyData,
      timeData: this.state.timeData,
    };
  }

  public getState(): AudioContextState {
    return this.state;
  }

  public onUpdate(callback: (state: AudioContextState) => void): () => void {
    this.onUpdateCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.onUpdateCallbacks = this.onUpdateCallbacks.filter(cb => cb !== callback);
    };
  }

  private notifyUpdate(): void {
    for (const callback of this.onUpdateCallbacks) {
      callback(this.state);
    }
  }

  public cleanup(): void {
    if (this.state.mediaStream) {
      this.state.mediaStream.getTracks().forEach(track => track.stop());
    }
    
    if (this.state.audioContext) {
      this.state.audioContext.close();
    }
    
    this.state = {
      isInitialized: false,
      isPermissionGranted: false,
      audioContext: null,
      analyzer: null,
      frequencyData: new Uint8Array(0),
      timeData: new Uint8Array(0),
      mediaStream: null,
    };
    
    this.notifyUpdate();
  }
}

// Create a singleton instance
const audioContextManager = new AudioContextManager();
export default audioContextManager;