import React, { useEffect, useRef, useState } from 'react';
import { MovementPattern, MovementPoint } from '../types/servo';

interface PatternPreviewProps {
  pattern: MovementPattern;
  width?: number;
  height?: number;
}

export const PatternPreview: React.FC<PatternPreviewProps> = ({
  pattern,
  width = 300,
  height = 200
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const animationRef = useRef<number>();

  const colors = {
    primary: '#2563eb',     // Blue
    secondary: '#1e40af',   // Dark Blue
    accent: '#10b981',      // Green
    text: '#6b7280',        // Gray
    grid: '#e5e7eb',        // Light Gray
    highlight: '#f59e0b'    // Yellow
  };

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 0.5;

    // Draw horizontal lines (angles)
    for (let i = 0; i <= 180; i += 45) {
      const y = height - (i * height / 180);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      // Add angle labels
      ctx.fillStyle = colors.text;
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`${i}°`, 25, y + 4);
    }

    // Draw vertical lines (time divisions)
    const timeSteps = 5;
    for (let i = 0; i <= timeSteps; i++) {
      const x = (width - 30) * (i / timeSteps) + 30;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height - 20);
      ctx.stroke();
    }
  };

  const drawPattern = (ctx: CanvasRenderingContext2D, points: MovementPoint[], highlightIndex = -1) => {
    ctx.clearRect(0, 0, width, height);
    drawGrid(ctx);

    const xOffset = 30; // Offset for angle labels
    const effectiveWidth = width - xOffset;
    
    // Scale factors
    const xScale = effectiveWidth / (points.length - 1);
    const yScale = (height - 20) / 180; // Leave space for time labels

    // Draw the pattern line
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();

    points.forEach((point, index) => {
      const x = index * xScale + xOffset;
      const y = height - 20 - (point.angle * yScale);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw points and annotations
    points.forEach((point, index) => {
      const x = index * xScale + xOffset;
      const y = height - 20 - (point.angle * yScale);

      // Draw point markers
      ctx.fillStyle = index === highlightIndex ? colors.highlight : colors.secondary;
      ctx.beginPath();
      ctx.arc(x, y, index === highlightIndex ? 6 : 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw hover effect for current point
      if (index === highlightIndex) {
        ctx.strokeStyle = colors.highlight;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        
        // Vertical line
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, height - 20);
        ctx.stroke();
        
        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(xOffset, y);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        ctx.setLineDash([]);

        // Draw point info
        ctx.fillStyle = colors.text;
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Angle: ${point.angle}°`, x + 10, y - 10);
        ctx.fillText(`Delay: ${point.delay}ms`, x + 10, y + 20);
      }

      // Draw time markers
      if (index % 2 === 0 || index === points.length - 1) {
        ctx.fillStyle = colors.text;
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${point.delay}ms`, x, height - 5);
      }
    });

    // Draw pattern info
    ctx.fillStyle = colors.text;
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(pattern.name, 10, 20);
    ctx.font = '10px Arial';
    ctx.fillText(`Type: ${pattern.type}`, 10, 35);
  };

  const animate = (points: MovementPoint[]) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    let frame = currentFrame;
    const totalFrames = points.length;

    const step = () => {
      drawPattern(ctx, points, frame % totalFrames);
      frame = (frame + 1) % totalFrames;
      setCurrentFrame(frame);
      
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(step);
      }
    };

    animationRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const points = pattern.type === 'composite' && pattern.sequences
      ? pattern.sequences.reduce((acc, seq) => [...acc, ...seq.points], [] as MovementPoint[])
      : pattern.points || [];

    if (isPlaying) {
      animate(points);
    } else {
      drawPattern(ctx, points);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [pattern, isPlaying, width, height]);

  const handleCanvasClick = () => {
    setIsPlaying(!isPlaying);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <div className="pattern-preview">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border rounded bg-white cursor-pointer"
        onClick={handleCanvasClick}
        title={isPlaying ? "Click to pause" : "Click to play"}
      />
      <div className="mt-2 flex justify-between items-center text-sm text-gray-600">
        <div>
          <span className="mr-4">
            Points: {pattern.points?.length || pattern.sequences?.reduce((acc, seq) => acc + seq.points.length, 0) || 0}
          </span>
          <span>
            Duration: {pattern.points?.reduce((acc, p) => acc + p.delay, 0) || 
              pattern.sequences?.reduce((acc, seq) => acc + seq.points.reduce((a, p) => a + p.delay, 0), 0) || 0}ms
          </span>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-3 py-1 rounded text-white ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {isPlaying ? 'Stop' : 'Play'}
        </button>
      </div>
    </div>
  );
};
