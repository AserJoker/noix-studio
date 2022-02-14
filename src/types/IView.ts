interface IBaseView {
  type: "window" | "group";
  key: string;
}
interface IGroupView extends IBaseView {
  type: "group";
  direction: "row" | "column";
  children: [IView, IView];
  split: string;
  reverse?: boolean;
}
interface IWindowView extends IBaseView {
  type: "window";
  classname: string[];
}
export type IView = IGroupView | IWindowView;
