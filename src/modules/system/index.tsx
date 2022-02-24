import {
  TOKEN_CONSOLE_EMITTER,
  TOKEN_EXPLORER_EMITTER,
  TOKEN_MENU_EMITTER,
  TOKEN_VIEW_EMITTER,
} from "@/const";
import { ITreeEventInfo, useEventEmitter } from "@/service";
import {
  IConsoleEventInfo,
  IExplorerEventInfo,
  IMenuEventInfo,
  IResource,
  IViewEventInfo,
} from "@/types";
import { installCodeWindow } from "@/windows/code";
import { installConsoleWindow } from "@/windows/console";
import { installExplorerWindow } from "@/windows/explorer";
import { installWelcomeWindow } from "@/windows/welcome";
import { TrashOutline } from "@vicons/ionicons5";

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
  const $explorer = useEventEmitter<
    IExplorerEventInfo & ITreeEventInfo<IResource>
  >(TOKEN_EXPLORER_EMITTER);
  $explorer.on("ready", () => {
    $explorer.emit(
      "addContentmenuItem",
      {
        label: "查看",
        key: "view",
      },
      () => true
    );
    $explorer.emit("addAction", {
      key: "delete",
      render: (node: IResource) => {
        if (node.key === "root") {
          return false;
        }
        return (
          <div class="icon">
            <TrashOutline />
          </div>
        );
      },
    });
  });
  $explorer.on("contextmenu", (key, node) => {
    if (key === "view") {
      $console.emit("output", node.label);
    }
  });
  $explorer.on("action", (action, node) => {
    if (action === "delete") {
      $explorer.emit("delete", node.key);
    }
  });
};
const system = {
  install: () => {
    installWindow();
    installConsole();
    installExplorer();
    installCodeWindow();
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
