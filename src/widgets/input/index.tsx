import {
  defineComponent,
  inject,
  onMounted,
  PropType,
  Ref,
  ref,
  VNodeChild,
} from "vue";
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
    autofocus: {
      type: Boolean,
    },
    type: {
      type: String as PropType<"normal" | "baseline">,
    },
  },

  emits: {
    "update:value": (val: string | null) => {
      return typeof val === "string" || val === null;
    },
    focus: (e: FocusEvent) => {
      return e instanceof FocusEvent;
    },
    blur: (e: FocusEvent) => {
      return e instanceof FocusEvent;
    },
    click: (e: MouseEvent) => {
      return e instanceof MouseEvent;
    },
  },
  setup(props, { emit }) {
    const focus = ref(false);
    const size = inject<Ref<"small" | "medium" | "large"> | null>("size", null);
    const el = ref<HTMLInputElement | null>(null);
    onMounted(() => {
      if (props.autofocus) {
        if (el.value) {
          el.value.focus();
        }
      }
    });
    return () => {
      const _size = size?.value || props.size || "medium";
      return (
        <div
          class={`${style["input-wrapper"]} ${focus.value ? style.focus : ""} ${
            style[_size]
          } ${props.disabled ? style.disabled : ""} ${
            props.type === "baseline" ? style.baseline : ""
          }`}
        >
          {props.prefix && props.prefix()}
          <input
            ref={el}
            class={`${style.input} ${props.disabled ? style.disabled : ""}`}
            onFocus={(e) => {
              focus.value = true;
              emit("focus", e);
            }}
            onBlur={(e) => {
              focus.value = false;
              emit("blur", e);
            }}
            value={props.value}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              emit("update:value", target.value);
            }}
            disabled={props.disabled}
            onClick={(e) => emit("click", e)}
          />
          {props.suffix && props.suffix()}
        </div>
      );
    };
  },
});
export default Input;
