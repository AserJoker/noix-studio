import { IView } from "@/types";
import { TOKEN_CONSOLE_WINDOW } from "../console";
import { TOKEN_EXPLORER_WINDOW } from "../explorer";
import { TOKEN_WORKBRANCH_WINDOW } from "../workbranch";

export const view: IView = {
  key: "root",
  type: "group",
  direction: "row",
  split: "240px",
  children: [
    {
      type: "window",
      classname: [TOKEN_EXPLORER_WINDOW],
      key: "explorer",
    },
    {
      type: "group",
      key: "content",
      direction: "column",
      split: "240px",
      reverse: true,
      children: [
        {
          type: "window",
          key: "console",
          classname: [TOKEN_CONSOLE_WINDOW],
        },
        {
          type: "window",
          key: "workbranch",
          classname: [TOKEN_WORKBRANCH_WINDOW],
        },
      ],
    },
  ],
};
