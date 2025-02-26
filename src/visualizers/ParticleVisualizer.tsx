import React, { useRef, useEffect } from 'react';
import { VisualizerProps } from '../types/Visualizer';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  angle: number;
  lifespan: number;
  maxLifespan: number;
}

interface ParticleVisualizerProps extends VisualizerProps {
  particleCount?: number;
  maxParticleSize?: number;
  particleDecay?: number;
  backgroundColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  speedFactor?: number;
  gravity?: number;
}

const ParticleVisualizer: React.FC<ParticleVisualizerProps> = ({
  width,
  height,
  audioData,
  particleCount = 200,
  maxParticleSize = 15,
  particleDecay = 0.95,
  backgroundColor = '#121212',
  primaryColor = '#6200ee',
  secondaryColor = '#03dac6',
  speedFactor = 2,
  gravity = 0.05
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  
  // Calculate audio reactivity
  const getAudioIntensity = () => {
    if (!audioData.frequencyData.length) return 0;
    
    // Get average frequency value
    const sum = Array.from(audioData.frequencyData).reduce((a, b) => a + b, 0);
    return sum / audioData.frequencyData.length / 255;
  };
  
  const getBassIntensity = () => {
    if (!audioData.frequencyData.length) return 0;
    
    // Get average of the first 10% of frequencies (bass)
    const bassRange = Math.floor(audioData.frequencyData.length * 0.1);
    let sum = 0;
    for (let i = 0; i < bassRange; i++) {
      sum += audioData.frequencyData[i];
    }
    return sum / bassRange / 255;
  };
  
  const getMidIntensity = () => {
    if (!audioData.frequencyData.length) return 0;
    
    // Get average of the middle frequencies
    const totalBins = audioData.frequencyData.length;
    const startBin = Math.floor(totalBins * 0.1);
    const endBin = Math.floor(totalBins * 0.5);
    let sum = 0;
    for (let i = startBin; i < endBin; i++) {
      sum += audioData.frequencyData[i];
    }
    return sum / (endBin - startBin) / 255;
  };
  
  const getHighIntensity = () => {
    if (!audioData.frequencyData.length) return 0;
    
    // Get average of high frequencies
    const totalBins = audioData.frequencyData.length;
    const startBin = Math.floor(totalBins * 0.5);
    let sum = 0;
    for (let i = startBin; i < totalBins; i++) {
      sum += audioData.frequencyData[i];
    }
    return sum / (totalBins - startBin) / 255;
  };
  
  // Create a particle
  const createParticle = (x: number, y: number, intensity: number, bassIntensity: number): Particle => {
    // Calculate size based on bass intensity
    const size = Math.random() * maxParticleSize * (0.5 + bassIntensity * 2);
    
    // Calculate speed based on audio intensity
    const speed = (Math.random() * 2 + 1) * speedFactor * (0.5 + intensity);
    
    // Calculate angle with some randomness
    const angle = Math.random() * Math.PI * 2;
    
    // Calculate lifespan based on size and intensity
    const lifespan = Math.random() * 100 + 50;
    
    // Calculate color with interpolation between primary and secondary
    const ratio = Math.random();
    const color = interpolateColors(primaryColor, secondaryColor, ratio);
    
    return {
      x,
      y,
      size,
      color,
      speed,
      angle,
      lifespan,
      maxLifespan: lifespan
    };
  };
  
  // Interpolate between two colors
  const interpolateColors = (color1: string, color2: string, ratio: number): string => {
    // Parse hex colors to RGB
    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);
    
    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);
    
    // Interpolate
    const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
    const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
    const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set the canvas dimensions
    canvas.width = width;
    canvas.height = height;
    
    // Initialize particle array if empty
    if (particlesRef.current.length === 0) {
      particlesRef.current = Array(particleCount).fill(null).map(() => {
        return createParticle(
          Math.random() * width, 
          Math.random() * height, 
          0.5,
          0.5
        );
      });
    }

    const draw = () => {
      // Request next animation frame
      animationRef.current = requestAnimationFrame(draw);

      // Clear canvas with a transparent overlay for trail effect
      ctx.fillStyle = `${backgroundColor}22`;
      ctx.fillRect(0, 0, width, height);
      
      // Get audio intensities for reactivity
      const intensity = getAudioIntensity();
      const bassIntensity = getBassIntensity();
      const midIntensity = getMidIntensity();
      const highIntensity = getHighIntensity();
      
      // Add new particles based on audio intensity
      const particlesToAdd = Math.floor(intensity * 5);
      for (let i = 0; i < particlesToAdd; i++) {
        // Add particles near center with some randomness
        const x = width / 2 + (Math.random() - 0.5) * width * 0.5 * intensity;
        const y = height / 2 + (Math.random() - 0.5) * height * 0.5 * intensity;
        
        particlesRef.current.push(createParticle(x, y, intensity, bassIntensity));
      }
      
      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        // Update position
        particle.x += Math.cos(particle.angle) * particle.speed * (1 + highIntensity);
        particle.y += Math.sin(particle.angle) * particle.speed * (1 + midIntensity) + gravity;
        
        // Apply audio reactivity to size
        const reactiveSize = particle.size * (1 + bassIntensity * 0.5);
        
        // Decrease lifespan
        particle.lifespan -= 1 + intensity;
        
        // Calculate opacity based on lifespan
        const opacity = Math.min(1, particle.lifespan / particle.maxLifespan);
        
        // Draw particle
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, reactiveSize
        );
        gradient.addColorStop(0, `${particle.color}ff`);
        gradient.addColorStop(1, `${particle.color}00`);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = opacity;
        ctx.arc(particle.x, particle.y, reactiveSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        
        // Create connections between nearby particles
        if (particle.lifespan > 0 && Math.random() < 0.1 * intensity) {
          for (let i = 0; i < 3; i++) {
            const otherParticle = particlesRef.current[Math.floor(Math.random() * particlesRef.current.length)];
            const distance = Math.sqrt(
              Math.pow(particle.x - otherParticle.x, 2) + 
              Math.pow(particle.y - otherParticle.y, 2)
            );
            
            if (distance < 100 * intensity) {
              ctx.beginPath();
              ctx.strokeStyle = particle.color;
              ctx.globalAlpha = (1 - distance / (100 * intensity)) * 0.3 * opacity;
              ctx.lineWidth = 1;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
              ctx.globalAlpha = 1;
            }
          }
        }
        
        // Keep particle if it's still alive and on screen
        return (
          particle.lifespan > 0 &&
          particle.x > -reactiveSize &&
          particle.x < width + reactiveSize &&
          particle.y > -reactiveSize &&
          particle.y < height + reactiveSize
        );
      });
      
      // Limit number of particles for performance
      while (particlesRef.current.length > particleCount) {
        particlesRef.current.shift();
      }
    };

    // Start animation
    draw();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [
    width, 
    height, 
    audioData, 
    particleCount, 
    maxParticleSize, 
    particleDecay, 
    backgroundColor, 
    primaryColor, 
    secondaryColor,
    speedFactor,
    gravity
  ]);

  return <canvas ref={canvasRef} className="visualizer" />;
};

export default ParticleVisualizer;