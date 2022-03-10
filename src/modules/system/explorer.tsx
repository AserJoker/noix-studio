import { TOKEN_BUFFER_EMITTER } from "@/const";
import { useEventEmitter, ITreeEventInfo } from "@/service";
import { useBuffer } from "@/service/buffer";
import { IBufferEventInfo } from "@/types/IBufferEventEmitter";
import { TrashOutline } from "@vicons/ionicons5";
import { onMounted, onUnmounted } from "vue";
import { TOKEN_EXPLORER_EMITTER } from "./const";
import { IExplorerEventInfo } from "./types/IExplorerEventEmitter";
import { IResource } from "./types/IResource";
export const installExplorer = () => {
  const $buffer = useEventEmitter<IBufferEventInfo>(TOKEN_BUFFER_EMITTER);
  const { getBuffer, init, release } = useBuffer($buffer);
  const $explorer = useEventEmitter<
    IExplorerEventInfo & ITreeEventInfo<IResource>
  >(TOKEN_EXPLORER_EMITTER);
  const onExplorerReady = () => {
    $explorer.emit(
      "addContentmenuItem",
      {
        label: "新建组件",
        key: "new-component",
      },
      (node: IResource) => {
        return node.children;
      }
    );
    $explorer.emit(
      "addContentmenuItem",
      {
        label: "expand",
        key: "expand",
      },
      (node: IResource) => {
        return node.children;
      }
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
    if (key === "new-component") {
      if (node.children) {
        const childrenKey = `${key}-${node.children.length}`;
        const newNode: IResource = {
          label: "no name",
          key: childrenKey,
        };
        $explorer.emit(
          "insert",
          newNode,
          node.key,
          node.children[node.children.length - 1]?.key
        );
        $explorer.emit("expand", node.key);
        $explorer.emit("select", childrenKey);
      }
    }
    if (key === "expand") {
      $explorer.emit("expand", node.key);
    }
  };
  const onAction = (action: string, node: IResource) => {
    if (action === "delete") {
      $explorer.emit("delete", node.key);
      $explorer.emit("unselect", node.key);
      $buffer.emit("blur", node.label);
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
