import { VNodeChild } from "vue";
export interface IResource {
  label: string | (() => VNodeChild);
  key: string;
  prefix?: (node: IResource) => VNodeChild;
  suffix?: (node: IResource) => VNodeChild;
  resourceKey?: string;
  children?: IResource[];
}
