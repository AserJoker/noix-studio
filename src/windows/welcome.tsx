import { TOKEN_VIEW_EMITTER } from "@/const";
import { useEventEmitter, useWindow } from "@/service";
import { IViewEventInfo } from "@/types";
import { defineComponent } from "vue";
const WelcomeWindow = defineComponent({
  props: {
    layoutKey: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const $view = useEventEmitter<IViewEventInfo>(TOKEN_VIEW_EMITTER);
    return () => {
      return (
        <div>
          <div>welcome {props.layoutKey}</div>
          <button
            onClick={() => {
              $view.emit("split", props.layoutKey);
            }}
          >
            split
          </button>
          <button
            onClick={() => {
              $view.emit("vsplit", props.layoutKey);
            }}
          >
            vsplit
          </button>
          <button
            onClick={() => {
              $view.emit("dispose", props.layoutKey);
            }}
          >
            dispose
          </button>
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
export const TOKEN_WELCOME_WINDOW = "token.window.welcome";
