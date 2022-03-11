import { useWindow, useEventEmitter, ITreeEventInfo, useTree } from "@/service";
import { useExplorer } from "../../service/explorer";
import { IEventEmitter } from "@/types";
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import Tree, { ITreeNode } from "@/widgets/tree";
import Dropdown, { IDropdownItem } from "@/widgets/dropdown";
import { IExplorerEventInfo } from "../../types/IExplorerEventEmitter";
import { IResource } from "../../types/IResource";
import { TOKEN_EXPLORER_EMITTER } from "../../const";
const ExplorerWindow = defineComponent({
  setup() {
    const $explorer = useEventEmitter<
      ITreeEventInfo<IResource> & IExplorerEventInfo
    >(TOKEN_EXPLORER_EMITTER);
    $explorer.memory("ready");
    const {
      tree,
      init: initTree,
      release: releaseTree,
      getTreeNode,
    } = useTree(
      $explorer as IEventEmitter<ITreeEventInfo<IResource & ITreeNode>>,
      {
        label: "project",
        key: "root",
        children: [],
      }
    );
    const {
      getContextmenu,
      actions,
      init,
      release,
      expandKeys,
      onExpand,
      selectedKeys,
      onSelect,
      renderLabel,
    } = useExplorer($explorer as IEventEmitter<IExplorerEventInfo>);
    const contextmenu = ref<IDropdownItem[]>([]);
    const currentContextMenuNode = ref<IResource | null>(null);
    const showContextMenu = ref(false);
    const pos = ref({ x: 0, y: 0 });
    onMounted(() => {
      initTree();
      init();
    });
    onUnmounted(() => {
      release();
      releaseTree();
    });
    const onRawSelect = (keys: string[]) => {
      const key = keys[0];
      const node = getTreeNode(key);
      if (!node.children) {
        onSelect([key], [node]);
      }
    };
    return () => {
      return (
        <>
          <Tree
            data={[tree]}
            selectedKeys={selectedKeys}
            expandKeys={expandKeys}
            onExpand={onExpand}
            onSelect={onRawSelect}
            onUpdate={(node) => {
              $explorer.emit("upgrade", node);
            }}
            onAction={(action, node) => {
              $explorer.emit("action", action, node);
            }}
            onContextmenu={(node, e) => {
              const menus = getContextmenu(node);
              if (menus.length) {
                contextmenu.value = menus;
                pos.value.x = e.clientX;
                pos.value.y = e.clientY;
                showContextMenu.value = true;
                currentContextMenuNode.value = node;
              }
              e.preventDefault();
            }}
            actions={actions}
            label={renderLabel}
          />
          <Dropdown
            dataSource={contextmenu.value}
            visible={showContextMenu.value}
            onClose={() => (showContextMenu.value = false)}
            x={pos.value.x}
            y={pos.value.y}
            style={{ position: "fixed" }}
            onSelect={(node) => {
              $explorer.emit(
                "contextmenu",
                node.key,
                currentContextMenuNode.value
              );
            }}
          />
        </>
      );
    };
  },
});
export const installExplorerWindow = () => {
  const { createWindow } = useWindow();
  createWindow({
    title: "explorer",
    classname: TOKEN_EXPLORER_WINDOW,
    content: () => <ExplorerWindow />,
  });
};
export const TOKEN_EXPLORER_WINDOW = "token.window.explorer";
