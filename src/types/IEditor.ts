import { VNodeChild } from "vue";

export interface IEditor {
  render: () => VNodeChild;
  check: (type: string) => boolean;
}
