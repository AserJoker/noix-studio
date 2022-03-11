import { IBuffer } from "./IBuffer";

export type IBufferEventInfo = {
  change: (name: string, val: string) => void;
  create: (name: string) => void;
  dispose: (name: string) => void;
  rename: (oldname: string, newname: string) => void;
  ready: () => void;
  focus: (name: string, buf: IBuffer) => void;
  blur: (name: string, buf: IBuffer) => void;
};
