import { ServoConfiguration, MovementPattern, JetsonConfig, AdvancedFeatures } from '../types/servo';

export interface AppState {
  servos: ServoConfiguration[];
  patterns: MovementPattern[];
  jetsonConfig: JetsonConfig;
  advancedFeatures: AdvancedFeatures;
  activePattern?: MovementPattern;
}

class StateManagerClass {
  private state: AppState;
  private listeners: ((state: AppState) => void)[];

  constructor() {
    this.listeners = [];
    this.state = this.loadInitialState();
  }

  private loadInitialState(): AppState {
    try {
      const savedState = localStorage.getItem('appState');
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (error) {
      console.error('Failed to load state:', error);
    }

    return {
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
    };
  }

  getState(): AppState {
    return { ...this.state };
  }

  setState(newState: Partial<AppState>) {
    this.state = {
      ...this.state,
      ...newState,
      servos: newState.servos?.map(servo => ({
        ...servo,
        speed: servo.speed || 100,
        acceleration: servo.acceleration || 50,
        enabled: servo.enabled ?? true,
        programs: servo.programs || [],
        limits: {
          minAngle: servo.limits?.minAngle || 0,
          maxAngle: servo.limits?.maxAngle || 180,
          minPulse: servo.limits?.minPulse || 500,
          maxPulse: servo.limits?.maxPulse || 2500,
          maxSpeed: servo.limits?.maxSpeed || 360,
          maxAcceleration: servo.limits?.maxAcceleration || 720
        },
        calibration: {
          centerOffset: servo.calibration?.centerOffset || 0,
          pulseOffset: servo.calibration?.pulseOffset || 0,
          angleMultiplier: servo.calibration?.angleMultiplier || 1
        }
      })) || this.state.servos
    };
    this.saveState();
    this.notifyListeners();
  }

  private saveState() {
    try {
      localStorage.setItem('appState', JSON.stringify(this.state));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }

  subscribe(listener: (state: AppState) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Specific state updates
  updateServo(index: number, servo: ServoConfiguration) {
    const servos = [...this.state.servos];
    servos[index] = servo;
    this.setState({ servos });
  }

  addServo(servo: ServoConfiguration) {
    this.setState({
      servos: [...this.state.servos, servo]
    });
  }

  removeServo(index: number) {
    const servos = [...this.state.servos];
    servos.splice(index, 1);
    this.setState({ servos });
  }

  updatePattern(pattern: MovementPattern) {
    const patterns = [...this.state.patterns];
    const index = patterns.findIndex(p => p.name === pattern.name);
    if (index > -1) {
      patterns[index] = pattern;
    } else {
      patterns.push(pattern);
    }
    this.setState({ patterns });
  }

  setActivePattern(pattern: MovementPattern | undefined) {
    this.setState({ activePattern: pattern });
  }

  updateJetsonConfig(config: Partial<JetsonConfig>) {
    this.setState({
      jetsonConfig: {
        ...this.state.jetsonConfig,
        ...config
      }
    });
  }

  updateAdvancedFeatures(features: Partial<AdvancedFeatures>) {
    this.setState({
      advancedFeatures: {
        ...this.state.advancedFeatures,
        ...features
      }
    });
  }
}

export const StateManager = new StateManagerClass();
