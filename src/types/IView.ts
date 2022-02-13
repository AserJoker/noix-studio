interface IBaseView {
  type: "window" | "group";
  key: string;
}
interface IGroupView extends IBaseView {
  type: "group";
  direction: "row" | "column";
  children: [IView, IView];
  split: string;
}
interface IWindowView extends IBaseView {
  type: "window";
  windowKey: string;
}
export type IView = IGroupView | IWindowView;
