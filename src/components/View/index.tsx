import { useWindow } from "@/service";
import { IView } from "@/types";
import { defineComponent, PropType } from "vue";
import style from "./index.module.scss";

const View = defineComponent({
  props: {
    text: String,
    node: {
      type: Object as PropType<IView>,
    },
  },
  setup(props) {
    const { renderWindow } = useWindow();
    return () => {
      if (!props.node) {
        return null;
      }
      if (props.node.type === "window") {
        return (
          <div class={`${style.view}`}>
            {renderWindow(props.node.windowKey, props.node.key)}
          </div>
        );
      } else if (props.node.type === "group") {
        const children0Style = {} as Record<string, unknown>;
        if (props.node.direction === "row") {
          if (props.node.split) {
            children0Style.width = props.node.split;
          } else {
            children0Style.width = "50%";
          }
        } else if (props.node.direction === "column") {
          children0Style.height = props.node.split;
          if (props.node.split) {
            children0Style.height = props.node.split;
          } else {
            children0Style.height = "50%";
          }
        }
        return (
          <div
            class={`${style.view} ${style[`${props.node.direction}-group`]}`}
          >
            <div class={style["group-item"]} style={{ ...children0Style }}>
              <View node={props.node.children[0]} />
            </div>
            <div class={style["group-item"]}>
              <View node={props.node.children[1]} />
            </div>
          </div>
        );
      }
    };
  },
});
export default View;
