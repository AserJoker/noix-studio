import { IEventEmitter } from "./IEventEmitter";

export type IConsoleEventInfo = {
  output: (type: string, msg: string) => void;
  input: (message: string) => void;
  install: (name: string, cb: (...args: string[]) => void) => void;
  uninstall: (name: string) => void;
  clear: () => void;
};
export type IConsoleEventEmitter = IEventEmitter<IConsoleEventInfo>;
