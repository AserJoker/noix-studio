import {
  Component,
  DefineComponent,
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
export interface IFormProps {
  labelWidth?: string | number;
  labelAlign?: "left" | "right" | "top";
  inline?: boolean;
  size?: "small" | "medium" | "large";
}
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
export interface IFormItemProps {
  label?: string;
  labelWidth?: string | number;
  labelAlign?: "left" | "right" | "top";
  required?: boolean;
  status?: "error" | "warning" | "success" | "notice" | "normal";
  help?: string;
  size?: "small" | "medium" | "large";
}
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
    const labelWidth = inject<Ref<number | string> | null>("labelWidth", null);
    const labelAlign = inject<Ref<"left" | "right" | "top"> | null>(
      "labelAlign",
      null
    );
    const size = inject<Ref<"small" | "medium" | "large"> | null>("size", null);

    return () => {
      const _labelWidth =
        (props.labelWidth === undefined
          ? labelWidth?.value
          : props.labelWidth) || 80;

      const maxWidth =
        typeof _labelWidth === "string" ? _labelWidth : `${_labelWidth}px`;

      const _labelAlign = props.labelAlign || labelAlign?.value || "left";
      const _size = size?.value || props.size || "medium";
      const classes = [style["form-item"]];
      classes.push(style[`${_labelAlign}-item`]);
      classes.push(style[_size]);
      return (
        <div class={classes.join(" ")}>
          <label
            class={`${style.label} ${style[_labelAlign] || ""}`}
            style={{
              maxWidth,
              width: maxWidth,
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
interface IFromParam {
  formProps?: IFormProps;
  items: (IFormItemProps & {
    Component: Component;
    name: string;
    extraProps?: Record<string, unknown>;
  })[];
  validate?: (
    name: string,
    value: unknown,
    record: Record<string, unknown>
  ) => Promise<{ success: boolean; message: string }>;
}
export const useForm = ({ formProps = {}, items, validate }: IFromParam) => {
  return defineComponent({
    props: {
      value: {
        type: Object as PropType<Record<string, unknown>>,
      },
    },
    emits: {
      "update:value": (val: Record<string, unknown>) => {
        return typeof val === "object";
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      change: (name: string, _value: unknown) => {
        return typeof name === "string";
      },
    },
    expose: ["setHelp", "validate"],
    setup(props, { expose }) {
      const record = ref<Record<string, unknown>>({});
      watch(
        () => props.value,
        () => {
          record.value = props.value || {};
        },
        { immediate: true }
      );
      const help = ref<
        Record<
          string,
          {
            help: string;
            type: "error" | "warning" | "success" | "notice" | "normal";
          }
        >
      >({});
      const setHelp = (
        name: string,
        status: "error" | "warning" | "success" | "notice" | "normal",
        message: string
      ) => {
        help.value[name] = {
          type: status,
          help: message,
        };
      };
      expose({
        setHelp,
      });
      const _validate = async () => {
        const validateResult: Record<
          string,
          { success: boolean; message: string }
        > = {};
        await Promise.all(
          items.map(async (item) => {
            const value = record.value[item.name];
            if (item.required) {
              if (
                value === undefined ||
                value === null ||
                value === [] ||
                value === ""
              ) {
                validateResult[item.name] = {
                  success: false,
                  message: `${item.label || item.name} is required`,
                };
                return;
              }
            }
            validate &&
              (validateResult[item.name] = await validate(
                item.name,
                value,
                record.value
              ));
          })
        );
        Object.keys(validateResult)
          .filter((key) => validateResult[key])
          .forEach((key) => {
            if (!validateResult[key].success) {
              setHelp(key, "error", validateResult[key].message);
            }
          });
        return validateResult;
      };
      return { help, record, setHelp, validate: _validate };
    },
    render() {
      const { help, record } = this;
      return (
        <Form {...formProps}>
          {items.map((item) => {
            const { Component, extraProps = {}, name, ...others } = item;
            const FieldComp = Component as DefineComponent<{
              value: unknown;
              "onUpdate:value"?: (val: unknown) => void;
            }>;

            return (
              <FormItem
                {...others}
                help={help[name]?.help}
                status={help[name]?.type}
              >
                <FieldComp
                  {...extraProps}
                  value={record[name]}
                  onUpdate:value={(val) => {
                    const _record = { ...record };
                    if (this.$props.value === undefined) {
                      record[name] = val;
                    }
                    this.$emit("update:value", _record);
                  }}
                />
              </FormItem>
            );
          })}
        </Form>
      );
    },
  });
};
