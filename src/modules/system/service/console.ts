import { IConsoleEventEmitter } from "@/types";
import moment from "moment";
import { reactive } from "vue";

const callbacks: Record<string, (...args: string[]) => void> = {};
export const useConsole = (emitter: IConsoleEventEmitter) => {
  const messages = reactive<
    {
      type: string;
      message: string;
      time: string;
    }[]
  >([]);
  emitter.on("output", (message = "", type = "info") => {
    messages.push({
      type,
      message,
      time: moment().format("YYYY-MM-DD hh:mm:ss"),
    });
    if (messages.length > 200) {
      messages.shift();
    }
  });
  const install = (name: string, cb: (...args: string[]) => void) => {
    callbacks[name] = cb as (...args: string[]) => void;
  };
  const uninstall = (name: string) => {
    delete callbacks[name];
  };
  const onInput = (msg: string) => {
    const [name, ...args] = msg.split(" ");
    const handle = callbacks[name];
    if (handle) {
      handle(...args);
    } else {
      emitter.emit("output", `commond not found: ${name}`, "error");
    }
  };
  const onClear = () => {
    messages.splice(0, messages.length);
  };
  const init = () => {
    emitter.on("install", install);
    emitter.on("uninstall", uninstall);
    emitter.on("input", onInput);
    emitter.on("clear", onClear);
    emitter.emit("ready");
  };
  const release = () => {
    emitter.release("install", install);
    emitter.release("uninstall", uninstall);
    emitter.release("input", onInput);
    emitter.release("clear", onClear);
  };
  return { messages, install, uninstall, init, release };
};
