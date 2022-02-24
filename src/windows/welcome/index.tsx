import { TOKEN_VIEW_EMITTER } from "@/const";
import { ITreeEventInfo, useEventEmitter, useWindow } from "@/service";
import { IView, IViewEventInfo } from "@/types";
import { defineComponent } from "vue";
import { TOKEN_CODE_WINDOW } from "../code";
import { TOKEN_CONSOLE_WINDOW } from "../console";
import { TOKEN_EXPLORER_WINDOW } from "../explorer";
import style from "./index.module.scss";
export const TOKEN_WELCOME_WINDOW = "token.window.welcome";
const view = {
  key: "root",
  type: "group",
  direction: "row",
  split: "240px",
  children: [
    {
      type: "window",
      classname: [TOKEN_EXPLORER_WINDOW],
      key: "explorer",
    },
    {
      type: "group",
      key: "content",
      direction: "column",
      split: "240px",
      reverse: true,
      children: [
        {
          type: "window",
          key: "console",
          classname: [TOKEN_CONSOLE_WINDOW],
        },
        {
          type: "window",
          key: "workbranch",
          classname: [TOKEN_CODE_WINDOW, TOKEN_WELCOME_WINDOW],
        },
      ],
    },
  ],
};
const WelcomeWindow = defineComponent({
  props: {
    layoutKey: {
      type: String,
      required: true,
    },
  },
  setup() {
    const $view = useEventEmitter<IViewEventInfo & ITreeEventInfo<IView>>(
      TOKEN_VIEW_EMITTER
    );
    return () => {
      return (
        <div class={style.content}>
          <div
            onClick={() => {
              $view.emit("update", view);
            }}
            class={style.action}
          >
            New Project
          </div>
        </div>
      );
    };
  },
});
export const installWelcomeWindow = () => {
  const { createWindow } = useWindow();
  createWindow({
    classname: TOKEN_WELCOME_WINDOW,
    content: (layoutkey: string) => {
      return <WelcomeWindow layoutKey={layoutkey} />;
    },
    title: "welcome",
  });
};
