import { ServoConfig, PresetPosition, MovementPattern } from '../types/servo';

export interface ExportData {
  config: ServoConfig;
  presets: PresetPosition[];
  patterns: MovementPattern[];
  metadata: {
    version: string;
    exportDate: string;
    platform: string;
  };
}

export const exportConfiguration = (
  config: ServoConfig,
  presets: PresetPosition[],
  patterns: MovementPattern[],
  platform: string
): string => {
  const exportData: ExportData = {
    config,
    presets,
    patterns,
    metadata: {
      version: '1.0',
      exportDate: new Date().toISOString(),
      platform,
    },
  };

  return JSON.stringify(exportData, null, 2);
};

export const validateImport = (data: unknown): ExportData | null => {
  try {
    const parsed = data as ExportData;
    
    // Basic validation
    if (!parsed.config || !parsed.presets || !parsed.patterns || !parsed.metadata) {
      return null;
    }

    // Validate config
    if (
      typeof parsed.config.pwmMin !== 'number' ||
      typeof parsed.config.pwmMax !== 'number' ||
      typeof parsed.config.angleMin !== 'number' ||
      typeof parsed.config.angleMax !== 'number'
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};