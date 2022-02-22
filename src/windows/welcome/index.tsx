import { TOKEN_CONSOLE_EMITTER } from "@/const";
import { useEventEmitter, useWindow } from "@/service";
import { IConsoleEventInfo } from "@/types";
import { NButton } from "naive-ui";
import { defineComponent, ref } from "vue";
const WelcomeWindow = defineComponent({
  props: {
    layoutKey: {
      type: String,
      required: true,
    },
  },
  setup() {
    const $console = useEventEmitter<IConsoleEventInfo>(TOKEN_CONSOLE_EMITTER);
    const visible = ref(false);
    return () => {
      return (
        <div>
          <div>welcome </div>
          <NButton
            onClick={() => {
              $console.emit("output", "demo message", "info");
              visible.value = true;
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
