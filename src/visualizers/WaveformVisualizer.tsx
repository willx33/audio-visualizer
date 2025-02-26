import React, { useRef, useEffect } from 'react';
import { VisualizerProps } from '../types/Visualizer';

interface WaveformVisualizerProps extends VisualizerProps {
  lineColor?: string;
  backgroundColor?: string;
  lineWidth?: number;
  filled?: boolean;
  mirror?: boolean;
  smooth?: boolean;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  width,
  height,
  audioData,
  lineColor = '#03dac6',
  backgroundColor = '#121212',
  lineWidth = 2,
  filled = true,
  mirror = false,
  smooth = true
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

    const drawWaveform = () => {
      // Request next animation frame
      animationRef.current = requestAnimationFrame(drawWaveform);

      // Clear the canvas
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Get time domain data
      const { timeData } = audioData;
      
      // Calculate dimensions
      const sliceWidth = width / timeData.length;
      const centerY = mirror ? height / 2 : height;
      
      // Set line style
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = lineColor;
      
      // Begin path for waveform
      ctx.beginPath();
      
      // Draw waveform
      for (let i = 0; i < timeData.length; i++) {
        const value = timeData[i] / 128.0;
        const y = mirror 
          ? centerY - (value - 1) * (centerY / 2) 
          : height - (value * height / 2);
        
        const x = i * sliceWidth;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else if (smooth) {
          // For smooth lines
          const prevX = (i - 1) * sliceWidth;
          const prevY = timeData[i - 1] / 128.0;
          const prevYPos = mirror 
            ? centerY - (prevY - 1) * (centerY / 2) 
            : height - (prevY * height / 2);
          
          // Use quadratic curves for smooth lines
          const cpX = (prevX + x) / 2;
          ctx.quadraticCurveTo(cpX, prevYPos, x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      // Complete the path and stroke it
      if (filled && mirror) {
        // For filled mirror mode, complete the path to create a closed shape
        ctx.lineTo(width, centerY);
        ctx.lineTo(0, centerY);
        ctx.closePath();
        
        // Create gradient fill
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, `${lineColor}88`); // Semi-transparent
        gradient.addColorStop(0.5, `${lineColor}22`); // More transparent at center
        gradient.addColorStop(1, `${lineColor}88`);
        ctx.fillStyle = gradient;
        ctx.fill();
      } else if (filled) {
        // For filled mode, complete the path to bottom
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        
        // Create gradient fill
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, lineColor);
        gradient.addColorStop(1, `${lineColor}22`); // Semi-transparent at bottom
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      // Always stroke the line
      ctx.stroke();
      
      // If mirrored, draw a centerline
      if (mirror) {
        ctx.beginPath();
        ctx.strokeStyle = `${lineColor}44`; // Semi-transparent
        ctx.lineWidth = 1;
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
      }
    };

    // Start animation
    drawWaveform();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [width, height, audioData, lineColor, backgroundColor, lineWidth, filled, mirror, smooth]);

  return <canvas ref={canvasRef} className="visualizer" />;
};

export default WaveformVisualizer;