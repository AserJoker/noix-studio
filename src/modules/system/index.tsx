import { TOKEN_CONSOLE_EMITTER } from "@/const";
import { useEventEmitter } from "@/service";
import { IConsoleEventInfo } from "@/types";
import { installConsoleWindow } from "@/windows/console";
import { installWelcomeWindow } from "@/windows/welcome";

const installWindow = () => {
  installWelcomeWindow();
  installConsoleWindow();
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
const system = {
  install: () => {
    installWindow();
    installConsole();
  },
};
export default system;
