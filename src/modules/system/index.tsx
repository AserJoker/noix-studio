import { installCodeWindow } from "@/modules/system/windows/code";
import { installConsoleWindow } from "./windows/console";
import { installExplorerWindow } from "./windows/explorer";
import { installConsole } from "./console";
import { installExplorer } from "./explorer";
import { installMenu } from "./menu";
import { installNewTemplateProejctWindow } from "./windows/new-template-project";
import { installWorkbranchWindow } from "./windows/workbranch";

const installWindow = () => {
  installConsoleWindow();
  installExplorerWindow();
  installWorkbranchWindow();
  installCodeWindow();
  installNewTemplateProejctWindow();
};
const system = {
  install: () => {
    installWindow();
    installConsole();
    installExplorer();
    installMenu();
  },
};
export default system;
