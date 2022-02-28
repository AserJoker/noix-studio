import { defineComponent, PropType } from "vue";
import style from "./index.module.scss";
const Icon = defineComponent({
  props: {
    name: {
      type: String,
    },
    namespace: {
      type: String,
      default: "",
    },
    size: {
      type: [String, Number] as PropType<string | number>,
    },
    color: {
      type: String,
    },
  },
  setup(props) {
    return () => {
      return (
        <svg
          class={style.icon}
          aria-hidden="true"
          style={{ color: props.color, width: props.size, height: props.size }}
        >
          <use xlinkHref={`#${props.namespace}-${props.name}`}></use>
        </svg>
      );
    };
  },
});
export default Icon;
