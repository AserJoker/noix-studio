import { defineComponent } from "vue";
import View from "@/components/View";
import style from "./index.module.scss";
import { ITreeEventInfo, useTree } from "@/service";
import { useEventEmitter } from "@/service";
import { IEventEmitter, IView, IViewEventInfo } from "@/types";
import { view, TOKEN_VIEW_EMITTER } from "@/const/view";
import { useView } from "@/service/view";
const Content = defineComponent({
  setup() {
    const $view = useEventEmitter<ITreeEventInfo<IView> & IViewEventInfo>(
      TOKEN_VIEW_EMITTER
    );
    const { tree, getTreeNode, getParentNode } = useTree<IView>(
      $view as IEventEmitter<ITreeEventInfo<IView>>,
      view
    );
    useView($view, getTreeNode, getParentNode);
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
