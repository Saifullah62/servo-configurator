import { ServoConfiguration, MovementPattern } from '../types/servo';

export type EventTypes = {
  'servo:update': ServoConfiguration;
  'servo:test': { type: 'range' | 'speed' | 'accuracy' | 'endurance'; servoId: number };
  'pattern:execute': MovementPattern;
  'pattern:update': MovementPattern;
  'code:generate': void;
  'error': Error;
};

export type EventCallback<T extends keyof EventTypes> = (data: EventTypes[T]) => void;

class EventBusClass {
  private events: Map<keyof EventTypes, EventCallback<any>[]>;

  constructor() {
    this.events = new Map();
  }

  subscribe<T extends keyof EventTypes>(event: T, callback: EventCallback<T>) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.events.get(event)!;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  emit<T extends keyof EventTypes>(event: T, data: EventTypes[T]) {
    if (this.events.has(event)) {
      this.events.get(event)!.forEach(callback => callback(data));
    }
  }

  clear() {
    this.events.clear();
  }
}

export const EventBus = new EventBusClass();
