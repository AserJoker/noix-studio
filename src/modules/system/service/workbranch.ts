import { TOKEN_BUFFER_EMITTER } from "@/const";
import { useEventEmitter } from "@/service";
import { IBuffer } from "@/types";
import { IBufferEventInfo } from "@/types/IBufferEventEmitter";
import { IEditor } from "@/types/IEditor";
import { ref } from "vue";
import { IWorkbranchEventEmitter } from "../types/IWorkbranchEventEmittor";

export const useWorkbranch = (emitter: IWorkbranchEventEmitter) => {
  const $buffer = useEventEmitter<IBufferEventInfo>(TOKEN_BUFFER_EMITTER);
  const editors: IEditor[] = [];
  const buf = ref<IBuffer | null>(null);
  const editor = ref<IEditor | null>(null);
  const onFocus = (key: string, _buf: IBuffer) => {
    buf.value = _buf;
    const list = editors.filter((e) => e.check(_buf.type));
    editor.value = list[0] || null;
  };
  const onInstall = (editor: IEditor) => {
    if (!editors.find((e) => e.name === editor.name)) {
      editors.push(editor);
      if (buf.value) {
        onFocus(buf.value.name, buf.value);
      }
    }
  };
  const init = () => {
    $buffer.on("focus", onFocus);
    emitter.on("install", onInstall);
    emitter.emit("ready");
  };
  const release = () => {
    $buffer.release("focus", onFocus);
    emitter.release("install", onInstall);
  };
  return { init, release, buf, editor };
};
