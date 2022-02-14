import { IView } from "@/types";
import { TOKEN_WELCOME_WINDOW } from "@/windows/welcome";

export const view: IView = {
  type: "window",
  classname: [TOKEN_WELCOME_WINDOW],
  key: "root",
};
export const TOKEN_VIEW_EMITTER = "token.emitter.view";
