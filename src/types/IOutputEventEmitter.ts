import { IEventEmitter } from "./IEventEmitter";

export type IConsoleEventInfo = {
  output: (type: string, msg: string) => void;
  input: (message: string) => void;
};
export type IConsoleEventEmitter = IEventEmitter<IConsoleEventInfo>;
