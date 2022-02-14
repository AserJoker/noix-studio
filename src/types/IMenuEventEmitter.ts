import { DropdownOption } from "naive-ui";
import { IEventEmitter } from "./IEventEmitter";
export type IMenuEventInfo = {
  delete: (key: string) => void;
  enable: (key: string) => void;
  disable: (key: string) => void;
  update: (node: DropdownOption) => void;
  insert: (node: DropdownOption, parentKey?: string, lastKey?: string) => void;
  select: (key: string) => void;
};
export type IMenuEventEmitter = IEventEmitter<IMenuEventInfo>;
