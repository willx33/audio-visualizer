import React, { useRef, useEffect } from 'react';
import { VisualizerProps } from '../types/Visualizer';

interface FrequencyVisualizerProps extends VisualizerProps {
  barColor?: string;
  backgroundColor?: string;
  barWidth?: number;
  barSpacing?: number;
  barRoundness?: number;
  reactive?: boolean;
}

const FrequencyVisualizer: React.FC<FrequencyVisualizerProps> = ({
  width,
  height,
  audioData,
  barColor = '#6200ee',
  backgroundColor = '#121212',
  barWidth = 4,
  barSpacing = 1,
  barRoundness = 2,
  reactive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set the canvas dimensions
    canvas.width = width;
    canvas.height = height;

    const drawFrequencyBars = () => {
      // Request next animation frame
      animationRef.current = requestAnimationFrame(drawFrequencyBars);

      // Clear the canvas
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Get frequency data
      const { frequencyData } = audioData;
      
      // Calculate dimensions
      const totalWidth = barWidth + barSpacing;
      const barCount = Math.min(Math.floor(width / totalWidth), frequencyData.length);
      
      // Draw frequency bars
      for (let i = 0; i < barCount; i++) {
        const value = frequencyData[i];
        const percent = value / 255;
        const barHeight = percent * height;
        
        // Calculate position
        const x = i * totalWidth;
        const y = height - barHeight;
        
        // Create gradient for the bar
        const gradient = ctx.createLinearGradient(x, height, x, y);
        
        // If reactive is true, use a color based on the frequency value
        if (reactive) {
          gradient.addColorStop(0, barColor);
          gradient.addColorStop(0.5, '#8434ff');
          gradient.addColorStop(1, '#03dac6');
        } else {
          gradient.addColorStop(0, barColor);
          gradient.addColorStop(1, barColor);
        }
        
        ctx.fillStyle = gradient;
        
        // Draw rounded bar
        if (barRoundness > 0 && barHeight > barRoundness * 2) {
          // Draw rounded rectangle for the bar
          ctx.beginPath();
          ctx.moveTo(x, y + barRoundness);
          ctx.lineTo(x, height - barRoundness);
          ctx.quadraticCurveTo(x, height, x + barRoundness, height);
          ctx.lineTo(x + barWidth - barRoundness, height);
          ctx.quadraticCurveTo(x + barWidth, height, x + barWidth, height - barRoundness);
          ctx.lineTo(x + barWidth, y + barRoundness);
          ctx.quadraticCurveTo(x + barWidth, y, x + barWidth - barRoundness, y);
          ctx.lineTo(x + barRoundness, y);
          ctx.quadraticCurveTo(x, y, x, y + barRoundness);
          ctx.fill();
        } else {
          // Draw simple rectangle for the bar
          ctx.fillRect(x, y, barWidth, barHeight);
        }
      }
    };

    // Start animation
    drawFrequencyBars();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [width, height, audioData, barColor, backgroundColor, barWidth, barSpacing, barRoundness, reactive]);

  return <canvas ref={canvasRef} className="visualizer" />;
};

export default FrequencyVisualizer;