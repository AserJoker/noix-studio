import { IOption } from "@/types";
import { defineComponent, inject, PropType, Ref, ref, watch } from "vue";
import Icon from "../icon";
import style from "./index.module.scss";
const Radio = defineComponent({
  props: {
    options: {
      type: Object as PropType<IOption[]>,
      default: () => [],
    },
    value: {
      type: String as PropType<string | null>,
    },
    disabled: {
      type: Boolean,
    },
    size: {
      type: String as PropType<"small" | "medium" | "large">,
    },
  },
  emits: {
    "update:value": (val: string | null) => {
      return typeof val === "string" || val === null;
    },
  },
  setup(props, { emit }) {
    const value = ref<string | null>(null);
    watch(
      () => props.value,
      () => {
        value.value = props.value || null;
      }
    );
    const size = inject<Ref<"small" | "medium" | "large"> | null>("size", null);
    return () => {
      const _size = size?.value || props.size || "medium";
      const { options } = props;
      const classes = [style["radio"]];
      const itemclasses = [style["item"]];
      classes.push(style[_size]);
      if (props.disabled) {
        itemclasses.push(style["disabled"]);
      }
      return (
        <div class={classes.join(" ")}>
          {options.map((opt) => {
            return (
              <div
                key={opt.key}
                class={itemclasses.join(" ")}
                onClick={() => {
                  if (props.disabled) {
                    return;
                  }
                  if (props.value === undefined) {
                    value.value = opt.key;
                  }
                  emit("update:value", opt.key);
                }}
              >
                <Icon
                  namespace="noix"
                  name={
                    value.value === opt.key
                      ? "radio-button-select"
                      : "radio-button-unselect"
                  }
                  size="1.2em"
                />
                <label class={style.label}>{opt.label}</label>
              </div>
            );
          })}
        </div>
      );
    };
  },
});
export default Radio;
