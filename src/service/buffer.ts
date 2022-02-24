import { IEventEmitter } from "@/types";
import { IBufferEventInfo } from "@/types/IBufferEventEmitter";
export const useBuffer = (emitter: IEventEmitter<IBufferEventInfo>) => {
  const buffers: Record<string, string> = {};
  const createBuffer = (name: string) => {
    if (buffers[name] !== undefined) {
      throw new Error(`buffer name#${name} is existed`);
    }
    buffers[name] = "";
  };
  const disposeBuffer = (name: string) => {
    if (buffers[name] === undefined) {
      throw new Error(`buffer name#${name} is not existed`);
    }
    delete buffers[name];
  };
  const changeBuffer = (name: string, value: string) => {
    buffers[name] = value;
  };
  emitter.on("create", createBuffer);
  emitter.on("dispose", disposeBuffer);
  emitter.on("change", changeBuffer);
  emitter.emit("ready");
  return {};
};
