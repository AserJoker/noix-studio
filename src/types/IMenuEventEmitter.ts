import { MenuOptionSharedPart } from "naive-ui/lib/menu/src/interface";
import { VNodeChild } from "vue";
type Option = MenuOptionSharedPart & {
  label?: string | (() => VNodeChild);
};
export interface IMenuOption extends Option {
  key: string;
  children?: IMenuOption[];
}
export type IMenuEventInfo = {
  enable: (key: string) => void;
  disable: (key: string) => void;
  select: (key: string) => void;
  ready: () => void;
};
