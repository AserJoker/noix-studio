import { IEventEmitter } from "@/types";
const emitterCache = new Map<
  string | symbol,
  // eslint-disable-next-line @typescript-eslint/ban-types
  IEventEmitter<{ [key: string]: Function }>
>();
export const useEventEmitter = <
  // callback need dep event name
  // eslint-disable-next-line @typescript-eslint/ban-types
  T extends Record<string, Function> = Record<
    string,
    (...args: unknown[]) => unknown
  >
>(
  key?: string | symbol
): IEventEmitter<T> => {
  if (key) {
    if (emitterCache.has(key)) {
      return emitterCache.get(key) as IEventEmitter<T>;
    }
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  const callbacks: Record<string, Function[]> = {};
  const on = <E extends keyof T>(event: E, cb: T[E]) => {
    const cbs = callbacks[event as string] || [];
    cbs.push(cb);
    callbacks[event as string] = cbs;
    return () => release(event, cb);
  };
  const emit = <E extends keyof T>(event: E, ...args: unknown[]) => {
    const cbs = callbacks[event as string] || [];
    cbs.forEach((cb) => {
      cb(...args);
    });
  };
  const release = <E extends keyof T>(event: E, cb: T[E]) => {
    const cbs = callbacks[event as string];
    if (cbs) {
      const index = cbs.findIndex((item) => item === cb);
      if (index !== -1) {
        cbs.splice(index, 1);
      }
    }
  };
  const once = <E extends keyof T>(event: E, cb: T[E]) => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const wrapper: Function = (...args: unknown[]) => {
      const res = cb(...args);
      release(event, wrapper as T[E]);
      return res;
    };
    const cbs = callbacks[event as string] || [];
    cbs.push(wrapper);
    callbacks[event as string] = cbs;
  };
  const emitter = { on, emit, release, once };
  if (key) {
    emitterCache.set(
      key,
      // eslint-disable-next-line @typescript-eslint/ban-types
      emitter as IEventEmitter<{ [key: string]: Function }>
    );
  }
  return emitter;
};
