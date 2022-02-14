import { VNodeChild } from "vue";

export interface IWindow<T extends unknown[] = unknown[]> {
  classname: string;
  title: string;
  content: (...args: T) => VNodeChild;
  action?: {
    key: string;
    render: () => VNodeChild;
  }[];
  onAction?: (key: string) => void;
}
