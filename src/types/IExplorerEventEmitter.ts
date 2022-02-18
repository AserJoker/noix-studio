import { DropdownOption } from "naive-ui";
import { IResource } from "./IResource";

export type IExplorerEventInfo = {
  select: (key: string) => void;
  contextmenu: (menukey: string, node: IResource) => void;
  addContentmenuItem: (
    opt: DropdownOption,
    check: (node: IResource) => boolean
  ) => void;
  ready: () => void;
};
