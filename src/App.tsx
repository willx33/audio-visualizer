import React, { useState, useEffect } from 'react';
import './App.css';
import VisualizerContainer from './components/VisualizerContainer';
import { visualizerConfigs } from './config/visualizers';
import useAudio from './hooks/useAudio';

function App() {
  const [activeVisualizer, setActiveVisualizer] = useState(visualizerConfigs[0]);
  const { audioState, initializeAudio, cleanupAudio, updateConfig } = useAudio();

  useEffect(() => {
    // Cleanup audio context on unmount
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  const handleConnect = async () => {
    await initializeAudio();
  };

  const handleDisconnect = () => {
    cleanupAudio();
  };

  const handleVisualizerChange = (visualizerId: string) => {
    const visualizer = visualizerConfigs.find(v => v.id === visualizerId);
    if (visualizer) {
      setActiveVisualizer(visualizer);
    }
  };

  const handleFftSizeChange = (size: number) => {
    updateConfig({ fftSize: size });
  };

  return (
    <div className="App">
      <header className="header">
        <h1 className="app-title">Audio Visualizer</h1>
        
        <div>
          {!audioState.isInitialized ? (
            <button className="button" onClick={handleConnect}>
              Connect Microphone
            </button>
          ) : (
            <button className="button secondary" onClick={handleDisconnect}>
              Disconnect
            </button>
          )}
        </div>
      </header>
      
      <div className="tabs">
        {visualizerConfigs.map(visualizer => (
          <div
            key={visualizer.id}
            className={`tab ${activeVisualizer.id === visualizer.id ? 'active' : ''}`}
            onClick={() => handleVisualizerChange(visualizer.id)}
          >
            {visualizer.name}
          </div>
        ))}
      </div>
      
      <VisualizerContainer visualizer={activeVisualizer} />
      
      {audioState.isInitialized && (
        <div className="fft-settings">
          <div className="control-group">
            <label className="control-label">Resolution</label>
            <div className="button-group">
              {[512, 1024, 2048, 4096, 8192].map(size => (
                <button
                  key={size}
                  className={`button ${
                    audioState.analyzer?.fftSize === size ? 'active' : 'secondary'
                  }`}
                  onClick={() => handleFftSizeChange(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;