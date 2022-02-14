import { TOKEN_CONSOLE_EMITTER } from "@/const";
import { useEventEmitter } from "@/service";
import { useConsole } from "@/service/console";
import { IConsoleEventInfo } from "@/types";
import { installConsoleWindow } from "@/windows/console";
import { installWelcomeWindow } from "@/windows/welcome";
const installWindow = () => {
  installWelcomeWindow();
  installConsoleWindow();
};
const installConsole = () => {
  const $console = useEventEmitter<IConsoleEventInfo>(TOKEN_CONSOLE_EMITTER);
  const { install } = useConsole($console);
  install("clear", () => {
    $console.emit("clear");
  });
};
const system = {
  install: () => {
    installWindow();
    installConsole();
  },
};
export default system;
