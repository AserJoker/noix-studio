import { IEventEmitter, IMenuEventInfo, IMenuOption } from "@/types";

const useMenu = (
  emitter: IEventEmitter<IMenuEventInfo>,
  getTreeNode: (key: string) => IMenuOption | undefined
) => {
  emitter.on("enable", (key) => {
    const node = getTreeNode(key);
    if (node) {
      node.disabled = false;
    }
  });
  emitter.on("disable", (key) => {
    const node = getTreeNode(key);
    if (node) {
      node.disabled = true;
    }
  });
  emitter.emit("ready");
};
export { useMenu };
