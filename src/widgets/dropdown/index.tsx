import {
  defineComponent,
  nextTick,
  onUnmounted,
  PropType,
  ref,
  VNodeChild,
  watch,
} from "vue";
import Icon from "../icon";
import style from "./index.module.scss";
export interface IDropdownItem {
  label: string | (() => VNodeChild);
  key: string;
  children?: IDropdownItem[];
}
const Dropdown = defineComponent({
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    dataSource: {
      type: Object as PropType<IDropdownItem[]>,
      default: [],
    },
    x: {
      type: Number,
    },
    y: {
      type: Number,
    },
    autoClose: {
      type: Boolean,
      default: true,
    },
    label: {
      type: Function as PropType<(node: IDropdownItem) => VNodeChild>,
    },
    width: {
      type: [String, Number] as PropType<string | number>,
    },
  },
  emits: {
    select: (node: IDropdownItem) => {
      return typeof node === "object";
    },
    close: (...args: never[]) => {
      return args.length === 0;
    },
  },
  setup(props, { emit, attrs }) {
    const expandKeys = ref<Record<number, string>>({});
    const pos = ref("bottom-left");
    const el = ref<HTMLDivElement | null>(null);
    const renderItem = (node: IDropdownItem, level = 0) => {
      const width =
        typeof props.width === "number" ? `${props.width}px` : props.width;
      return (
        <div key={node.key} class={style.item}>
          <div
            onMouseover={() => {
              expandKeys.value[level] = node.key;
            }}
            class={style.title}
            onClick={(e) => {
              if (!node.children) {
                emit("select", node);
                expandKeys.value = {};
                if (props.autoClose) {
                  emit("close");
                }
              }
              e.stopPropagation();
            }}
          >
            <div>
              {(props.label && props.label(node)) ||
                (typeof node.label === "string" ? node.label : node.label())}
            </div>
            {node.children && (
              <div>
                <Icon namespace="noix" name="arrow-right" />
              </div>
            )}
          </div>
          {expandKeys.value[level] === node.key && node.children && (
            <div
              class={style.children}
              style={width ? { minWidth: width } : undefined}
            >
              {node.children.map((c) => renderItem(c, level + 1))}
            </div>
          )}
        </div>
      );
    };
    const onClickoutside = () => {
      if (props.visible) {
        expandKeys.value = {};
        emit("close");
      }
    };
    watch(
      () => props.visible,
      () => {
        if (props.visible) {
          setTimeout(() => {
            document.addEventListener("click", onClickoutside);
          });
        } else {
          document.removeEventListener("click", onClickoutside);
        }
        nextTick(() => {
          if (el.value) {
            if (el.value.getBoundingClientRect().right > window.innerWidth) {
              pos.value = "bottom-right";
            }
          }
        });
      }
    );
    onUnmounted(() => {
      document.removeEventListener("click", onClickoutside);
    });
    return () => {
      const { visible, dataSource } = props;
      const width =
        typeof props.width === "number" ? `${props.width}px` : props.width;
      if (!visible) {
        return null;
      }
      return (
        <div
          {...attrs}
          class={`${style.dropdown} ${style[pos.value]} ${attrs.class || ""}`}
          style={{ left: props.x + "px", top: props.y + "px", width: width }}
          ref={el}
        >
          {dataSource.map((item) => renderItem(item))}
        </div>
      );
    };
  },
});
export default Dropdown;
