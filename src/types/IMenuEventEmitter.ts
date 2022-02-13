import { IEventEmitter } from "./IEventEmitter";
export interface IMenuNode {
  label?: string;
  key: string;
  children?: IMenuNode[];
  disabled?: boolean;
}
export type IMenuEventInfo = {
  delete: (key: string) => void;
  enable: (key: string) => void;
  disable: (key: string) => void;
  update: (node: IMenuNode) => void;
  insert: (node: IMenuNode, parentKey?: string, lastKey?: string) => void;
  select: (key: string) => void;
};
export type IMenuEventEmitter = IEventEmitter<IMenuEventInfo>;
