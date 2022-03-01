import { defineComponent, inject, PropType, Ref, ref, VNodeChild } from "vue";
import style from "./index.module.scss";

const Input = defineComponent({
  props: {
    value: {
      type: [String, Object] as PropType<string | null>,
      default: null,
    },
    disabled: {
      type: Boolean,
    },
    size: {
      type: String as PropType<"small" | "medium" | "large">,
    },
    prefix: {
      type: Function as PropType<() => VNodeChild>,
    },
    suffix: {
      type: Function as PropType<() => VNodeChild>,
    },
  },

  emits: {
    "update:value": (val: string | null) => {
      return typeof val === "string" || val === null;
    },
  },
  setup(props, { emit }) {
    const focus = ref(false);
    const size = inject<Ref<"small" | "medium" | "large"> | null>("size", null);
    return () => {
      const _size = size?.value || props.size || "medium";
      return (
        <div
          class={`${style["input-wrapper"]} ${focus.value ? style.focus : ""} ${
            style[_size]
          } ${props.disabled ? style.disabled : ""}`}
        >
          {props.prefix && props.prefix()}
          <input
            class={`${style.input} ${props.disabled ? style.disabled : ""}`}
            onFocus={() => {
              focus.value = true;
            }}
            onBlur={() => {
              focus.value = false;
            }}
            value={props.value}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              emit("update:value", target.value);
            }}
            disabled={props.disabled}
          />
          {props.suffix && props.suffix()}
        </div>
      );
    };
  },
});
export default Input;
