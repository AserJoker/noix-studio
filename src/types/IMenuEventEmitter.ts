export interface IMenuOption {
  key: string;
  children?: IMenuOption[];
  label: string;
  disabled?: boolean;
}
export type IMenuEventInfo = {
  enable: (key: string) => void;
  disable: (key: string) => void;
  select: (key: string) => void;
  ready: () => void;
};
