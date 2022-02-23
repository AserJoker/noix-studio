import { IDropdownItem } from "@/widgets/dropdown";
import { IResource } from "./IResource";

export type IExplorerEventInfo = {
  select: (key: string) => void;
  contextmenu: (menukey: string, node: IResource) => void;
  addContentmenuItem: (
    opt: IDropdownItem,
    check: (node: IResource) => boolean
  ) => void;
  ready: () => void;
};
