import { TOKEN_BUFFER_EMITTER } from "@/const";
import { useEventEmitter, useWindow } from "@/service";
import { IBuffer } from "@/types";
import { IBufferEventInfo } from "@/types/IBufferEventEmitter";
import { defineComponent, onMounted, ref } from "vue";

const WorkbranchWindow = defineComponent({
  setup() {
    const $buffer = useEventEmitter<IBufferEventInfo>(TOKEN_BUFFER_EMITTER);
    const current = ref<string | null>(null);
    const currentBuf = ref<IBuffer | null>(null);
    onMounted(() => {
      $buffer.on("focus", (name, buf) => {
        current.value = name;
        currentBuf.value = buf;
      });
    });
    return () => {
      return <div>{current.value || "workbranch"}</div>;
    };
  },
});
export const installWorkbranchWindow = () => {
  const { createWindow } = useWindow();
  createWindow({
    title: "workbranch",
    content: () => <WorkbranchWindow />,
    classname: TOKEN_WORKBRANCH_WINDOW,
  });
};
export const TOKEN_WORKBRANCH_WINDOW = "token.window.workbranch";
