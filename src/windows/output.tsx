import { useWindow } from "@/service";
import { defineComponent } from "vue";

const OutputWindow = defineComponent({
  setup() {
    return () => {
      return <div>output</div>;
    };
  },
});

export const installOutputWindow = () => {
  const { createWindow } = useWindow();
  createWindow({
    title: "output",
    content: () => <OutputWindow />,
    classname: TOKEN_OUTPUT_WINDOW,
  });
};
export const TOKEN_OUTPUT_WINDOW = "token.window.output";
export const TOKEN_OUTPUT_EMITTER = "token.emitter.output";
