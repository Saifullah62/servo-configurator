# API Reference

## Core Components

### StateManager

The central state management system that handles the application's state.

```typescript
interface StateManager {
  getState(): AppState;
  setState(newState: Partial<AppState>): void;
  subscribe(listener: (state: AppState) => void): () => void;
  updateServo(index: number, config: ServoConfiguration): void;
}
```

### EventBus

Event management system for component communication.

```typescript
interface EventBus {
  subscribe(event: string, callback: Function): () => void;
  emit(event: string, data?: any): void;
  unsubscribe(event: string, callback: Function): void;
}
```

## Types

### ServoConfiguration

```typescript
interface ServoConfiguration {
  channel: number;
  enabled: boolean;
  description?: string;
  minPulse: number;
  maxPulse: number;
  speed: number;
  acceleration: number;
  initialPosition: number;
  inverted: boolean;
  limits: {
    minAngle: number;
    maxAngle: number;
    minPulse: number;
    maxPulse: number;
    maxSpeed: number;
    maxAcceleration: number;
  };
  calibration: {
    centerOffset: number;
    pulseOffset: number;
    angleMultiplier: number;
  };
  programs: MovementPattern[];
}
```

### MovementPattern

```typescript
interface MovementPattern {
  name: string;
  type: string;
  description?: string;
  config: PatternConfig;
  steps: PatternStep[];
}

interface PatternConfig {
  baseSpeed: number;
  precision: number;
  forceLevel: number;
  repeatCount: number;
  pauseDuration: number;
}
```

## Events

### Servo Events

- `servo:update` - Emitted when a servo configuration is updated
- `servo:error` - Emitted when a servo error occurs
- `servo:connected` - Emitted when a servo is connected
- `servo:disconnected` - Emitted when a servo is disconnected

### Pattern Events

- `pattern:select` - Emitted when a pattern is selected
- `pattern:execute` - Emitted when a pattern execution starts
- `pattern:complete` - Emitted when a pattern execution completes
- `pattern:error` - Emitted when a pattern execution fails

### System Events

- `error` - General error event
- `state:change` - Emitted when application state changes
- `config:save` - Emitted when configuration is saved
- `config:load` - Emitted when configuration is loaded

## Error Handling

### ErrorHandler

```typescript
interface ErrorHandler {
  handleError(error: Error, type?: ErrorType): void;
  handleServoError(error: Error): void;
  handlePatternError(error: Error): void;
}

enum ErrorType {
  SERVO = 'servo',
  PATTERN = 'pattern',
  SYSTEM = 'system',
}
```

## Code Generation

### Templates

Code generation templates are located in `/src/templates` and support:

- Python code for Jetson platform
- Test scripts
- Configuration files
- Movement pattern implementations

### Integration Service

```typescript
interface IntegrationService {
  generateCode(config: ServoConfiguration[]): string;
  generateTests(config: ServoConfiguration[]): string;
  validateConfiguration(config: ServoConfiguration[]): boolean;
}
```
