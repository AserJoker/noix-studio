import { IOption } from "@/types";
import { defineComponent, inject, PropType, Ref, ref, watch } from "vue";
import Icon from "../icon";
import style from "./index.module.scss";
const Checkbox = defineComponent({
  props: {
    options: {
      type: Object as PropType<IOption[]>,
      default: () => [],
    },
    value: {
      type: Object as PropType<string[] | null>,
    },
    disabled: {
      type: Boolean,
    },
    size: {
      type: String as PropType<"small" | "medium" | "large">,
    },
  },
  emits: {
    "update:value": (val: string[] | null) => {
      return typeof Array.isArray(val) || val === null;
    },
  },
  setup(props, { emit }) {
    const value = ref<string[]>([]);
    watch(
      () => props.value,
      () => {
        value.value = props.value || [];
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
                  const list = [...value.value];
                  const index = list.findIndex((i) => i === opt.key);
                  if (index !== -1) {
                    list.splice(index, 1);
                  } else {
                    list.push(opt.key);
                  }
                  if (props.value === undefined) {
                    value.value = list;
                  }
                  emit("update:value", list);
                }}
              >
                <Icon
                  namespace="noix"
                  name={
                    value.value.includes(opt.key)
                      ? "checkbox-checked"
                      : "checkbox-unchecked"
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
export default Checkbox;
