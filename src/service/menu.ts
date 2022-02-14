import { IMenuEventEmitter } from "@/types";
import { DropdownOption } from "naive-ui";
import { reactive } from "vue";

export const useMenu = (
  emitter: IMenuEventEmitter,
  defaultValue: DropdownOption[] = []
): { menus: DropdownOption[] } => {
  const menus = reactive<DropdownOption[]>(defaultValue) as DropdownOption[];
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
    node: DropdownOption,
    parentKey?: string,
    lastKey?: string
  ) => {
    if (!parentKey) {
      menus.push(node);
      if (node.label) {
        const item = menus[menus.length - 1];
        menuList[node.key as string] = () => {
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
        parent.children.splice(index + 1, 0, node);
        if (node.label) {
          const item = parent.children[index + 1];
          menuList[node.key as string] = () => {
            return item;
          };
        }
      } else {
        if (!parent.children) {
          parent.children = [node as DropdownOption];
        } else {
          parent.children.unshift(node as DropdownOption);
        }
        const item = parent.children[0];
        menuList[node.key as string] = () => {
          return item;
        };
      }
      parentInfo[node.key as string] = parentKey;
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
  const updateItem = (node: DropdownOption) => {
    const item = menuList[node.key as string]?.();
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
    const parent = menuList[parentInfo[node.key as string]]?.();
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
