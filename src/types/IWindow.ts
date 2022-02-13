import { VNodeChild } from "vue";

export interface IWindow<T extends unknown[] = unknown[]> {
  key: string;
  content: (...args: T) => VNodeChild;
}
