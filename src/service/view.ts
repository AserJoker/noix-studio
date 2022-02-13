import { IEventEmitter, IView } from "@/types";
import { ITreeEventInfo } from "./tree";

export const useView = (
  emitter: IEventEmitter<ITreeEventInfo<IView>>,
  getTreeNode: (key: string) => IView | undefined,
  getParentNode: (key: string) => IView | undefined
) => {
  const splitView = (
    key: string,
    children0Key = `${key}.children[0]`,
    children1Key = `${key}.children[1]`,
    split: string | undefined = undefined
  ) => {
    const node = getTreeNode(key);
    if (node && node.type === "window") {
      const { windowKey } = node;
      emitter.emit("update", {
        key,
        type: "group",
        direction: "row",
        split,
      });
      emitter.emit(
        "insert",
        {
          key: children0Key,
          type: "window",
          windowKey: windowKey,
        },
        key
      );
      emitter.emit(
        "insert",
        {
          key: children1Key,
          type: "window",
          windowKey: windowKey,
        },
        key,
        children0Key
      );
    }
  };
  const vsplitView = (
    key: string,
    children0Key = `${key}.children[0]`,
    children1Key = `${key}.children[1]`,
    split: string | undefined = undefined
  ) => {
    const node = getTreeNode(key);
    if (node && node.type === "window") {
      const { windowKey } = node;
      emitter.emit("update", {
        key,
        type: "group",
        direction: "column",
        split,
      });
      emitter.emit(
        "insert",
        {
          key: children0Key,
          type: "window",
          windowKey: windowKey,
        },
        key
      );
      emitter.emit(
        "insert",
        {
          key: children1Key,
          type: "window",
          windowKey: windowKey,
        },
        key,
        children0Key
      );
    }
  };
  const disposeView = (key: string) => {
    if (!getTreeNode(key)) {
      throw new Error(`cannot find view id#${key}`);
    }
    const parent = getParentNode(key);
    if (!parent) {
      throw new Error("you cannot dispose a root node");
    }
    emitter.emit("delete", key);
    if (parent.type === "group")
      emitter.emit("update", {
        ...parent.children[0],
        key: parent.key,
      });
  };
  return { splitView, vsplitView, disposeView };
};
