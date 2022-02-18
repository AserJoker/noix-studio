import { IEventEmitter, IExplorerEventInfo, IResource } from "@/types";
import { DropdownOption } from "naive-ui";

export const useExplorer = (emitter: IEventEmitter<IExplorerEventInfo>) => {
  const contextmenuItems: {
    opt: DropdownOption;
    check: (node: IResource) => boolean;
  }[] = [];
  const addContentmenuItem = (
    opt: DropdownOption,
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
