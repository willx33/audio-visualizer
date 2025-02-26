import { VisualizerConfig, VisualizerControls } from '../types/Visualizer';
import FrequencyVisualizer from '../visualizers/FrequencyVisualizer';
import WaveformVisualizer from '../visualizers/WaveformVisualizer';
import CircleVisualizer from '../visualizers/CircleVisualizer';
import ParticleVisualizer from '../visualizers/ParticleVisualizer';

const frequencyVisualizerControls: VisualizerControls[] = [
  {
    id: 'barColor',
    name: 'Bar Color',
    type: 'color',
    defaultValue: '#6200ee'
  },
  {
    id: 'barWidth',
    name: 'Bar Width',
    type: 'slider',
    min: 1,
    max: 20,
    step: 1,
    defaultValue: 4
  },
  {
    id: 'barSpacing',
    name: 'Bar Spacing',
    type: 'slider',
    min: 0,
    max: 10,
    step: 1,
    defaultValue: 1
  },
  {
    id: 'barRoundness',
    name: 'Bar Roundness',
    type: 'slider',
    min: 0,
    max: 10,
    step: 1,
    defaultValue: 2
  },
  {
    id: 'reactive',
    name: 'Color Reactive',
    type: 'toggle',
    defaultValue: true
  }
];

const waveformVisualizerControls: VisualizerControls[] = [
  {
    id: 'lineColor',
    name: 'Line Color',
    type: 'color',
    defaultValue: '#03dac6'
  },
  {
    id: 'lineWidth',
    name: 'Line Width',
    type: 'slider',
    min: 1,
    max: 10,
    step: 1,
    defaultValue: 2
  },
  {
    id: 'filled',
    name: 'Fill Waveform',
    type: 'toggle',
    defaultValue: true
  },
  {
    id: 'mirror',
    name: 'Mirror Display',
    type: 'toggle',
    defaultValue: false
  },
  {
    id: 'smooth',
    name: 'Smooth Lines',
    type: 'toggle',
    defaultValue: true
  }
];

const circleVisualizerControls: VisualizerControls[] = [
  {
    id: 'minRadius',
    name: 'Min Radius',
    type: 'slider',
    min: 50,
    max: 300,
    step: 10,
    defaultValue: 100
  },
  {
    id: 'maxRadius',
    name: 'Max Radius',
    type: 'slider',
    min: 100,
    max: 500,
    step: 10,
    defaultValue: 300
  },
  {
    id: 'filled',
    name: 'Fill Shape',
    type: 'toggle',
    defaultValue: true
  },
  {
    id: 'particleCount',
    name: 'Particle Count',
    type: 'slider',
    min: 40,
    max: 200,
    step: 10,
    defaultValue: 120
  }
];

const particleVisualizerControls: VisualizerControls[] = [
  {
    id: 'particleCount',
    name: 'Particle Count',
    type: 'slider',
    min: 50,
    max: 500,
    step: 10,
    defaultValue: 200
  },
  {
    id: 'maxParticleSize',
    name: 'Particle Size',
    type: 'slider',
    min: 5,
    max: 30,
    step: 1,
    defaultValue: 15
  },
  {
    id: 'speedFactor',
    name: 'Speed',
    type: 'slider',
    min: 0.5,
    max: 5,
    step: 0.1,
    defaultValue: 2
  },
  {
    id: 'gravity',
    name: 'Gravity',
    type: 'slider',
    min: -0.2,
    max: 0.2,
    step: 0.01,
    defaultValue: 0.05
  },
  {
    id: 'primaryColor',
    name: 'Primary Color',
    type: 'color',
    defaultValue: '#6200ee'
  },
  {
    id: 'secondaryColor',
    name: 'Secondary Color',
    type: 'color',
    defaultValue: '#03dac6'
  }
];

export const visualizerConfigs: VisualizerConfig[] = [
  {
    id: 'frequency',
    name: 'Frequency Spectrum',
    description: 'Visualizes audio frequency spectrum with colorful vertical bars',
    component: FrequencyVisualizer,
    defaultSettings: {
      barColor: '#6200ee',
      barWidth: 4,
      barSpacing: 1,
      barRoundness: 2,
      reactive: true
    }
  },
  {
    id: 'waveform',
    name: 'Waveform',
    description: 'Displays audio waveform with customizable styles',
    component: WaveformVisualizer,
    defaultSettings: {
      lineColor: '#03dac6',
      lineWidth: 2,
      filled: true,
      mirror: false,
      smooth: true
    }
  },
  {
    id: 'circle',
    name: 'Circular',
    description: 'A circular audio visualization with dynamic particles',
    component: CircleVisualizer,
    defaultSettings: {
      minRadius: 100,
      maxRadius: 300,
      filled: true,
      particleCount: 120
    }
  },
  {
    id: 'particles',
    name: 'Particles',
    description: 'Dynamic particle system that reacts to audio',
    component: ParticleVisualizer,
    defaultSettings: {
      particleCount: 200,
      maxParticleSize: 15,
      speedFactor: 2,
      gravity: 0.05,
      primaryColor: '#6200ee',
      secondaryColor: '#03dac6'
    }
  }
];

export const visualizerControls: Record<string, VisualizerControls[]> = {
  frequency: frequencyVisualizerControls,
  waveform: waveformVisualizerControls,
  circle: circleVisualizerControls,
  particles: particleVisualizerControls
};