import { IEventEmitter } from "./IEventEmitter";

export type IViewEventInfo = {
  split: (
    key: string,
    children0Key?: string,
    children1Key?: string,
    split?: string,
    reverse?: boolean
  ) => void;
  vsplit: (
    key: string,
    children0Key?: string,
    children1Key?: string,
    split?: string,
    reverse?: boolean
  ) => void;
  dispose: (key: string) => void;
};
export type IViewEventEmitter = IEventEmitter<IViewEventInfo>;
