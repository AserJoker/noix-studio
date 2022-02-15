import { TOKEN_CONSOLE_EMITTER } from "@/const";
import { useEventEmitter, useWindow } from "@/service";
import { IConsoleEventInfo } from "@/types";
import { NButton } from "naive-ui";
import { defineComponent } from "vue";
const WelcomeWindow = defineComponent({
  props: {
    layoutKey: {
      type: String,
      required: true,
    },
  },
  setup() {
    const $output = useEventEmitter<IConsoleEventInfo>(TOKEN_CONSOLE_EMITTER);
    return () => {
      return (
        <div>
          <div>welcome </div>
          <NButton
            onClick={() => {
              $output.emit("output", "demo message", "info");
            }}
          >
            new message
          </NButton>
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
