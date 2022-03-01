import {
  defineComponent,
  inject,
  nextTick,
  PropType,
  Ref,
  ref,
  watch,
} from "vue";
import Dropdown, { IDropdownItem } from "../dropdown";
import Icon from "../icon";
import style from "./index.module.scss";

const Select = defineComponent({
  props: {
    options: {
      type: Array as PropType<
        {
          label: string;
          value: string;
        }[]
      >,
      default: () => {
        return [];
      },
    },
    defaultValue: {
      type: [String, Object] as PropType<string | string[] | null>,
    },
    value: {
      type: [String, Object] as PropType<string | string[] | null>,
      validate: (val: string | string[] | null) => {
        return typeof val === "string" || Array.isArray(val) || val === null;
      },
    },
    multi: {
      type: Boolean,
    },
    autoWidth: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
    },
    size: {
      type: String as PropType<"small" | "medium" | "large">,
    },
  },
  emits: {
    "update:value": (val: string | string[]) => {
      if (typeof val === "string") {
        return true;
      }
      if (Array.isArray(val)) {
        return true;
      }
    },
  },
  setup(props, { emit }) {
    const visible = ref(false);
    const focus = ref(false);
    const value = ref<string | string[] | null>(
      props.defaultValue === undefined ? null : props.defaultValue
    );
    watch(
      () => props.value,
      (val) => {
        if (val !== undefined) {
          value.value = val;
        }
      }
    );
    const size = inject<Ref<"small" | "medium" | "large"> | null>("size", null);
    const onRenderLabel = (node: IDropdownItem) => {
      const label = typeof node.label === "string" ? node.label : node.label();
      const list =
        typeof value.value === "string" ? [value.value] : value.value || [];
      const classList: string[] = [style.label];
      if (list.includes(node.key)) {
        classList.push(style.selected);
      }
      return (
        <div class={classList.join(" ")}>
          {props.multi && (
            <Icon
              namespace="noix"
              name={(list.includes(node.key) && "select") || ""}
              style={{ marginRight: "8px" }}
            />
          )}
          {label}
        </div>
      );
    };
    return () => {
      const _size = size?.value || props.size || "medium";
      return (
        <div
          class={`${style["select-wrapper"]} ${
            focus.value ? style.focus : ""
          } ${props.disabled ? style.disabled : ""} ${style[_size]}`}
          tabindex={0}
          onFocus={() => {
            if (props.disabled) {
              return;
            }
            focus.value = true;
            nextTick(() => {
              visible.value = true;
            });
          }}
          onBlur={() => {
            focus.value = false;
            visible.value = false;
          }}
        >
          <div
            class={style.select}
            onClick={() => {
              if (focus.value && !visible.value) {
                visible.value = !visible.value;
              }
            }}
          >
            <div>
              {Array.isArray(value.value)
                ? value.value
                    .map((o) => props.options.find((i) => i.value === o)?.label)
                    .join(",")
                : props.options.find((o) => o.value === value.value)?.label}
            </div>
            <div>
              <Icon
                namespace="noix"
                name={visible.value ? "arrow-down" : "arrow-right"}
              />
            </div>
          </div>
          <Dropdown
            visible={!props.disabled && visible.value}
            onClose={() => {
              if (!focus.value) {
                visible.value = false;
              }
            }}
            dataSource={props.options.map((opt) => {
              return {
                label: opt.label,
                key: opt.value,
              };
            })}
            onSelect={(node) => {
              if (!props.multi) {
                if (props.value !== undefined) {
                  emit("update:value", node.key);
                } else {
                  value.value = node.key;
                }
                visible.value = false;
              } else {
                const list = [...((value.value as string[]) || [])];
                const index = list.findIndex((i) => i === node.key);
                if (index === -1) {
                  list.push(node.key);
                } else {
                  list.splice(index, 1);
                }
                if (props.value !== undefined) {
                  emit("update:value", list);
                } else {
                  value.value = list;
                }
              }
            }}
            label={onRenderLabel}
            autoClose={false}
            width={props.autoWidth ? "var(--form-item-width)" : undefined}
          ></Dropdown>
        </div>
      );
    };
  },
});
export default Select;
