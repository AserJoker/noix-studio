import { IEditor } from "@/types/IEditor";
import { IEventEmitter } from "@/types/IEventEmitter";

export type IWorkbranchEventInfo = {
  close: () => void;
  replace: (buf: string) => void;
  open: (buf: string) => void;
  install: (editor: IEditor) => void;
  ready: () => void;
};
export type IWorkbranchEventEmitter = IEventEmitter<IWorkbranchEventInfo>;
