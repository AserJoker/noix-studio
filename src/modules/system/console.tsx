import { TOKEN_VIEW_EMITTER } from "@/const";
import { useEventEmitter } from "@/service";
import { IViewEventInfo } from "@/types";
import { onMounted } from "vue";
import { TOKEN_CONSOLE_EMITTER } from "./const";
import { IConsoleEventInfo } from "./types/IConsoleEventEmitter";

const env: Record<string, string> = {};
export const installConsole = () => {
  const $console = useEventEmitter<IConsoleEventInfo>(TOKEN_CONSOLE_EMITTER);
  const $view = useEventEmitter<IViewEventInfo>(TOKEN_VIEW_EMITTER);
  const onReady = () => {
    $console.emit("install", "clear", () => {
      $console.emit("clear");
    });
    $console.emit("install", "echo", (...msgs: string[]) => {
      $console.emit(
        "output",
        msgs
          .map((msg) => {
            if (msg.startsWith("$")) {
              if (msg.startsWith("$$")) {
                return msg.substring(1);
              }
              return env[msg.substring(1)] || "";
            }
            return msg;
          })
          .join(" "),
        "info"
      );
    });
    $console.emit("install", "addwindow", (key: string, classname: string) => {
      $view.emit("addwindow", key, classname);
    });
    $console.emit("install", "set", (...list: string[]) => {
      list.map((item) => {
        const [name, value = ""] = item.split("=");
        env[name] = value;
      });
    });
    $console.emit("install", "env", () => {
      const keys = Object.keys(env);
      const output = keys.map((key) => `${key}=${env[key] || ""}`).join(";");
      $console.emit("output", output);
    });
  };
  onMounted(() => {
    $console.once("ready", onReady);
  });
};
