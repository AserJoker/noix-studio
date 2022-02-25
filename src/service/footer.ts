import { IFooterEventEmitter, IFooterItem } from "@/types";
import { reactive } from "vue";

export const useFooter = (
  emitter: IFooterEventEmitter,
  defaultValue: IFooterItem[]
) => {
  const items = reactive<IFooterItem[]>(defaultValue) as IFooterItem[];
  const insert = (item: IFooterItem, lastKey?: string) => {
    if (!lastKey) {
      items.unshift(item);
    } else {
      const index = items.findIndex((i) => i.key === lastKey);
      items.splice(index + 1, 0, item);
    }
  };
  const _delete = (key: string) => {
    const index = items.findIndex((i) => i.key === key);
    items.splice(index, 1);
  };
  const init = () => {
    emitter.on("insert", insert);
    emitter.on("delete", _delete);
    emitter.emit("ready");
  };
  const release = () => {
    emitter.release("insert", insert);
    emitter.release("delete", _delete);
  };
  return { items, init, release };
};
