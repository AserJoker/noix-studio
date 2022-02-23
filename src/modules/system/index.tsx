import {
  TOKEN_CONSOLE_EMITTER,
  TOKEN_EXPLORER_EMITTER,
  TOKEN_MENU_EMITTER,
  TOKEN_VIEW_EMITTER,
} from "@/const";
import { useEventEmitter } from "@/service";
import {
  IConsoleEventInfo,
  IExplorerEventInfo,
  IMenuEventInfo,
  IViewEventInfo,
} from "@/types";
import { installConsoleWindow } from "@/windows/console";
import { installExplorerWindow } from "@/windows/explorer";
import { installWelcomeWindow } from "@/windows/welcome";

const installWindow = () => {
  installWelcomeWindow();
  installConsoleWindow();
  installExplorerWindow();
};
const env: Record<string, string> = {};
const installConsole = () => {
  const $console = useEventEmitter<IConsoleEventInfo>(TOKEN_CONSOLE_EMITTER);
  const $view = useEventEmitter<IViewEventInfo>(TOKEN_VIEW_EMITTER);
  $console.once("ready", () => {
    $console.emit("install", "clear", () => {
      $console.emit("clear");
    });
    $console.emit("install", "echo", (...msgs: string[]) => {
      $console.emit(
        "output",
        msgs
          .map((msg) => {
            if (msg.startsWith("$") && !msg.startsWith("$$")) {
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
  });
};
const installExplorer = () => {
  const $console = useEventEmitter<IConsoleEventInfo>(TOKEN_CONSOLE_EMITTER);
  const $explorer = useEventEmitter<IExplorerEventInfo>(TOKEN_EXPLORER_EMITTER);
  $explorer.on("ready", () => {
    $explorer.emit(
      "addContentmenuItem",
      {
        label: "查看",
        key: "view",
      },
      () => true
    );
    $explorer.on("contextmenu", (key, node) => {
      if (key === "view") {
        $console.emit("output", node.label);
      }
    });
  });
};
const system = {
  install: () => {
    installWindow();
    installConsole();
    installExplorer();
    const $console = useEventEmitter<IConsoleEventInfo>(TOKEN_CONSOLE_EMITTER);
    const $menu = useEventEmitter<IMenuEventInfo>(TOKEN_MENU_EMITTER);
    $menu.on("ready", () => {
      $menu.on("select", (key) => {
        $console.emit("output", `select menu ${key}`);
      });
    });
  },
};
export default system;
