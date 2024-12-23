import { describe, it, expect, beforeEach } from 'vitest';
import { StateManager } from '../utils/stateManager';
import { EventBus } from '../utils/eventBus';
import { IntegrationService } from '../services/integrationService';
import { Logger } from '../utils/logger';
import { ErrorHandler } from '../utils/errorHandler';

describe('Integration Tests', () => {
  let stateManager: typeof StateManager;
  let integrationService: IntegrationService;

  beforeEach(() => {
    // Reset state before each test
    StateManager.setState({
      servos: [],
      patterns: [],
      jetsonConfig: {
        i2cBus: 1,
        i2cAddress: 0x40,
        pwmFrequency: 50,
        controlMethod: 'i2c'
      },
      advancedFeatures: {
        positionFeedback: false,
        torqueControl: false,
        softLimits: true,
        emergencyStop: true,
        networkControl: false,
        dataLogging: false
      }
    });

    integrationService = IntegrationService.getInstance();
  });

  describe('State Management', () => {
    it('should properly manage servo state', () => {
      const servo = {
        channel: 0,
        name: 'Test Servo',
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        inverted: false,
        limits: {
          minAngle: 0,
          maxAngle: 180
        }
      };

      StateManager.addServo(servo);
      const state = StateManager.getState();
      expect(state.servos).toHaveLength(1);
      expect(state.servos[0]).toEqual(servo);
    });

    it('should update servo configuration', () => {
      const servo = {
        channel: 0,
        name: 'Test Servo',
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        inverted: false,
        limits: {
          minAngle: 0,
          maxAngle: 180
        }
      };

      StateManager.addServo(servo);
      
      const updatedServo = {
        ...servo,
        name: 'Updated Servo',
        initialPosition: 45
      };

      StateManager.updateServo(0, updatedServo);
      const state = StateManager.getState();
      expect(state.servos[0].name).toBe('Updated Servo');
      expect(state.servos[0].initialPosition).toBe(45);
    });
  });

  describe('Event Bus', () => {
    it('should properly emit and receive events', (done) => {
      const testData = { test: 'data' };
      
      EventBus.subscribe('test:event', (data) => {
        expect(data).toEqual(testData);
        done();
      });

      EventBus.emit('test:event', testData);
    });

    it('should handle multiple subscribers', () => {
      let count = 0;
      const handler = () => count++;

      EventBus.subscribe('test:multiple', handler);
      EventBus.subscribe('test:multiple', handler);
      EventBus.emit('test:multiple');

      expect(count).toBe(2);
    });
  });

  describe('Integration Service', () => {
    it('should validate patterns against servo configuration', () => {
      const servo = {
        channel: 0,
        name: 'Test Servo',
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        inverted: false,
        limits: {
          minAngle: 0,
          maxAngle: 180
        }
      };

      const validPattern = {
        name: 'Test Pattern',
        type: 'smooth',
        points: [
          { angle: 45, delay: 1000 },
          { angle: 90, delay: 1000 }
        ]
      };

      const invalidPattern = {
        name: 'Invalid Pattern',
        type: 'smooth',
        points: [
          { angle: -45, delay: 1000 },
          { angle: 200, delay: 1000 }
        ]
      };

      StateManager.addServo(servo);
      
      expect(integrationService.validatePatternWithConfig(validPattern, [servo])).toBe(true);
      expect(integrationService.validatePatternWithConfig(invalidPattern, [servo])).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should properly handle and log errors', () => {
      const errorMessage = 'Test error';
      const error = new Error(errorMessage);
      
      const logSpy = vi.spyOn(Logger, 'error');
      ErrorHandler.handleError(error);

      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
    });
  });
});
