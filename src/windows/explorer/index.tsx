import {
  useWindow,
  useEventEmitter,
  ITreeEventInfo,
  useTree,
  useExplorer,
} from "@/service";
import { IEventEmitter, IExplorerEventInfo, IResource } from "@/types";
import { defineComponent, ref } from "vue";
import Tree, { ITreeNode } from "@/widgets/tree";
import { resourcesTree, TOKEN_EXPLORER_EMITTER } from "@/const";
import { NIcon } from "naive-ui";
import { AddOutline, Folder, TrashOutline } from "@vicons/ionicons5";
import { FileOutlined } from "@vicons/antd";
import Dropdown, { IDropdownItem } from "@/widgets/dropdown";
const ExplorerWindow = defineComponent({
  setup() {
    const $explorer = useEventEmitter<
      ITreeEventInfo<IResource> & IExplorerEventInfo
    >(TOKEN_EXPLORER_EMITTER);
    $explorer.memory("ready");
    const { tree } = useTree(
      $explorer as IEventEmitter<ITreeEventInfo<IResource & ITreeNode>>,
      {
        label: "project",
        key: "root",
        children: resourcesTree,
        canEdit: false,
      }
    );
    const selectedKeys = ref<string[]>([]);
    const contextmenu = ref<IDropdownItem[]>([]);
    const currentContextMenuNode = ref<IResource | null>(null);
    const showContextMenu = ref(false);
    const { getContextmenu } = useExplorer(
      $explorer as IEventEmitter<IExplorerEventInfo>
    );
    const pos = ref({ x: 0, y: 0 });
    const prefix = (node: ITreeNode) => {
      return <NIcon>{node.children ? <Folder /> : <FileOutlined />}</NIcon>;
    };
    return () => {
      return (
        <>
          <Tree
            data={[tree]}
            selectedKeys={selectedKeys.value}
            onSelect={(value) => {
              selectedKeys.value = value;
            }}
            onUpdate={(node) => {
              $explorer.emit("upgrade", node);
            }}
            prefix={prefix}
            onAction={(action, node) => {
              if (action === "delete") {
                $explorer.emit("delete", node.key);
              }
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
            actions={[
              {
                key: "add",
                render: (node) =>
                  node.children ? (
                    <NIcon>
                      <AddOutline />
                    </NIcon>
                  ) : null,
              },
              {
                key: "delete",
                render: () => (
                  <NIcon>
                    <TrashOutline />
                  </NIcon>
                ),
              },
            ]}
          />
          <Dropdown
            dataSource={contextmenu.value}
            visible={showContextMenu.value}
            onClose={() => (showContextMenu.value = false)}
            x={pos.value.x}
            y={pos.value.y}
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
