import {
  defineComponent,
  inject,
  PropType,
  provide,
  Ref,
  ref,
  watch,
} from "vue";
import Icon from "../icon";
import style from "./index.module.scss";
const Form = defineComponent({
  props: {
    labelWidth: {
      type: [String, Number] as PropType<string | number>,
      default: 80,
    },
    labelAlign: {
      type: String as PropType<"left" | "right" | "top">,
      default: "left",
    },
    inline: {
      type: Boolean,
    },
    size: {
      type: String as PropType<"small" | "medium" | "large">,
      default: "medium",
    },
  },
  setup(props, { slots }) {
    const labelWidth = ref<string | number>("");
    const labelAlign = ref<"left" | "right" | "top">("left");
    const size = ref<"small" | "medium" | "large">("medium");
    watch(
      () => props.labelWidth,
      () => {
        labelWidth.value = props.labelWidth;
      },
      { immediate: true }
    );
    watch(
      () => props.labelAlign,
      () => {
        labelAlign.value = props.labelAlign;
      },
      { immediate: true }
    );
    watch(
      () => props.size,
      () => {
        size.value = props.size;
      }
    );
    provide("labelWidth", labelWidth);
    provide("labelAlign", labelAlign);
    provide("size", size);
    return () => {
      const classes = [style.form];
      classes.push(style["form-normal"]);
      if (props.inline) {
        classes.push(style["form-inline"]);
      }
      return (
        <form class={classes.join(" ")}>
          {slots.default && slots.default()}
        </form>
      );
    };
  },
});
export const FormItem = defineComponent({
  props: {
    label: {
      type: String,
      default: "",
    },
    labelWidth: {
      type: [String, Number] as PropType<string | number>,
    },
    labelAlign: {
      type: String as PropType<"left" | "right" | "top">,
      default: "left",
    },
    help: {
      type: String,
    },
    required: {
      type: Boolean,
    },
    status: {
      type: String as PropType<
        "error" | "warning" | "success" | "notice" | "normal"
      >,
      default: "normal",
    },
    size: {
      type: String as PropType<"small" | "medium" | "large">,
    },
  },
  setup(props, { slots }) {
    const labelWidth = inject<Ref<number | string>>("labelWidth");
    const labelAlign = inject<Ref<"left" | "right" | "top">>("labelAlign");
    const size = inject<Ref<"small" | "medium" | "large">>("size");

    return () => {
      const _labelWidth =
        (props.labelWidth === undefined
          ? labelWidth?.value
          : props.labelWidth) || 80;

      const minWidth =
        typeof _labelWidth === "string" ? _labelWidth : `${_labelWidth}px`;

      const _labelAlign = labelAlign?.value || props.labelAlign || "left";
      const _size = size?.value || props.size || "medium";

      const classes = [style["form-item"]];
      classes.push(style[`${_labelAlign}-item`]);
      classes.push(style[_size]);
      return (
        <div class={classes.join(" ")}>
          <label
            class={`${style.label} ${style[_labelAlign] || ""}`}
            style={{
              minWidth,
            }}
          >
            <div>
              {props.required && _labelAlign === "right" && (
                <Icon
                  namespace="noix"
                  name="required"
                  color="var(--color-error)"
                />
              )}
              <span>{props.label}</span>
              {props.required && _labelAlign !== "right" && (
                <Icon
                  namespace="noix"
                  name="required"
                  color="var(--color-error)"
                />
              )}
            </div>
          </label>
          <div class={style[`status-${props.status}`]}>
            <div class={style.item}>{slots.default && slots.default()}</div>
            {props.help && <div class={style.help}>{props.help}</div>}
          </div>
        </div>
      );
    };
  },
});
export default Form;
