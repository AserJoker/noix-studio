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
  const init = () => {
    emitter.on("addContentmenuItem", addContentmenuItem);
    emitter.on("addAction", addAction);
    emitter.emit("ready");
  };
  const release = () => {
    emitter.release("addContentmenuItem", addContentmenuItem);
    emitter.release("addAction", addAction);
  };
  return { getContextmenu, actions, init, release };
};
