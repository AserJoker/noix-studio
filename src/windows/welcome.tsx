import { useWindow } from "@/service";
import { defineComponent } from "vue";
const WelcomeWindow = defineComponent({
  props: {
    layoutKey: {
      type: String,
      required: true,
    },
  },
  setup() {
    return () => {
      return (
        <div>
          <div>welcome </div>
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
