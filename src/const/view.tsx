import { IView } from "@/types";
import { TOKEN_WELCOME_WINDOW } from "@/windows/welcome";

export const view: IView = {
  type: "window",
  key: "root",
  classname: [TOKEN_WELCOME_WINDOW],
};
export const TOKEN_VIEW_EMITTER = "token.emitter.view";
