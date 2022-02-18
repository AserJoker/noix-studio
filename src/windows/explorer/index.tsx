import { useWindow, useEventEmitter, ITreeEventInfo, useTree } from "@/service";
import { IEventEmitter, IExplorerEventInfo, IResource } from "@/types";
import { defineComponent, ref } from "vue";
import Tree, { ITreeNode } from "./components/Tree";
import { resourcesTree, TOKEN_EXPLORER_EMITTER } from "@/const";
import { NIcon } from "naive-ui";
import { AddOutline, Folder, TrashOutline } from "@vicons/ionicons5";
import { FileOutlined } from "@vicons/antd";
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
