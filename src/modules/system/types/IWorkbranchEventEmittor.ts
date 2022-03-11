import { IEventEmitter } from "@/types/IEventEmitter";

export type IWorkbranchEventInfo = {
  close: () => void;
  replace: (buf: string) => void;
  open: (buf: string) => void;
};
export type IWorkbranchEventEmitter = IEventEmitter<IWorkbranchEventInfo>;
