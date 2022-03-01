import { defineComponent, inject, PropType, Ref } from "vue";
import style from "./index.module.scss";
const Button = defineComponent({
  props: {
    size: {
      type: String as PropType<"small" | "medium" | "large">,
    },
    type: {
      type: String as PropType<
        "default" | "primary" | "success" | "warning" | "notice" | "danger"
      >,
      default: "default",
    },
  },
  emits: {
    click: (e: MouseEvent) => {
      return e != null;
    },
  },
  setup(props, { emit, slots }) {
    const size = inject<Ref<"small" | "medium" | "large"> | null>("size", null);
    const onClick = (e: MouseEvent) => {
      emit("click", e);
    };
    return () => {
      const _size = size?.value || props.size || "medium";
      return (
        <button
          class={`${style.button} ${style[_size]} ${
            style[`type-${props.type}`] || ""
          }`}
          onClick={onClick}
        >
          {slots.default && slots.default()}
        </button>
      );
    };
  },
});
export default Button;
