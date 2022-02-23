// eslint-disable-next-line @typescript-eslint/ban-types
export interface IEventEmitter<T extends Record<string, Function>> {
  on: <E extends keyof T>(event: E, cb: T[E]) => () => void;
  once: <E extends keyof T>(event: E, cb: T[E]) => void;
  release: <E extends keyof T>(event: E, cb?: T[E]) => void;
  reset: () => void;
  emit: <E extends keyof T>(event: E, ...args: unknown[]) => void;
  memory: <E extends keyof T>(event: E) => void;
  clearMemory: <E extends keyof T>(event: E) => void;
}
