import { RobotTemplate, MovementPattern } from '../types/servo';

// Configuration interface for pattern parameters
interface PatternConfig {
  baseSpeed: number;      // Base speed multiplier
  precision: number;      // Precision level (1-10)
  forceLevel: number;     // Force level (1-10)
  repeatCount: number;    // Number of repetitions
  pauseDuration: number;  // Pause between repetitions
}

// Default configuration
const defaultConfig: PatternConfig = {
  baseSpeed: 1,
  precision: 5,
  forceLevel: 5,
  repeatCount: 1,
  pauseDuration: 500
};

// Function to generate configurable patterns
function generatePattern(points: Array<{angle: number, delay: number}>, config: PatternConfig = defaultConfig) {
  return points.map(point => ({
    angle: point.angle,
    delay: Math.round(point.delay * (11 - config.precision) / config.baseSpeed)
  }));
}

// Enhanced specialized patterns for specific tasks
const specializedPatterns: MovementPattern[] = [
  {
    name: 'PCB Assembly',
    points: [
      { angle: 90, delay: 300 },   // Home position
      { angle: 45, delay: 200 },   // Component pickup
      { angle: 60, delay: 500 },   // Visual inspection
      { angle: 30, delay: 300 },   // Placement alignment
      { angle: 15, delay: 200 },   // Fine adjustment
      { angle: 0, delay: 400 }     // Place component
    ],
    type: 'stepped',
    config: {
      baseSpeed: 0.8,
      precision: 9,
      forceLevel: 3,
      repeatCount: 1,
      pauseDuration: 300
    }
  },
  {
    name: 'Laboratory Pipetting',
    points: [
      { angle: 90, delay: 400 },   // Start position
      { angle: 45, delay: 300 },   // Lower to source
      { angle: 40, delay: 500 },   // Sample uptake
      { angle: 90, delay: 400 },   // Lift and move
      { angle: 45, delay: 300 },   // Lower to target
      { angle: 40, delay: 500 }    // Sample release
    ],
    type: 'smooth',
    config: {
      baseSpeed: 0.7,
      precision: 10,
      forceLevel: 2,
      repeatCount: 1,
      pauseDuration: 200
    }
  },
  {
    name: 'Camera Stabilization',
    points: Array.from({ length: 10 }, (_, i) => ({
      angle: 90 + Math.sin(i * Math.PI / 5) * 5,  // Micro-adjustments
      delay: 100
    })),
    type: 'smooth',
    loop: true,
    config: {
      baseSpeed: 1.2,
      precision: 8,
      forceLevel: 4,
      repeatCount: Infinity,
      pauseDuration: 0
    }
  }
];

// Combination patterns using multiple movement types
const combinationPatterns: MovementPattern[] = [
  {
    name: 'Complex Assembly',
    sequences: [
      {
        name: 'Rough Positioning',
        points: [
          { angle: 90, delay: 300 },
          { angle: 45, delay: 500 }
        ],
        type: 'smooth'
      },
      {
        name: 'Fine Adjustment',
        points: [
          { angle: 43, delay: 200 },
          { angle: 44, delay: 200 },
          { angle: 45, delay: 200 }
        ],
        type: 'stepped'
      },
      {
        name: 'Final Placement',
        points: [
          { angle: 45, delay: 500 },
          { angle: 90, delay: 300 }
        ],
        type: 'smooth'
      }
    ],
    type: 'composite',
    config: {
      baseSpeed: 0.9,
      precision: 8,
      forceLevel: 6,
      repeatCount: 1,
      pauseDuration: 400
    }
  },
  {
    name: 'Advanced Pick and Place',
    sequences: [
      {
        name: 'Approach',
        points: generatePattern([
          { angle: 90, delay: 300 },
          { angle: 45, delay: 500 }
        ], { baseSpeed: 1.2, precision: 7, forceLevel: 5, repeatCount: 1, pauseDuration: 200 })
      },
      {
        name: 'Grasp',
        points: generatePattern([
          { angle: 45, delay: 200 },
          { angle: 40, delay: 300 }
        ], { baseSpeed: 0.8, precision: 9, forceLevel: 7, repeatCount: 1, pauseDuration: 300 })
      },
      {
        name: 'Transport',
        points: generatePattern([
          { angle: 90, delay: 400 },
          { angle: 135, delay: 500 }
        ], { baseSpeed: 1.5, precision: 6, forceLevel: 4, repeatCount: 1, pauseDuration: 200 })
      }
    ],
    type: 'composite'
  }
];

// Enhanced hand patterns with configuration
const enhancedHandPatterns: MovementPattern[] = [
  {
    name: 'Adaptive Grasping',
    sequences: [
      {
        name: 'Initial Touch',
        points: generatePattern([
          { angle: 10, delay: 200 },
          { angle: 20, delay: 300 }
        ], { baseSpeed: 0.7, precision: 8, forceLevel: 3, repeatCount: 1, pauseDuration: 200 })
      },
      {
        name: 'Force Sensing',
        points: generatePattern([
          { angle: 30, delay: 200 },
          { angle: 40, delay: 300 }
        ], { baseSpeed: 0.5, precision: 9, forceLevel: 4, repeatCount: 1, pauseDuration: 300 })
      },
      {
        name: 'Secure Grip',
        points: generatePattern([
          { angle: 50, delay: 400 },
          { angle: 60, delay: 500 }
        ], { baseSpeed: 0.6, precision: 7, forceLevel: 8, repeatCount: 1, pauseDuration: 400 })
      }
    ],
    type: 'composite',
    config: {
      baseSpeed: 0.8,
      precision: 9,
      forceLevel: 6,
      repeatCount: 1,
      pauseDuration: 300
    }
  },
  {
    name: 'Musical Instrument',
    sequences: [
      {
        name: 'Chord',
        points: generatePattern([
          { angle: 30, delay: 100 },
          { angle: 60, delay: 100 },
          { angle: 90, delay: 100 }
        ], { baseSpeed: 1.2, precision: 8, forceLevel: 4, repeatCount: 1, pauseDuration: 100 })
      },
      {
        name: 'Arpeggio',
        points: generatePattern([
          { angle: 30, delay: 150 },
          { angle: 45, delay: 150 },
          { angle: 60, delay: 150 },
          { angle: 75, delay: 150 }
        ], { baseSpeed: 1.5, precision: 7, forceLevel: 3, repeatCount: 1, pauseDuration: 150 })
      }
    ],
    type: 'composite',
    loop: true
  }
];

// Specialized arm patterns with configuration
const enhancedArmPatterns: MovementPattern[] = [
  {
    name: 'Precision Machining',
    sequences: [
      {
        name: 'Tool Approach',
        points: generatePattern([
          { angle: 90, delay: 300 },
          { angle: 45, delay: 500 }
        ], { baseSpeed: 0.6, precision: 10, forceLevel: 3, repeatCount: 1, pauseDuration: 200 })
      },
      {
        name: 'Cutting Path',
        points: generatePattern([
          { angle: 46, delay: 200 },
          { angle: 47, delay: 200 },
          { angle: 48, delay: 200 }
        ], { baseSpeed: 0.4, precision: 10, forceLevel: 8, repeatCount: 1, pauseDuration: 100 })
      },
      {
        name: 'Tool Retract',
        points: generatePattern([
          { angle: 90, delay: 300 }
        ], { baseSpeed: 1.0, precision: 7, forceLevel: 2, repeatCount: 1, pauseDuration: 200 })
      }
    ],
    type: 'composite'
  },
  {
    name: '3D Printing Support',
    sequences: [
      {
        name: 'Layer Start',
        points: generatePattern([
          { angle: 0, delay: 200 },
          { angle: 45, delay: 300 }
        ], { baseSpeed: 1.0, precision: 9, forceLevel: 4, repeatCount: 1, pauseDuration: 200 })
      },
      {
        name: 'Layer Print',
        points: generatePattern([
          { angle: 90, delay: 400 },
          { angle: 135, delay: 400 },
          { angle: 180, delay: 400 }
        ], { baseSpeed: 0.8, precision: 8, forceLevel: 5, repeatCount: 1, pauseDuration: 300 })
      },
      {
        name: 'Layer Complete',
        points: generatePattern([
          { angle: 90, delay: 300 }
        ], { baseSpeed: 1.2, precision: 7, forceLevel: 3, repeatCount: 1, pauseDuration: 200 })
      }
    ],
    type: 'composite',
    loop: true
  }
];

// Export all patterns
export const allPatterns = {
  specialized: specializedPatterns,
  combination: combinationPatterns,
  enhancedHand: enhancedHandPatterns,
  enhancedArm: enhancedArmPatterns
};

// Common movement patterns that can be used across different robot types
const commonPatterns: MovementPattern[] = [
  {
    name: 'Home Position',
    points: [{ angle: 90, delay: 1000 }],
    type: 'smooth'
  },
  {
    name: 'Wave',
    points: [
      { angle: 45, delay: 500 },
      { angle: 135, delay: 500 },
      { angle: 45, delay: 500 },
      { angle: 135, delay: 500 },
      { angle: 90, delay: 500 }
    ],
    type: 'smooth',
    loop: true
  },
  {
    name: 'Sweep',
    points: [
      { angle: 0, delay: 1000 },
      { angle: 180, delay: 1000 },
      { angle: 0, delay: 1000 }
    ],
    type: 'linear'
  }
];

// Enhanced arm patterns for 6-DOF robotic arm
const armPatterns: MovementPattern[] = [
  {
    name: 'Pick and Place',
    points: [
      { angle: 90, delay: 500 },   // Start position
      { angle: 45, delay: 1000 },  // Lower to pick
      { angle: 90, delay: 500 },   // Lift
      { angle: 135, delay: 1000 }, // Move to place
      { angle: 90, delay: 500 },   // Lower to place
      { angle: 135, delay: 500 },  // Release
      { angle: 90, delay: 500 }    // Return to start
    ],
    type: 'smooth'
  },
  {
    name: 'Assembly Line',
    points: [
      { angle: 0, delay: 1000 },   // Position 1
      { angle: 60, delay: 500 },   // Pick up
      { angle: 90, delay: 1000 },  // Position 2
      { angle: 120, delay: 500 },  // Place
      { angle: 180, delay: 1000 }  // Reset
    ],
    type: 'stepped'
  },
  {
    name: 'Precision Writing',
    points: [
      { angle: 90, delay: 300 },   // Start position
      { angle: 85, delay: 200 },   // Down to surface
      { angle: 95, delay: 300 },   // Draw line
      { angle: 85, delay: 200 },   // Next position
      { angle: 90, delay: 300 }    // Lift
    ],
    type: 'smooth',
    loop: true
  },
  {
    name: 'Spiral Pattern',
    points: Array.from({ length: 36 }, (_, i) => ({
      angle: (i * 10) % 180,
      delay: 100 + (i * 10)
    })),
    type: 'smooth',
    loop: true
  },
  {
    name: 'Quality Inspection',
    points: [
      { angle: 90, delay: 500 },   // Center
      { angle: 45, delay: 1000 },  // Inspect point 1
      { angle: 90, delay: 500 },   // Move
      { angle: 135, delay: 1000 }, // Inspect point 2
      { angle: 90, delay: 500 },   // Move
      { angle: 180, delay: 1000 }, // Inspect point 3
      { angle: 90, delay: 500 }    // Return
    ],
    type: 'stepped'
  },
  {
    name: 'Continuous Palletizing',
    points: [
      { angle: 0, delay: 500 },    // Pick zone
      { angle: 45, delay: 300 },   // Lift
      { angle: 90, delay: 500 },   // Move to pallet 1
      { angle: 135, delay: 300 },  // Place
      { angle: 180, delay: 500 },  // Move to pallet 2
      { angle: 225, delay: 300 },  // Place
      { angle: 270, delay: 500 },  // Move to pallet 3
      { angle: 315, delay: 300 }   // Place
    ],
    type: 'smooth',
    loop: true
  }
];

// Specific patterns for pan-tilt systems
const panTiltPatterns: MovementPattern[] = [
  {
    name: 'Scan Area',
    points: [
      { angle: 0, delay: 500 },    // Left
      { angle: 180, delay: 2000 }, // Right
      { angle: 90, delay: 1000 }   // Center
    ],
    type: 'smooth'
  },
  {
    name: 'Track Object',
    points: [
      { angle: 90, delay: 1000 },  // Center
      { angle: 120, delay: 500 },  // Track right
      { angle: 60, delay: 500 },   // Track left
      { angle: 90, delay: 1000 }   // Return center
    ],
    type: 'smooth',
    loop: true
  }
];

// Specific patterns for delta robots
const deltaPatterns: MovementPattern[] = [
  {
    name: 'Circle',
    points: [
      { angle: 0, delay: 200 },
      { angle: 45, delay: 200 },
      { angle: 90, delay: 200 },
      { angle: 135, delay: 200 },
      { angle: 180, delay: 200 },
      { angle: 225, delay: 200 },
      { angle: 270, delay: 200 },
      { angle: 315, delay: 200 },
      { angle: 0, delay: 200 }
    ],
    type: 'smooth',
    loop: true
  },
  {
    name: 'Pick-Sort-Place',
    points: [
      { angle: 90, delay: 300 },   // Center
      { angle: 45, delay: 500 },   // Pick
      { angle: 90, delay: 300 },   // Lift
      { angle: 135, delay: 500 },  // Sort
      { angle: 180, delay: 500 },  // Place
      { angle: 90, delay: 300 }    // Return
    ],
    type: 'stepped'
  }
];

// Specific patterns for SCARA robots
const scaraPatterns: MovementPattern[] = [
  {
    name: 'Rectangle',
    points: [
      { angle: 0, delay: 500 },    // Corner 1
      { angle: 90, delay: 500 },   // Corner 2
      { angle: 180, delay: 500 },  // Corner 3
      { angle: 270, delay: 500 },  // Corner 4
      { angle: 0, delay: 500 }     // Back to start
    ],
    type: 'linear',
    loop: true
  },
  {
    name: 'Precision Assembly',
    points: [
      { angle: 90, delay: 500 },   // Start
      { angle: 45, delay: 1000 },  // Component 1
      { angle: 90, delay: 500 },   // Transit
      { angle: 135, delay: 1000 }, // Component 2
      { angle: 90, delay: 500 }    // Complete
    ],
    type: 'stepped'
  }
];

// Enhanced hand patterns for 6-DOF robotic hand
const handPatterns: MovementPattern[] = [
  {
    name: 'Power Grasp',
    points: [
      { angle: 0, delay: 500 },    // Full open
      { angle: 90, delay: 1000 },  // Close all fingers
      { angle: 45, delay: 500 }    // Maintain grip
    ],
    type: 'smooth'
  },
  {
    name: 'Precision Pinch',
    points: [
      { angle: 0, delay: 300 },    // Open position
      { angle: 45, delay: 500 },   // Thumb-index pinch
      { angle: 30, delay: 1000 }   // Fine adjust
    ],
    type: 'stepped'
  },
  {
    name: 'Wave Hello',
    points: [
      { angle: 45, delay: 300 },
      { angle: 90, delay: 300 },
      { angle: 45, delay: 300 },
      { angle: 90, delay: 300 }
    ],
    type: 'smooth',
    loop: true
  },
  {
    name: 'Finger Count',
    points: [
      { angle: 0, delay: 500 },    // One finger
      { angle: 45, delay: 500 },   // Two fingers
      { angle: 90, delay: 500 },   // Three fingers
      { angle: 135, delay: 500 },  // Four fingers
      { angle: 180, delay: 500 }   // Five fingers
    ],
    type: 'stepped'
  },
  {
    name: 'Typing Motion',
    points: [
      { angle: 30, delay: 100 },   // Hover
      { angle: 45, delay: 50 },    // Press
      { angle: 30, delay: 100 },   // Release
      { angle: 15, delay: 100 }    // Move to next
    ],
    type: 'stepped',
    loop: true
  },
  {
    name: 'Piano Playing',
    points: [
      { angle: 30, delay: 200 },   // First key
      { angle: 45, delay: 100 },   // Press
      { angle: 60, delay: 200 },   // Second key
      { angle: 75, delay: 100 },   // Press
      { angle: 90, delay: 200 }    // Third key
    ],
    type: 'smooth',
    loop: true
  },
  {
    name: 'Rock Paper Scissors',
    points: [
      { angle: 0, delay: 500 },    // Rock (closed fist)
      { angle: 180, delay: 500 },  // Paper (open hand)
      { angle: 90, delay: 500 }    // Scissors (two fingers)
    ],
    type: 'stepped'
  },
  {
    name: 'Finger Walking',
    points: [
      { angle: 30, delay: 200 },   // Thumb and index down
      { angle: 60, delay: 200 },   // Move forward
      { angle: 90, delay: 200 },   // Middle and ring down
      { angle: 120, delay: 200 }   // Move forward
    ],
    type: 'smooth',
    loop: true
  },
  {
    name: 'Sign Language Alphabet',
    points: [
      { angle: 0, delay: 1000 },   // A
      { angle: 45, delay: 1000 },  // B
      { angle: 90, delay: 1000 },  // C
      { angle: 135, delay: 1000 }, // D
      { angle: 180, delay: 1000 }  // E
    ],
    type: 'stepped'
  },
  {
    name: 'Precision Assembly',
    points: [
      { angle: 0, delay: 500 },    // Open grip
      { angle: 30, delay: 300 },   // Position fingers
      { angle: 45, delay: 1000 },  // Grasp component
      { angle: 60, delay: 500 },   // Fine adjust
      { angle: 30, delay: 300 },   // Release
      { angle: 0, delay: 500 }     // Reset
    ],
    type: 'smooth'
  }
];

export const robotTemplates: RobotTemplate[] = [
  {
    name: '6-DOF Robotic Arm',
    type: 'arm',
    servos: [
      {
        channel: 0,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        speed: 100,
        acceleration: 50,
        inverted: false,
        centerOffset: 0
      },
      {
        channel: 1,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        speed: 80,
        acceleration: 40,
        inverted: false,
        centerOffset: 0
      },
      {
        channel: 2,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        speed: 60,
        acceleration: 30,
        inverted: false,
        centerOffset: 0
      },
      {
        channel: 3,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        speed: 100,
        acceleration: 50,
        inverted: false,
        centerOffset: 0
      },
      {
        channel: 4,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        speed: 120,
        acceleration: 60,
        inverted: false,
        centerOffset: 0
      },
      {
        channel: 5,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        speed: 150,
        acceleration: 75,
        inverted: false,
        centerOffset: 0
      }
    ],
    defaultPatterns: [...commonPatterns, ...armPatterns],
    advancedFeatures: {
      positionFeedback: true,
      torqueControl: true,
      softLimits: true,
      emergencyStop: true,
      networkControl: true,
      dataLogging: true
    }
  },
  {
    name: 'Delta Robot',
    type: 'delta',
    servos: [
      {
        channel: 0,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        speed: 200,
        acceleration: 100,
        inverted: false,
        centerOffset: 0
      },
      {
        channel: 1,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        speed: 200,
        acceleration: 100,
        inverted: false,
        centerOffset: 0
      },
      {
        channel: 2,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        speed: 200,
        acceleration: 100,
        inverted: false,
        centerOffset: 0
      }
    ],
    defaultPatterns: [...commonPatterns, ...deltaPatterns],
    advancedFeatures: {
      positionFeedback: true,
      torqueControl: true,
      softLimits: true,
      emergencyStop: true,
      networkControl: true,
      dataLogging: true
    }
  },
  {
    name: 'SCARA Robot',
    type: 'scara',
    servos: [
      {
        channel: 0,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        speed: 150,
        acceleration: 75,
        inverted: false,
        centerOffset: 0
      },
      {
        channel: 1,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        speed: 150,
        acceleration: 75,
        inverted: false,
        centerOffset: 0
      },
      {
        channel: 2,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        speed: 100,
        acceleration: 50,
        inverted: false,
        centerOffset: 0
      },
      {
        channel: 3,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        speed: 200,
        acceleration: 100,
        inverted: false,
        centerOffset: 0
      }
    ],
    defaultPatterns: [...commonPatterns, ...scaraPatterns],
    advancedFeatures: {
      positionFeedback: true,
      torqueControl: true,
      softLimits: true,
      emergencyStop: true,
      networkControl: true,
      dataLogging: true
    }
  },
  {
    name: 'Pan-Tilt Camera Mount',
    type: 'pan-tilt',
    servos: [
      {
        channel: 0,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        speed: 50,
        acceleration: 25,
        inverted: false,
        centerOffset: 0
      },
      {
        channel: 1,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        speed: 50,
        acceleration: 25,
        inverted: false,
        centerOffset: 0
      }
    ],
    defaultPatterns: [...commonPatterns, ...panTiltPatterns],
    advancedFeatures: {
      positionFeedback: true,
      torqueControl: false,
      softLimits: true,
      emergencyStop: true,
      networkControl: true,
      dataLogging: true
    }
  },
  {
    name: 'Hexapod Robot',
    type: 'arm',
    servos: Array(18).fill(0).map((_, index) => ({
      channel: index,
      minPulse: 500,
      maxPulse: 2500,
      initialPosition: 90,
      speed: 120,
      acceleration: 60,
      inverted: false,
      centerOffset: 0
    })),
    defaultPatterns: [
      ...commonPatterns,
      {
        name: 'Walk Forward',
        points: [
          { angle: 60, delay: 200 },
          { angle: 120, delay: 200 },
          { angle: 90, delay: 200 }
        ],
        type: 'stepped',
        loop: true
      },
      {
        name: 'Turn Right',
        points: [
          { angle: 45, delay: 300 },
          { angle: 90, delay: 300 },
          { angle: 135, delay: 300 }
        ],
        type: 'stepped',
        loop: true
      }
    ],
    advancedFeatures: {
      positionFeedback: true,
      torqueControl: true,
      softLimits: true,
      emergencyStop: true,
      networkControl: true,
      dataLogging: true
    }
  },
  {
    name: '6-DOF Robotic Hand',
    type: 'hand',
    servos: [
      {
        channel: 0,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 0,
        speed: 100,
        acceleration: 50,
        inverted: false,
        centerOffset: 0,
        description: 'Thumb Base Rotation'
      },
      {
        channel: 1,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 0,
        speed: 80,
        acceleration: 40,
        inverted: false,
        centerOffset: 0,
        description: 'Thumb Flexion'
      },
      {
        channel: 2,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 0,
        speed: 80,
        acceleration: 40,
        inverted: false,
        centerOffset: 0,
        description: 'Index Finger'
      },
      {
        channel: 3,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 0,
        speed: 80,
        acceleration: 40,
        inverted: false,
        centerOffset: 0,
        description: 'Middle Finger'
      },
      {
        channel: 4,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 0,
        speed: 80,
        acceleration: 40,
        inverted: false,
        centerOffset: 0,
        description: 'Ring Finger'
      },
      {
        channel: 5,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 0,
        speed: 80,
        acceleration: 40,
        inverted: false,
        centerOffset: 0,
        description: 'Pinky Finger'
      }
    ],
    defaultPatterns: [...commonPatterns, ...handPatterns],
    advancedFeatures: {
      positionFeedback: true,
      torqueControl: true,
      softLimits: true,
      emergencyStop: true,
      networkControl: true,
      dataLogging: true,
      forceControl: true,
      gestureLearning: true
    }
  },
  {
    name: 'Custom 2-DOF Template',
    type: 'custom',
    servos: [
      {
        channel: 0,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        speed: 100,
        acceleration: 50,
        inverted: false,
        centerOffset: 0,
        description: 'Joint 1'
      },
      {
        channel: 1,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        speed: 100,
        acceleration: 50,
        inverted: false,
        centerOffset: 0,
        description: 'Joint 2'
      }
    ],
    defaultPatterns: [
      ...commonPatterns,
      {
        name: 'Custom Movement 1',
        points: [
          { angle: 0, delay: 500 },
          { angle: 90, delay: 500 },
          { angle: 180, delay: 500 }
        ],
        type: 'smooth'
      }
    ],
    advancedFeatures: {
      positionFeedback: true,
      torqueControl: true,
      softLimits: true,
      emergencyStop: true,
      networkControl: true,
      dataLogging: true
    }
  },
  {
    name: 'Custom 4-DOF Template',
    type: 'custom',
    servos: [
      {
        channel: 0,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        speed: 100,
        acceleration: 50,
        inverted: false,
        centerOffset: 0,
        description: 'Base Joint'
      },
      {
        channel: 1,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        speed: 100,
        acceleration: 50,
        inverted: false,
        centerOffset: 0,
        description: 'Shoulder Joint'
      },
      {
        channel: 2,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        speed: 100,
        acceleration: 50,
        inverted: false,
        centerOffset: 0,
        description: 'Elbow Joint'
      },
      {
        channel: 3,
        minPulse: 500,
        maxPulse: 2500,
        initialPosition: 90,
        speed: 100,
        acceleration: 50,
        inverted: false,
        centerOffset: 0,
        description: 'Wrist Joint'
      }
    ],
    defaultPatterns: [
      ...commonPatterns,
      {
        name: 'Custom Sequence',
        points: [
          { angle: 45, delay: 500 },
          { angle: 90, delay: 500 },
          { angle: 135, delay: 500 },
          { angle: 90, delay: 500 }
        ],
        type: 'smooth',
        loop: true
      }
    ],
    advancedFeatures: {
      positionFeedback: true,
      torqueControl: true,
      softLimits: true,
      emergencyStop: true,
      networkControl: true,
      dataLogging: true
    }
  }
];
