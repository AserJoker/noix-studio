export type IBufferEventInfo = {
  change: (name: string, val: string) => void;
  create: (name: string) => void;
  dispose: (name: string) => void;
  ready: () => void;
  focus: (name: string, value: string) => void;
};
