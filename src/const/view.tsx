import { IView } from "@/types";
import { TOKEN_WELCOME_WINDOW } from "@/windows/welcome";

export const view: IView = {
  type: "group",
  key: "root",
  split: "0px",
  direction: "column",
  children: [
    {
      type: "window",
      key: "empty",
      classname: [],
    },
    {
      type: "window",
      key: "workbranch",
      classname: [TOKEN_WELCOME_WINDOW],
    },
  ],
};
