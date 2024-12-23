import { ServoConfiguration, MovementPattern, ServoLimits } from '../types/servo';
import { EventBus } from '../utils/eventBus';

export class IntegrationService {
  private static instance: IntegrationService;

  private constructor() {}

  static getInstance(): IntegrationService {
    if (!IntegrationService.instance) {
      IntegrationService.instance = new IntegrationService();
    }
    return IntegrationService.instance;
  }

  validatePatternWithConfig(pattern: MovementPattern, servos: ServoConfiguration[]): boolean {
    try {
      if (!pattern || !servos.length) return false;

      // Check if pattern points are within servo limits
      const points = pattern.points || [];
      const sequences = pattern.sequences || [];

      // Validate individual points
      for (const point of points) {
        if (!this.isAngleWithinLimits(point.angle, servos[0].limits)) {
          throw new Error(`Angle ${point.angle}° is outside servo limits`);
        }
      }

      // Validate sequences
      for (const sequence of sequences) {
        for (const point of sequence.points) {
          if (!this.isAngleWithinLimits(point.angle, servos[0].limits)) {
            throw new Error(`Angle ${point.angle}° in sequence ${sequence.name} is outside servo limits`);
          }
        }
      }

      return true;
    } catch (error) {
      EventBus.emit('error', error as Error);
      return false;
    }
  }

  private isAngleWithinLimits(angle: number, limits: ServoLimits): boolean {
    return angle >= limits.minAngle && angle <= limits.maxAngle;
  }

  generateExecutableCode(servos: ServoConfiguration[], pattern: MovementPattern | null): string {
    try {
      let code = '# Generated by Servo Configurator\n\n';
      
      // Import statements
      code += 'import time\n';
      code += 'from servo_controller import ServoController\n\n';

      // Servo initialization
      code += '# Initialize servo controller\n';
      code += 'controller = ServoController()\n\n';

      // Configure servos
      code += '# Configure servos\n';
      servos.forEach(servo => {
        code += `controller.add_servo(
    channel=${servo.channel},
    min_pulse=${servo.minPulse},
    max_pulse=${servo.maxPulse},
    initial_position=${servo.initialPosition},
    inverted=${servo.inverted}
)\n`;
      });

      // Add pattern execution if provided
      if (pattern) {
        code += '\n# Execute movement pattern\n';
        if (pattern.type === 'smooth') {
          code += this.generateSmoothPatternCode(pattern);
        } else if (pattern.type === 'stepped') {
          code += this.generateSteppedPatternCode(pattern);
        } else {
          code += this.generateCompositePatternCode(pattern);
        }
      }

      return code;
    } catch (error) {
      EventBus.emit('error', error as Error);
      return '# Error generating code';
    }
  }

  private generateSmoothPatternCode(pattern: MovementPattern): string {
    let code = 'def execute_pattern():\n';
    pattern.points?.forEach((point, index) => {
      code += `    controller.move_to(${point.angle}, duration=${point.delay / 1000})\n`;
      code += '    time.sleep(0.01)\n';
    });
    code += '\n# Start pattern execution\nexecute_pattern()\n';
    return code;
  }

  private generateSteppedPatternCode(pattern: MovementPattern): string {
    let code = 'def execute_pattern():\n';
    pattern.points?.forEach((point, index) => {
      code += `    controller.move_to(${point.angle})\n`;
      code += `    time.sleep(${point.delay / 1000})\n`;
    });
    code += '\n# Start pattern execution\nexecute_pattern()\n';
    return code;
  }

  private generateCompositePatternCode(pattern: MovementPattern): string {
    let code = 'def execute_pattern():\n';
    pattern.sequences?.forEach(sequence => {
      code += `    # Sequence: ${sequence.name}\n`;
      sequence.points.forEach(point => {
        if (sequence.type === 'smooth') {
          code += `    controller.move_to(${point.angle}, duration=${point.delay / 1000})\n`;
          code += '    time.sleep(0.01)\n';
        } else {
          code += `    controller.move_to(${point.angle})\n`;
          code += `    time.sleep(${point.delay / 1000})\n`;
        }
      });
    });
    code += '\n# Start pattern execution\nexecute_pattern()\n';
    return code;
  }

  async executePattern(pattern: MovementPattern, servos: ServoConfiguration[]): Promise<void> {
    try {
      if (!this.validatePatternWithConfig(pattern, servos)) {
        throw new Error('Pattern validation failed');
      }

      // Emit event to start pattern execution
      EventBus.emit('pattern:execute', pattern);

      // Simulate pattern execution
      const points = pattern.points || [];
      const sequences = pattern.sequences || [];

      if (points.length > 0) {
        for (const point of points) {
          await new Promise(resolve => setTimeout(resolve, point.delay));
          // Update servo position
          EventBus.emit('servo:update', {
            ...servos[0],
            initialPosition: point.angle
          });
        }
      }

      if (sequences.length > 0) {
        for (const sequence of sequences) {
          for (const point of sequence.points) {
            await new Promise(resolve => setTimeout(resolve, point.delay));
            // Update servo position
            EventBus.emit('servo:update', {
              ...servos[0],
              initialPosition: point.angle
            });
          }
        }
      }
    } catch (error) {
      EventBus.emit('error', error as Error);
    }
  }
}
