export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug'
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  source?: string;
}

class LoggerClass {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private listeners: ((entry: LogEntry) => void)[] = [];

  log(level: LogLevel, message: string, data?: any, source?: string) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      source
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    this.notifyListeners(entry);
    this.consoleLog(entry);
  }

  info(message: string, data?: any, source?: string) {
    this.log(LogLevel.INFO, message, data, source);
  }

  warn(message: string, data?: any, source?: string) {
    this.log(LogLevel.WARN, message, data, source);
  }

  error(message: string, data?: any, source?: string) {
    this.log(LogLevel.ERROR, message, data, source);
  }

  debug(message: string, data?: any, source?: string) {
    this.log(LogLevel.DEBUG, message, data, source);
  }

  private consoleLog(entry: LogEntry) {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const source = entry.source ? `[${entry.source}]` : '';
    
    switch (entry.level) {
      case LogLevel.INFO:
        console.log(`${timestamp} ${source} ${entry.message}`, entry.data || '');
        break;
      case LogLevel.WARN:
        console.warn(`${timestamp} ${source} ${entry.message}`, entry.data || '');
        break;
      case LogLevel.ERROR:
        console.error(`${timestamp} ${source} ${entry.message}`, entry.data || '');
        break;
      case LogLevel.DEBUG:
        console.debug(`${timestamp} ${source} ${entry.message}`, entry.data || '');
        break;
    }
  }

  subscribe(listener: (entry: LogEntry) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(entry: LogEntry) {
    this.listeners.forEach(listener => listener(entry));
  }

  getLogs() {
    return [...this.logs];
  }

  clear() {
    this.logs = [];
  }

  setMaxLogs(max: number) {
    this.maxLogs = max;
    if (this.logs.length > max) {
      this.logs = this.logs.slice(-max);
    }
  }
}

export const Logger = new LoggerClass();
