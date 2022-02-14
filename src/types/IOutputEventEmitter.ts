import { IEventEmitter } from "./IEventEmitter";

export type IOutputEventInfo = {
  output: (type: string, msg: string) => void;
};
export type IOutputEventEmitter = IEventEmitter<IOutputEventInfo>;
