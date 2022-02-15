import { IEventEmitter } from "./IEventEmitter";

export type IConsoleEventInfo = {
  output: (msg: string, type: string) => void;
  input: (message: string) => void;
  install: (name: string, cb: (...args: string[]) => void) => void;
  uninstall: (name: string) => void;
  clear: () => void;
  ready: () => void;
};
export type IConsoleEventEmitter = IEventEmitter<IConsoleEventInfo>;
