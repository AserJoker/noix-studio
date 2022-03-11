import { TOKEN_MENU_EMITTER, TOKEN_VIEW_EMITTER } from "@/const";
import { useEventEmitter, ITreeEventInfo } from "@/service";
import { IMenuEventInfo, IViewEventInfo, IView } from "@/types";
import { onMounted, onUnmounted } from "vue";
import { TOKEN_CONSOLE_EMITTER } from "./const";
import { IConsoleEventInfo } from "./types/IConsoleEventEmitter";
import { TOKEN_NEW_TEMPLATE_PROJECT_WINDOW } from "./windows/new-template-project";

export const installMenu = () => {
  const $console = useEventEmitter<IConsoleEventInfo>(TOKEN_CONSOLE_EMITTER);
  const $menu = useEventEmitter<IMenuEventInfo>(TOKEN_MENU_EMITTER);
  const $view = useEventEmitter<IViewEventInfo & ITreeEventInfo<IView>>(
    TOKEN_VIEW_EMITTER
  );
  const onSelect = (key: string) => {
    if (key === "from-template") {
      $view.emit("update", {
        key: "workbranch",
        type: "window",
        classname: [TOKEN_NEW_TEMPLATE_PROJECT_WINDOW],
      });
      $view.emit(
        "focusWindow",
        "workbranch",
        TOKEN_NEW_TEMPLATE_PROJECT_WINDOW
      );
    }
    $console.emit("output", `select menu ${key}`);
  };
  const onReady = () => {
    return;
  };
  onMounted(() => {
    $menu.once("ready", onReady);
    $menu.on("select", onSelect);
  });
  onUnmounted(() => {
    $menu.release("select", onSelect);
  });
};
