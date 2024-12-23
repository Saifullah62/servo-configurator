## Servo Control API Documentation

### Core Components

#### ServoConfig

Configuration object for servo motor parameters:

- `pwmMin`: Minimum PWM value (µs)
- `pwmMax`: Maximum PWM value (µs)
- `angleMin`: Minimum angle (degrees)
- `angleMax`: Maximum angle (degrees)
- `speed`: Movement speed (0-100%)
- `acceleration`: Acceleration rate (0-100%)
- `centerOffset`: Center position offset (degrees)

#### Movement Control

##### useServoControl Hook

```typescript
const { currentPosition, isMoving, moveTo, runPattern } =
  useServoControl(config);
```

- `currentPosition`: Current angle of the servo
- `isMoving`: Boolean indicating if servo is in motion
- `moveTo(angle: number)`: Move to specific angle
- `runPattern(pattern: MovementPattern)`: Execute movement pattern

#### Presets and Patterns

##### PresetPosition

```typescript
interface PresetPosition {
  name: string;
  angle: number;
}
```

##### MovementPattern

```typescript
interface MovementPattern {
  name: string;
  points: { angle: number; delay: number }[];
}
```

### Utility Functions

#### Servo Calculations

- `calculatePWM(angle: number, config: ServoConfig)`: Convert angle to PWM
- `validateAngle(angle: number, config: ServoConfig)`: Ensure angle is within limits

#### Configuration Management

- `validateServoConfig(config: ServoConfig)`: Validate configuration
- `exportConfiguration(config, presets, patterns, platform)`: Export settings
- `validateImport(data: unknown)`: Validate imported configuration

### Platform Support

Currently supported platforms:

- Arduino
- Raspberry Pi
- Jetson

### Error Handling

All functions include proper error handling and validation:

- Configuration validation
- Angle range checking
- Import/export validation
- Movement boundary checks
