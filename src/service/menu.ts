import { IMenuEventEmitter, IMenuNode } from "@/types";
import { DropdownOption } from "naive-ui";
import { reactive } from "vue";

export const useMenu = (
  emitter: IMenuEventEmitter
): { menus: DropdownOption[] } => {
  const menus = reactive<DropdownOption[]>([]) as DropdownOption[];
  const menuList: Record<string, () => DropdownOption> = {};
  const parentInfo: Record<string, string> = {};
  const deleteItem = (key: string) => {
    const parentKey = parentInfo[key];
    const parent = menuList[parentKey]?.();
    if (!parent) {
      throw new Error(`failed to find menu node id#${parentKey}`);
    }
    if (!parent.children) {
      throw new Error(`failed to find menu node id#${key}`);
    }
    const index = parent.children.findIndex((item) => item.key === key);
    if (index !== -1) {
      const item = parent.children.splice(index, 1);
      clearChildren(item[0]);
    }
  };
  const clearChildren = (item: DropdownOption) => {
    delete menuList[item.key as string];
    delete parentInfo[item.key as string];
    item.children && item.children.forEach((c) => clearChildren(c));
  };
  const insertItem = (
    node: IMenuNode,
    parentKey?: string,
    lastKey?: string
  ) => {
    const menuitem = node.label
      ? {
          ...node,
          children: undefined,
        }
      : {
          key: node.key,
          type: "divider",
        };
    if (!parentKey) {
      menus.push(menuitem);
      if (node.label) {
        const item = menus[menus.length - 1];
        menuList[node.key] = () => {
          return item as DropdownOption;
        };
      }
    } else {
      const parent = menuList[parentKey]?.();
      if (!parent) {
        throw new Error(`cannot find menu node id#${parentKey}`);
      }
      if (lastKey) {
        if (!parent.children) {
          throw new Error(`cannot find menu node id#${lastKey}`);
        }
        const index = parent.children.findIndex((item) => item.key === lastKey);
        if (index === -1) {
          throw new Error(`cannot find menu node id#${lastKey}`);
        }
        parent.children.splice(index + 1, 0, menuitem);
        if (node.label) {
          const item = parent.children[index + 1];
          menuList[node.key] = () => {
            return item;
          };
        }
      } else {
        if (!parent.children) {
          parent.children = [menuitem as DropdownOption];
        } else {
          parent.children.unshift(menuitem as DropdownOption);
        }
        const item = parent.children[0];
        menuList[node.key] = () => {
          return item;
        };
      }
      parentInfo[node.key] = parentKey;
    }
  };
  const enableItem = (key: string) => {
    const item = menuList[key]?.();
    if (item) {
      item.disabled = false;
    }
  };
  const disableItem = (key: string) => {
    const item = menuList[key]?.();
    if (item) {
      item.disabled = true;
    }
  };
  const updateItem = (node: IMenuNode) => {
    const item = menuList[node.key]?.();
    if (!item) {
      throw new Error(`cannot find menu node id#${node.key}`);
    }
    const menuitem = node.label
      ? {
          ...node,
          children: item.children,
        }
      : {
          key: node.key,
          type: "divider",
        };
    const parent = menuList[parentInfo[node.key]]?.();
    if (parent && parent.children) {
      const index = parent.children.findIndex((item) => item.key === node.key);
      if (index !== -1) {
        parent.children.splice(index, 1, menuitem);
      }
    } else {
      const index = menus.findIndex((item) => item.key === node.key);
      if (index !== -1) {
        menus.splice(index, 1, menuitem);
      }
    }
  };
  emitter.on("insert", insertItem);
  emitter.on("delete", deleteItem);
  emitter.on("enable", enableItem);
  emitter.on("disable", disableItem);
  emitter.on("update", updateItem);
  return { menus };
};
