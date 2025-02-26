import React from 'react';
import { VisualizerControls } from '../types/Visualizer';

interface ControlPanelProps {
  controls: VisualizerControls[];
  settings: Record<string, any>;
  onChange: (id: string, value: any) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ controls, settings, onChange }) => {
  return (
    <div className="control-panel">
      <h3>Settings</h3>
      
      {controls.map((control) => (
        <div key={control.id} className="control-group">
          <label className="control-label">{control.name}</label>
          
          {control.type === 'slider' && (
            <div className="slider-container">
              <input
                type="range"
                className="slider"
                min={control.min}
                max={control.max}
                step={control.step}
                value={settings[control.id] !== undefined ? settings[control.id] : control.defaultValue}
                onChange={(e) => onChange(control.id, parseFloat(e.target.value))}
              />
              <span>{settings[control.id] !== undefined ? settings[control.id] : control.defaultValue}</span>
            </div>
          )}
          
          {control.type === 'toggle' && (
            <div className="toggle-container">
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings[control.id] !== undefined ? settings[control.id] : control.defaultValue}
                  onChange={(e) => onChange(control.id, e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          )}
          
          {control.type === 'select' && (
            <select
              value={settings[control.id] !== undefined ? settings[control.id] : control.defaultValue}
              onChange={(e) => onChange(control.id, e.target.value)}
              className="select-input"
            >
              {control.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          
          {control.type === 'color' && (
            <input
              type="color"
              value={settings[control.id] !== undefined ? settings[control.id] : control.defaultValue}
              onChange={(e) => onChange(control.id, e.target.value)}
              className="color-input"
            />
          )}
        </div>
      ))}
      
      <button 
        className="button secondary" 
        onClick={() => {
          // Reset all controls to default values
          controls.forEach((control) => {
            onChange(control.id, control.defaultValue);
          });
        }}
      >
        Reset to Defaults
      </button>
    </div>
  );
};

export default ControlPanel;