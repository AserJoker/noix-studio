import { defineComponent, ref } from "vue";
import View from "@/components/View";
import style from "./index.module.scss";
import { useWindow } from "@/service";
import { ITreeEventInfo, useTree } from "@/service";
import { useEventEmitter } from "@/service";
import { IView } from "@/types";
import { useView } from "@/service/view";
const Content = defineComponent({
  setup() {
    const $view = useEventEmitter<ITreeEventInfo<IView>>("view");
    const { tree, getTreeNode, getParentNode } = useTree<IView>($view, {
      key: "root",
      type: "window",
      windowKey: "welcome",
    });
    const { vsplitView, splitView, disposeView } = useView(
      $view,
      getTreeNode,
      getParentNode
    );
    const { createWindow } = useWindow();
    const text = ref("welcome");
    createWindow({
      key: "welcome",
      content: (currentKey: string) => {
        return (
          <div>
            <div>{text.value}</div>
            <div>{currentKey}</div>
            <button
              onClick={() => {
                text.value = "hello world";
              }}
            >
              change
            </button>
            <button
              onClick={() => {
                vsplitView(currentKey);
              }}
            >
              vsplit
            </button>
            <button
              onClick={() => {
                splitView(currentKey);
              }}
            >
              split
            </button>
            <button
              onClick={() => {
                disposeView(currentKey);
              }}
            >
              dispose
            </button>
          </div>
        );
      },
    });
    return () => {
      return (
        <div class={style.content}>
          <View node={tree} />
        </div>
      );
    };
  },
});
export default Content;
