import { IFooterEventEmitter, IFooterItem } from "@/types";
import { reactive } from "vue";

export const useFooter = (
  emitter: IFooterEventEmitter,
  defaultValue: IFooterItem[]
) => {
  const items = reactive<IFooterItem[]>(defaultValue) as IFooterItem[];
  emitter.on("insert", (item, lastKey) => {
    if (!lastKey) {
      items.unshift(item);
    } else {
      const index = items.findIndex((i) => i.key === lastKey);
      items.splice(index + 1, 0, item);
    }
  });
  emitter.on("delete", (key) => {
    const index = items.findIndex((i) => i.key === key);
    items.splice(index, 1);
  });
  emitter.emit("ready");
  return { items };
};
