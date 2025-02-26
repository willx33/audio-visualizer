import React, { useRef, useEffect } from 'react';
import { VisualizerProps } from '../types/Visualizer';

interface CircleVisualizerProps extends VisualizerProps {
  circleColor?: string;
  backgroundColor?: string;
  minRadius?: number;
  maxRadius?: number;
  rotation?: number;
  filled?: boolean;
  particleCount?: number;
}

const CircleVisualizer: React.FC<CircleVisualizerProps> = ({
  width,
  height,
  audioData,
  circleColor = '#6200ee',
  backgroundColor = '#121212',
  minRadius = 100,
  maxRadius = 300,
  rotation = 0,
  filled = true,
  particleCount = 120
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const rotationRef = useRef<number>(rotation);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set the canvas dimensions
    canvas.width = width;
    canvas.height = height;

    const draw = () => {
      // Request next animation frame
      animationRef.current = requestAnimationFrame(draw);

      // Clear the canvas
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Calculate center of canvas
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Get frequency data
      const { frequencyData } = audioData;

      // Calculate the average frequency value for overall intensity
      let sum = 0;
      for (let i = 0; i < frequencyData.length; i++) {
        sum += frequencyData[i];
      }
      const average = sum / frequencyData.length;
      const intensity = average / 255;
      
      // Update rotation based on intensity
      rotationRef.current += 0.01 + intensity * 0.05;

      // Draw particles in a circle
      const angleStep = (Math.PI * 2) / particleCount;
      
      for (let i = 0; i < particleCount; i++) {
        // Sample frequency data with some distribution
        const freqIndex = Math.floor((i / particleCount) * frequencyData.length);
        const value = frequencyData[freqIndex] / 255.0;
        
        // Calculate radius for this particle
        const radius = minRadius + value * (maxRadius - minRadius);
        
        // Calculate angle for this particle
        const angle = i * angleStep + rotationRef.current;
        
        // Calculate position
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        // Calculate particle size based on frequency value
        const particleSize = 2 + value * 10;
        
        // Calculate color with some variation
        const hue = (i / particleCount) * 360;
        
        // Draw particle
        ctx.beginPath();
        
        if (filled) {
          // Create gradient
          const gradient = ctx.createRadialGradient(
            x, y, 0,
            x, y, particleSize
          );
          
          // Add color stops
          gradient.addColorStop(0, `hsla(${hue}, 100%, 60%, 0.8)`);
          gradient.addColorStop(1, `hsla(${hue}, 100%, 60%, 0)`);
          
          // Set fill style
          ctx.fillStyle = gradient;
          ctx.arc(x, y, particleSize, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Just stroke the circle
          ctx.strokeStyle = `hsla(${hue}, 100%, 60%, 0.8)`;
          ctx.lineWidth = 2;
          ctx.arc(x, y, particleSize, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      
      // Draw connecting lines
      ctx.beginPath();
      for (let i = 0; i < particleCount; i++) {
        const freqIndex = Math.floor((i / particleCount) * frequencyData.length);
        const value = frequencyData[freqIndex] / 255.0;
        
        const radius = minRadius + value * (maxRadius - minRadius);
        const angle = i * angleStep + rotationRef.current;
        
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      // Close the path
      ctx.closePath();
      
      // Create gradient for the path
      const gradient = ctx.createLinearGradient(
        centerX - maxRadius, centerY,
        centerX + maxRadius, centerY
      );
      
      gradient.addColorStop(0, 'rgba(98, 0, 238, 0.5)');
      gradient.addColorStop(0.5, 'rgba(3, 218, 198, 0.5)');
      gradient.addColorStop(1, 'rgba(98, 0, 238, 0.5)');
      
      // Style and draw the path
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      if (filled) {
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.2;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    };

    // Start animation
    draw();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [width, height, audioData, circleColor, backgroundColor, minRadius, maxRadius, rotation, filled, particleCount]);

  return <canvas ref={canvasRef} className="visualizer" />;
};

export default CircleVisualizer;