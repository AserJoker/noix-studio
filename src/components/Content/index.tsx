import { defineComponent, onMounted, onUnmounted } from "vue";
import View from "@/components/View";
import style from "./index.module.scss";
import { ITreeEventInfo, useTree } from "@/service";
import { useEventEmitter } from "@/service";
import { IEventEmitter, IView, IViewEventInfo } from "@/types";
import { view } from "@/const/view";
import { useView } from "@/service/view";
import { TOKEN_VIEW_EMITTER } from "@/const";
const Content = defineComponent({
  setup() {
    const $view = useEventEmitter<ITreeEventInfo<IView> & IViewEventInfo>(
      TOKEN_VIEW_EMITTER
    );
    const {
      tree,
      getTreeNode,
      getParentNode,
      init: initTree,
      release: releaseTree,
    } = useTree<IView>($view as IEventEmitter<ITreeEventInfo<IView>>, view);
    const { init, release } = useView($view, getTreeNode, getParentNode);
    onMounted(() => {
      initTree();
      init();
    });
    onUnmounted(() => {
      release();
      releaseTree();
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
