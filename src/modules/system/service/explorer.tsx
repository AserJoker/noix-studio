import { IEventEmitter } from "@/types";
import { IDropdownItem } from "@/widgets/dropdown";
import Input from "@/widgets/input";
import { reactive, ref, VNodeChild } from "vue";
import { IExplorerEventInfo } from "../types/IExplorerEventEmitter";
import { IResource } from "../types/IResource";
import { CheckOutlined } from "@vicons/antd";

export const useExplorer = (emitter: IEventEmitter<IExplorerEventInfo>) => {
  const contextmenuItems: {
    opt: IDropdownItem;
    check: (node: IResource) => boolean;
  }[] = [];
  const actions = reactive<
    { key: string; render: (node: IResource) => VNodeChild }[]
  >([]);
  const addContentmenuItem = (
    opt: IDropdownItem,
    check: (node: IResource) => boolean
  ) => {
    contextmenuItems.push({ opt, check });
  };
  const addAction = (action: {
    key: string;
    render: (node: IResource) => VNodeChild;
  }) => {
    actions.push(action);
  };
  const getContextmenu = (node: IResource) => {
    return contextmenuItems
      .filter((item) => item.check(node))
      .map((item) => item.opt);
  };
  const expand = (key: string) => {
    if (!expandKeys.includes(key)) {
      expandKeys.push(key);
    }
  };
  const unexpand = (key: string) => {
    const index = expandKeys.findIndex((v) => v === key);
    if (index !== -1) {
      expandKeys.splice(index, 1);
    }
  };
  const init = () => {
    emitter.on("addContentmenuItem", addContentmenuItem);
    emitter.on("addAction", addAction);
    emitter.on("expand", expand);
    emitter.on("unexpand", unexpand);
    emitter.on("select", select);
    emitter.on("unselect", unselect);
    emitter.on("edit", onEdit);
    emitter.on("unedit", onUnEdit);
    emitter.emit("ready");
  };
  const release = () => {
    emitter.release("addContentmenuItem", addContentmenuItem);
    emitter.release("addAction", addAction);
    emitter.release("expand", expand);
    emitter.release("unexpand", unexpand);
    emitter.release("select", select);
    emitter.release("unselect", unselect);
    emitter.release("edit", onEdit);
    emitter.release("unedit", onUnEdit);
  };
  const select = (key: string) => {
    selectedKeys.splice(0, selectedKeys.length, key);
  };
  const unselect = (key: string) => {
    const index = selectedKeys.findIndex((item) => item === key);
    if (index !== -1) {
      selectedKeys.splice(index, 1);
    }
  };
  const onExpand = (keys: string[]) => {
    expandKeys.splice(0, expandKeys.length, ...keys);
  };
  const onSelect = (keys: string[], nodes: IResource[]) => {
    keys.forEach((key, index) => {
      emitter.emit("select", key, nodes[index]);
    });
  };
  const onEdit = (key: string, node: IResource) => {
    editValue.value = node.label;
    editKey.value = key;
  };
  const onUnEdit = () => {
    editKey.value = "";
    editValue.value = null;
  };
  const expandKeys = reactive<string[]>([]);
  const selectedKeys = reactive<string[]>([]);
  const editValue = ref<string | null>("");
  const editKey = ref<string>("");
  const renderLabel = (node: IResource) => {
    if (editKey.value === node.key) {
      return (
        <div onClick={(e) => e.stopPropagation()}>
          <Input
            value={editValue.value}
            onUpdate:value={(val) => (editValue.value = val)}
            autofocus
            type="baseline"
            suffix={() => {
              return (
                <div
                  class="icon"
                  onClick={() => {
                    emitter.emit("editComplete", node, editValue.value);
                  }}
                >
                  <CheckOutlined />
                </div>
              );
            }}
          />
        </div>
      );
    }
    return node.label;
  };
  return {
    getContextmenu,
    actions,
    init,
    release,
    expandKeys,
    onExpand,
    selectedKeys,
    onSelect,
    renderLabel,
  };
};
