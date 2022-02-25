import { useWindow } from "@/service";
import { defineComponent } from "vue";
import style from "./index.module.scss";
export const TOKEN_WELCOME_WINDOW = "token.window.welcome";
const WelcomeWindow = defineComponent({
  props: {
    layoutKey: {
      type: String,
      required: true,
    },
  },
  setup() {
    return () => {
      return <div class={style.content}>version v0.1.0</div>;
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
