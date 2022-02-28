import { TOKEN_BUFFER_EMITTER } from "@/const";
import { useEventEmitter, ITreeEventInfo } from "@/service";
import { useBuffer } from "@/service/buffer";
import { IConsoleEventInfo } from "@/types";
import { IBufferEventInfo } from "@/types/IBufferEventEmitter";
import { TrashOutline } from "@vicons/ionicons5";
import { onMounted, onUnmounted } from "vue";
import { TOKEN_CONSOLE_EMITTER, TOKEN_EXPLORER_EMITTER } from "./const";
import { IExplorerEventInfo } from "./types/IExplorerEventEmitter";
import { IResource } from "./types/IResource";
export const installExplorer = () => {
  const $console = useEventEmitter<IConsoleEventInfo>(TOKEN_CONSOLE_EMITTER);
  const $buffer = useEventEmitter<IBufferEventInfo>(TOKEN_BUFFER_EMITTER);
  const { getBuffer, init, release } = useBuffer($buffer);
  const $explorer = useEventEmitter<
    IExplorerEventInfo & ITreeEventInfo<IResource>
  >(TOKEN_EXPLORER_EMITTER);
  const onExplorerReady = () => {
    $explorer.emit(
      "addContentmenuItem",
      {
        label: "查看",
        key: "view",
      },
      () => true
    );
    $explorer.emit("addAction", {
      key: "delete",
      render: (node: IResource) => {
        if (node.key === "root") {
          return false;
        }
        return (
          <div class="icon">
            <TrashOutline />
          </div>
        );
      },
    });
  };
  const onContextMenu = (key: string, node: IResource) => {
    if (key === "view") {
      $console.emit("output", node.label);
    }
  };
  const onAction = (action: string, node: IResource) => {
    if (action === "delete") {
      $explorer.emit("delete", node.key);
    }
  };
  const onSelect = (key: string) => {
    $buffer.emit("focus", key, getBuffer(key));
  };
  onMounted(() => {
    init();
    $explorer.once("ready", onExplorerReady);
    $explorer.on("contextmenu", onContextMenu);
    $explorer.on("action", onAction);
    $explorer.on("select", onSelect);
  });
  onUnmounted(() => {
    release();
    $explorer.release("contextmenu", onContextMenu);
    $explorer.release("action", onAction);
    $explorer.release("select", onSelect);
  });
};
