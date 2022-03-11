import { TOKEN_BUFFER_EMITTER } from "@/const";
import { useEventEmitter, useWindow } from "@/service";
import { IBuffer } from "@/types";
import { IBufferEventInfo } from "@/types/IBufferEventEmitter";
import { IEditor } from "@/types/IEditor";
import { defineComponent, onMounted, onUnmounted, ref } from "vue";

const WorkbranchWindow = defineComponent({
  setup() {
    const $buffer = useEventEmitter<IBufferEventInfo>(TOKEN_BUFFER_EMITTER);
    const current = ref<string | null>(null);
    const currentBuf = ref<IBuffer | null>(null);
    const editor = ref<IEditor | null>(null);
    const onBufferFocus = (name: string, buf: IBuffer) => {
      current.value = name;
      currentBuf.value = buf;
    };
    onMounted(() => {
      $buffer.on("focus", onBufferFocus);
    });
    onUnmounted(() => {
      $buffer.release("focus", onBufferFocus);
    });
    return () => {
      return (
        <div>
          <div>{current.value || "workbranch"}</div>
          <div>{editor.value && editor.value.render()}</div>
        </div>
      );
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
