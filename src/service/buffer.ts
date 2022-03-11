import { IBuffer, IEventEmitter } from "@/types";
import { IBufferEventInfo } from "@/types/IBufferEventEmitter";
import { reactive } from "vue";
export const useBuffer = (emitter: IEventEmitter<IBufferEventInfo>) => {
  const buffers: Record<string, IBuffer> = reactive({});
  const createBuffer = (name: string) => {
    if (buffers[name] !== undefined) {
      throw new Error(`buffer name#${name} is existed`);
    }
    buffers[name] = {
      buf: "",
      name,
      cursor: { line: 0, pos: 0 },
      type: "component",
    };
  };
  const disposeBuffer = (name: string) => {
    if (buffers[name] === undefined) {
      throw new Error(`buffer name#${name} is not existed`);
    }
    delete buffers[name];
  };
  const changeBuffer = (name: string, value: string) => {
    buffers[name].buf = value;
  };
  const renameBuffer = (old: string, value: string) => {
    if (value !== old && buffers[old]) {
      buffers[value] = buffers[old];
      buffers[value].name = value;
      delete buffers[old];
    }
  };
  const init = () => {
    emitter.on("create", createBuffer);
    emitter.on("dispose", disposeBuffer);
    emitter.on("change", changeBuffer);
    emitter.on("rename", renameBuffer);
    emitter.emit("ready");
  };
  const release = () => {
    emitter.release("create", createBuffer);
    emitter.release("dispose", disposeBuffer);
    emitter.release("change", changeBuffer);
    emitter.release("rename", renameBuffer);
  };
  const getBuffer = (name: string) => {
    return buffers[name];
  };
  return { getBuffer, init, release };
};
