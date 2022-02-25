import { defineComponent, PropType } from "vue";
import style from "./index.module.scss";
const Button = defineComponent({
  props: {
    type: {
      type: String as PropType<
        "default" | "primary" | "info" | "success" | "warning" | "error"
      >,
      default: "primary",
    },
    size: {
      type: String as PropType<"small" | "medium" | "large">,
      default: "medium",
    },
    text: {
      type: Boolean,
    },
    disabeld: {
      type: Boolean,
    },
    dashed: {
      type: Boolean,
    },
  },
  emits: {
    click: (e: MouseEvent) => {
      return e != null;
    },
  },
  setup(props, { emit, slots }) {
    const onClick = (e: MouseEvent) => {
      emit("click", e);
    };
    return () => {
      const classes = ["button"];
      classes.push(props.type);
      classes.push(props.size);
      if (props.dashed) {
        classes.push("dashed");
      }
      return (
        <button
          class={classes.map((name) => style[name]).join(" ")}
          onClick={onClick}
        >
          {slots.default && slots.default()}
        </button>
      );
    };
  },
});
export default Button;
