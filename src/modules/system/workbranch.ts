import { TOKEN_WORKBRANCH_EMITTER } from "@/const";
import { useEventEmitter } from "@/service";
import { IWorkbranchEventInfo } from "./types/IWorkbranchEventEmittor";
import ComponentEditor from "./workbranchs/component-editor";

export const installWorkbranch = () => {
  const $workbranch = useEventEmitter<IWorkbranchEventInfo>(
    TOKEN_WORKBRANCH_EMITTER
  );
  $workbranch.on("ready", () => {
    $workbranch.emit("install", ComponentEditor);
  });
};
