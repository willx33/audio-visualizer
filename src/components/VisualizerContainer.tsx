import React, { useState, useEffect, useRef } from 'react';
import { VisualizerConfig } from '../types/Visualizer';
import ControlPanel from './ControlPanel';
import { visualizerControls } from '../config/visualizers';
import useAudio from '../hooks/useAudio';

interface VisualizerContainerProps {
  visualizer: VisualizerConfig;
}

const VisualizerContainer: React.FC<VisualizerContainerProps> = ({ visualizer }) => {
  // Reference to the container element for dimensions
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for dimensions and settings
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [settings, setSettings] = useState(visualizer.defaultSettings || {});
  
  // Audio state
  const { audioState, getAudioData } = useAudio();
  const [audioData, setAudioData] = useState({
    frequencyData: new Uint8Array(0),
    timeData: new Uint8Array(0)
  });
  
  // Animation frame reference
  const animationFrameRef = useRef<number | null>(null);
  
  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    // Initial update
    updateDimensions();
    
    // Add resize listener
    window.addEventListener('resize', updateDimensions);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  // Update audio data with animation frame
  useEffect(() => {
    if (!audioState.isInitialized) return;
    
    const updateAudioData = () => {
      const data = getAudioData();
      setAudioData(data);
      animationFrameRef.current = requestAnimationFrame(updateAudioData);
    };
    
    updateAudioData();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioState.isInitialized, getAudioData]);
  
  // Update settings when visualizer changes
  useEffect(() => {
    setSettings(visualizer.defaultSettings || {});
  }, [visualizer]);
  
  // Handle settings change
  const handleSettingChange = (id: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  // Get the current visualizer component
  const VisualizerComponent = visualizer.component;
  
  // Get controls for the current visualizer
  const controls = visualizerControls[visualizer.id] || [];
  
  return (
    <div className="visualizer-container" ref={containerRef}>
      {audioState.isInitialized ? (
        <>
          <div className="canvas-container">
            <VisualizerComponent
              width={dimensions.width}
              height={dimensions.height}
              audioData={audioData}
              {...settings}
            />
          </div>
          <ControlPanel
            controls={controls}
            settings={settings}
            onChange={handleSettingChange}
          />
        </>
      ) : (
        <div className="not-connected">
          <div className="message-icon">🎵</div>
          <h2 className="glow">Audio Visualizer</h2>
          <p>
            Click the Connect button to grant microphone access and start the visualizer.
          </p>
          <div className="permission-message">
            <p><strong>Note:</strong> This app only processes your audio locally for visualization and does not record or transmit any audio data.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizerContainer;