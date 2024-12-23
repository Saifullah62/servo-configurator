import { ServoConfig } from '../types/servo';
import { MultiServoConfig } from '../types/templates';

export interface ConfigDifference {
  field: string;
  config1Value: any;
  config2Value: any;
}

export function compareConfigs(config1: ServoConfig, config2: ServoConfig): ConfigDifference[] {
  const differences: ConfigDifference[] = [];
  const fields = Object.keys(config1) as (keyof ServoConfig)[];

  fields.forEach((field) => {
    if (config1[field] !== config2[field]) {
      differences.push({
        field,
        config1Value: config1[field],
        config2Value: config2[field],
      });
    }
  });

  return differences;
}

export function compareMultiServoConfigs(
  config1: MultiServoConfig,
  config2: MultiServoConfig
): { [servoId: string]: ConfigDifference[] } {
  const allServoIds = new Set([
    ...Object.keys(config1.servos),
    ...Object.keys(config2.servos),
  ]);

  const differences: { [servoId: string]: ConfigDifference[] } = {};

  allServoIds.forEach((servoId) => {
    const servo1 = config1.servos[servoId]?.config;
    const servo2 = config2.servos[servoId]?.config;

    if (!servo1 || !servo2) {
      differences[servoId] = [{
        field: 'servo',
        config1Value: servo1 ? 'present' : 'missing',
        config2Value: servo2 ? 'present' : 'missing',
      }];
    } else {
      differences[servoId] = compareConfigs(servo1, servo2);
    }
  });

  return differences;
}
