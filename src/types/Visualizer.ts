export interface VisualizerProps {
  width: number;
  height: number;
  audioData: {
    frequencyData: Uint8Array;
    timeData: Uint8Array;
  };
}

export interface VisualizerConfig {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<VisualizerProps>;
  defaultSettings?: Record<string, any>;
}

export interface VisualizerControls {
  id: string;
  name: string;
  type: 'slider' | 'toggle' | 'select' | 'color';
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ value: string; label: string }>;
  defaultValue: any;
}