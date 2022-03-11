import { TOKEN_WORKBRANCH_EMITTER } from "@/const";
import { useEventEmitter, useWindow } from "@/service";
import { defineComponent, onMounted, onUnmounted } from "vue";
import { useWorkbranch } from "../../service/workbranch";
import { IWorkbranchEventInfo } from "../../types/IWorkbranchEventEmittor";
import style from "./index.module.scss";

const WorkbranchWindow = defineComponent({
  setup() {
    const $workbranch = useEventEmitter<IWorkbranchEventInfo>(
      TOKEN_WORKBRANCH_EMITTER
    );
    const { init, release, buf, editor } = useWorkbranch($workbranch);
    onMounted(() => {
      init();
    });
    onUnmounted(() => {
      release();
    });
    return () => {
      return (
        <div class={style.container}>
          <div class={style.header}>
            {(buf.value && buf.value.name) || "no buffer"}
          </div>
          <div class={style.body}>
            {buf.value && editor.value && editor.value.render(buf.value)}
          </div>
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
