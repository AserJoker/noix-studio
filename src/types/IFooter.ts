import { VNodeChild } from "vue";
import { IEventEmitter } from ".";

export interface IFooterItem {
  content: () => VNodeChild;
  key: string;
}
export type IFooterInfo = {
  select: (key: string) => void;
  insert: (item: IFooterItem, lastKey?: string) => void;
  delete: (key: string) => void;
};
export type IFooterEventEmitter = IEventEmitter<IFooterInfo>;
