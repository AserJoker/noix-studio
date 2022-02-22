import { TOKEN_CONSOLE_EMITTER, TOKEN_MENU_EMITTER } from "@/const";
import { useEventEmitter } from "@/service";
import { IConsoleEventInfo, IMenuEventInfo } from "@/types";
import { installConsoleWindow } from "@/windows/console";
import { installExplorerWindow } from "@/windows/explorer";
import { installWelcomeWindow } from "@/windows/welcome";

const installWindow = () => {
  installWelcomeWindow();
  installConsoleWindow();
  installExplorerWindow();
};
const installConsole = () => {
  const $console = useEventEmitter<IConsoleEventInfo>(TOKEN_CONSOLE_EMITTER);
  $console.once("ready", () => {
    $console.emit("install", "clear", () => {
      $console.emit("clear");
    });
    $console.emit("install", "echo", (...msgs: string[]) => {
      $console.emit(
        "output",
        msgs
          .map((msg) => {
            return msg;
          })
          .join(" "),
        "info"
      );
    });
  });
};
const installExplorer = () => {
  return;
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
