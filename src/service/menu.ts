import { IEventEmitter, IMenuEventInfo, IMenuOption } from "@/types";

const useMenu = (
  emitter: IEventEmitter<IMenuEventInfo>,
  getTreeNode: (key: string) => IMenuOption | undefined
) => {
  const enbale = (key: string) => {
    const node = getTreeNode(key);
    if (node) {
      node.disabled = false;
    }
  };
  const disable = (key: string) => {
    const node = getTreeNode(key);
    if (node) {
      node.disabled = true;
    }
  };
  const init = () => {
    emitter.on("enable", enbale);
    emitter.on("disable", disable);
    emitter.emit("ready");
  };
  const release = () => {
    emitter.release("enable", enbale);
    emitter.release("disable", disable);
  };
  return { init, release };
};
export { useMenu };
