import { IEventEmitter, IExplorerEventInfo, IResource } from "@/types";
import { IDropdownItem } from "@/widgets/dropdown";

export const useExplorer = (emitter: IEventEmitter<IExplorerEventInfo>) => {
  const contextmenuItems: {
    opt: IDropdownItem;
    check: (node: IResource) => boolean;
  }[] = [];
  const addContentmenuItem = (
    opt: IDropdownItem,
    check: (node: IResource) => boolean
  ) => {
    contextmenuItems.push({ opt, check });
  };
  const getContextmenu = (node: IResource) => {
    return contextmenuItems
      .filter((item) => item.check(node))
      .map((item) => item.opt);
  };
  emitter.on("addContentmenuItem", addContentmenuItem);
  emitter.emit("ready");
  return { addContentmenuItem, getContextmenu };
};
