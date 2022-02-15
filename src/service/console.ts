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
  emitter.on("install", install);
  emitter.on("uninstall", uninstall);
  emitter.on("input", (msg) => {
    const [name, ...args] = msg.split(" ");
    const handle = callbacks[name];
    if (handle) {
      handle(...args);
    } else {
      emitter.emit("output", `commond not found: ${name}`, "error");
    }
  });
  emitter.on("clear", () => {
    messages.splice(0, messages.length);
  });
  emitter.emit("ready");
  return { messages, install, uninstall };
};
