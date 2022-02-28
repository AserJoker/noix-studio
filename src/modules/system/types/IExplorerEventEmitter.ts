import { IDropdownItem } from "@/widgets/dropdown";
import { VNodeChild } from "vue";
import { IResource } from "./IResource";

export type IExplorerEventInfo = {
  select: (key: string) => void;
  contextmenu: (menukey: string, node: IResource) => void;
  action: (action: string, node: IResource) => void;
  addContentmenuItem: (
    opt: IDropdownItem,
    check: (node: IResource) => boolean
  ) => void;
  addAction: (action: {
    key: string;
    render: (node: IResource) => VNodeChild;
  }) => void;
  ready: () => void;
};
