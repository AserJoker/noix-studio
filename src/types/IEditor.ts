import { VNodeChild } from "vue";
import { IBuffer } from "./IBuffer";

export interface IEditor {
  render: (buf: IBuffer) => VNodeChild;
  check: (type: string) => boolean;
  name: string;
}
