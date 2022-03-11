import { TOKEN_BUFFER_EMITTER } from "@/const";
import { useEventEmitter, ITreeEventInfo } from "@/service";
import { useBuffer } from "@/service/buffer";
import { IBufferEventInfo } from "@/types/IBufferEventEmitter";
import { EditOutlined } from "@vicons/antd";
import { TrashOutline } from "@vicons/ionicons5";
import { onMounted, onUnmounted, ref } from "vue";
import { TOKEN_EXPLORER_EMITTER } from "./const";
import { IExplorerEventInfo } from "./types/IExplorerEventEmitter";
import { IResource } from "./types/IResource";
export const installExplorer = () => {
  const $buffer = useEventEmitter<IBufferEventInfo>(TOKEN_BUFFER_EMITTER);
  $buffer.memory("ready");
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
        label: "新建组",
        key: "new-group",
      },
      (node: IResource) => {
        return node.children;
      }
    );
    $explorer.emit("addAction", {
      key: "edit",
      render: (node: IResource) => {
        if (node.key !== "root" && node.key !== editKey.value) {
          return (
            <div class="icon">
              <EditOutlined />
            </div>
          );
        }
      },
    });
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
  const editKey = ref<string>("");
  const onEdit = (key: string) => {
    editKey.value = key;
  };
  const onUnEdit = () => {
    editKey.value = "";
  };
  const onEditComplete = (node: IResource, value: string) => {
    $buffer.emit("rename", node.label, value || node.label);
    node.label = value || node.label;
    $explorer.emit("unedit");
    if (!node.children) {
      $explorer.emit("select", node.key, node);
    }
  };
  const onContextMenu = (key: string, node: IResource) => {
    if (key === "new-component") {
      if (node.children) {
        const childrenKey = `${node.key}-${node.children.length}`;
        const newNode: IResource = {
          label: `no name ${childrenKey}`,
          key: childrenKey,
        };
        $explorer.emit(
          "insert",
          newNode,
          node.key,
          node.children[node.children.length - 1]?.key
        );
        $buffer.emit("create", newNode.label);
        $explorer.emit("expand", node.key);
        $explorer.emit("select", newNode.key, newNode);
        $explorer.emit("edit", newNode.key, newNode);
      }
    }
    if (key === "new-group") {
      if (node.children) {
        const childrenKey = `${key}-${node.children.length}`;
        const newNode: IResource = {
          label: "no name",
          key: childrenKey,
          children: [],
        };
        $explorer.emit(
          "insert",
          newNode,
          node.key,
          node.children[node.children.length - 1]?.key
        );
        $explorer.emit("expand", node.key);
        $explorer.emit("edit", newNode.key, newNode);
      }
    }
  };
  const onAction = (action: string, node: IResource) => {
    if (action === "delete") {
      $explorer.emit("delete", node.key);
      $explorer.emit("unselect", node.key);
      $buffer.emit("blur", node.label);
    }
    if (action === "edit") {
      $explorer.emit("edit", node.key, node);
    }
  };
  const onSelect = (key: string, node: IResource) => {
    $buffer.emit("focus", node.label, getBuffer(node.label));
  };
  onMounted(() => {
    init();
    $explorer.once("ready", onExplorerReady);
    $explorer.on("contextmenu", onContextMenu);
    $explorer.on("action", onAction);
    $explorer.on("select", onSelect);
    $explorer.on("edit", onEdit);
    $explorer.on("unedit", onUnEdit);
    $explorer.on("editComplete", onEditComplete);
  });
  onUnmounted(() => {
    release();
    $explorer.release("contextmenu", onContextMenu);
    $explorer.release("action", onAction);
    $explorer.release("select", onSelect);
    $explorer.release("edit", onEdit);
    $explorer.release("unedit", onUnEdit);
    $explorer.release("editComplete", onEditComplete);
  });
};
