import { IEventEmitter } from "@/types";
import { IDropdownItem } from "@/widgets/dropdown";
import { reactive, VNodeChild } from "vue";
import { IExplorerEventInfo } from "../types/IExplorerEventEmitter";
import { IResource } from "../types/IResource";

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
    emitter.emit("ready");
  };
  const release = () => {
    emitter.release("addContentmenuItem", addContentmenuItem);
    emitter.release("addAction", addAction);
    emitter.release("expand", expand);
    emitter.release("unexpand", unexpand);
    emitter.release("select", select);
    emitter.release("unselect", unselect);
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
  const onSelect = (keys: string[]) => {
    keys.forEach((key) => {
      emitter.emit("select", key);
    });
  };
  const expandKeys = reactive<string[]>([]);
  const selectedKeys = reactive<string[]>([]);
  return {
    getContextmenu,
    actions,
    init,
    release,
    expandKeys,
    onExpand,
    selectedKeys,
    onSelect,
  };
};
