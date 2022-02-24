import { IEventEmitter } from "@/types";
import { reactive } from "vue";

export type ITreeEventInfo<T> = {
  delete: (key: string) => void;
  update: (node: T) => void;
  insert: (node: T, parentKey: string, lastKey?: string) => void;
  upgrade: (node: Partial<T> & { key: string }) => void;
};
export const useTree = <T extends { children?: T[]; key: string }>(
  emitter: IEventEmitter<ITreeEventInfo<T>>,
  defaultValue: T
) => {
  const tree = reactive<T>(defaultValue) as T;
  const treeList: Record<string, () => T> = {};
  const parentInfo: Record<string, string> = {};
  const updateTreeList = (node: T) => {
    treeList[node.key] = () => node;
    node.children &&
      node.children.forEach((c) => {
        parentInfo[c.key] = node.key;
        updateTreeList(c);
      });
  };
  updateTreeList(tree);
  const deleteItem = (key: string) => {
    const parentKey = parentInfo[key];
    const parent = treeList[parentKey]?.();
    if (!parent) {
      throw new Error(`cannot delete root node id#${key}`);
    }
    if (!parent.children) {
      throw new Error(`failed to find tree node id#${key}`);
    }
    const index = parent.children.findIndex((item) => item.key === key);
    if (index !== -1) {
      const item = parent.children.splice(index, 1);
      clearChildren(item[0]);
    }
  };
  const clearChildren = (item: T) => {
    delete treeList[item.key as string];
    delete parentInfo[item.key as string];
    item.children && item.children.forEach((c) => clearChildren(c));
  };
  const insertItem = (node: T, parentKey: string, lastKey?: string) => {
    const parent = treeList[parentKey]?.();
    if (!parent) {
      throw new Error(`cannot find tree node id#${parentKey}`);
    }
    if (lastKey) {
      if (!parent.children) {
        throw new Error(`cannot find tree node id#${lastKey}`);
      }
      const index = parent.children.findIndex((item) => item.key === lastKey);
      if (index === -1) {
        throw new Error(`cannot find tree node id#${lastKey}`);
      }
      parent.children.splice(index + 1, 0, node);
      const item = parent.children[index + 1];
      treeList[node.key] = () => {
        return item;
      };
    } else {
      if (!parent.children) {
        parent.children = [node];
      } else {
        parent.children.unshift(node);
      }
      const item = parent.children[0];
      treeList[node.key] = () => {
        return item;
      };
    }
    parentInfo[node.key] = parentKey;
  };
  const updateItem = (node: T) => {
    const item = treeList[node.key]?.();
    if (!item) {
      throw new Error(`cannot find tree node id#${node.key}`);
    }
    const parent = treeList[parentInfo[node.key]]?.();
    if (parent && parent.children) {
      const index = parent.children.findIndex((item) => item.key === node.key);
      if (index !== -1) {
        parent.children.splice(index, 1, node);
        const item = parent.children[index];
        treeList[node.key] = () => item;
      }
    } else {
      Object.keys(item).forEach((key) => {
        delete item[key as keyof T];
      });
      Object.keys(node).forEach((key) => {
        item[key as keyof T] = node[key as keyof T];
      });
    }
  };
  const upgradeItem = (node: Partial<T> & { key: string }) => {
    const item = treeList[node.key]?.();
    if (!item) {
      throw new Error(`cannot find tree node id#${node.key}`);
    }
    Object.keys(node).forEach((key) => {
      item[key as keyof T] = node[key as keyof T] as T[keyof T];
    });
  };
  emitter.on("insert", insertItem);
  emitter.on("delete", deleteItem);
  emitter.on("update", updateItem);
  emitter.on("upgrade", upgradeItem);
  const getTreeNode = (key: string) => {
    return treeList[key]?.();
  };
  const getParentNode = (key: string) => {
    return treeList[parentInfo[key]]?.();
  };
  return { tree, getTreeNode, getParentNode };
};
