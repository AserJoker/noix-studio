import { useEventEmitter, useWindow } from "@/service";
import { defineComponent, onMounted, ref, watch } from "vue";
import style from "./index.module.scss";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/monokai.css";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/hint/show-hint";
import { IBufferEventInfo } from "@/types/IBufferEventEmitter";
import { TOKEN_BUFFER_EMITTER } from "@/const";
const CodeWindow = defineComponent({
  props: {
    layoutKey: {
      type: String,
      required: true,
    },
  },
  setup() {
    const el = ref<HTMLTextAreaElement | null>(null);
    const container = ref<HTMLDivElement | null>(null);
    const value = ref("");
    const name = ref("no name");
    const $buffer = useEventEmitter<IBufferEventInfo>(TOKEN_BUFFER_EMITTER);
    watch(
      () => value.value,
      () => {
        $buffer.emit("change", name.value, value.value);
      }
    );
    onMounted(async () => {
      if (el.value && container.value) {
        const editor = CodeMirror.fromTextArea(el.value, {
          lineNumbers: true,
          mode: "text/typescript",
          hintOptions: {
            completeSingle: false,
          },
          theme: "monokai",
          showHint: true,
          matchBrackets: true,
        });
        editor.on("change", (cm) => {
          value.value = cm.getValue();
        });
        $buffer.on("focus", (n, v) => {
          name.value = n;
          editor.setValue(v.buf || "");
        });
      }
    });
    return () => {
      return (
        <div class={style.textarea}>
          <div>{name.value}</div>
          <textarea ref={el} />
          <div ref={container} class={style.tooltip}></div>
        </div>
      );
    };
  },
});
export const installCodeWindow = () => {
  const { createWindow } = useWindow();
  createWindow({
    classname: TOKEN_CODE_WINDOW,
    content: (layoutkey: string) => {
      return <CodeWindow layoutKey={layoutkey} />;
    },
    title: "workbranch",
  });
};
export const TOKEN_CODE_WINDOW = "token.window.code";
