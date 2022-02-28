import { defineComponent, PropType, ref, VNodeChild, watch } from "vue";
import style from "./index.module.scss";
import Icon from "../icon";
export interface ITreeNode {
  key: string;
  label: string;
  children?: ITreeNode[];
  prefix?: (node: ITreeNode) => VNodeChild;
  stuffix?: (node: ITreeNode) => VNodeChild;
}
interface IAction {
  key: string;
  render: (node: ITreeNode) => VNodeChild;
}
const Tree = defineComponent({
  props: {
    data: {
      type: Object as PropType<ITreeNode[]>,
      default: [],
    },
    selectedKeys: {
      type: Object as PropType<string[]>,
    },
    multi: {
      type: Boolean,
    },
    prefix: {
      type: Function as PropType<(node: ITreeNode) => VNodeChild>,
    },
    suffix: {
      type: Function as PropType<(node: ITreeNode) => VNodeChild>,
    },
    label: {
      type: Function as PropType<(node: ITreeNode) => VNodeChild>,
    },
    actions: {
      type: Object as PropType<IAction[]>,
    },
    canSelected: {
      type: Boolean,
      default: true,
    },
  },
  emits: {
    select: (keys: string[]) => {
      return Array.isArray(keys);
    },
    contextmenu: (node: ITreeNode, e: MouseEvent) => {
      return typeof node === "object" && typeof e === "object";
    },
    click: (node: ITreeNode, e: MouseEvent) => {
      return typeof node === "object" && typeof e === "object";
    },
    update: (node: Partial<ITreeNode> & { key: string }) => {
      return node.key !== null;
    },
    action: (act: string, node: ITreeNode) => {
      return typeof act === "string" && typeof node === "object";
    },
  },
  setup: (props, { emit }) => {
    const expandKeys = ref<string[]>([]);
    const selectedKeys = ref<string[]>([]);
    const renderLabel = (node: ITreeNode) => {
      return <div>{node.label}</div>;
    };
    const onClickNode = (node: ITreeNode, event: MouseEvent) => {
      if (node.children) {
        const index = expandKeys.value.findIndex((i) => i === node.key);
        if (index === -1) {
          expandKeys.value.push(node.key);
        } else {
          expandKeys.value.splice(index, 1);
        }
      }
      if (props.canSelected) {
        if (props.multi) {
          if (!selectedKeys.value.includes(node.key)) {
            selectedKeys.value.push(node.key);
            emit("select", selectedKeys.value);
          }
        } else {
          selectedKeys.value = [node.key];
          emit("select", selectedKeys.value);
        }
      }
      emit("click", node, event);
    };
    watch(
      () => props.selectedKeys,
      () => {
        if (props.selectedKeys) {
          selectedKeys.value = props.selectedKeys;
        }
      }
    );
    const renderTreeNode = (node: ITreeNode, depth = 0) => {
      return (
        <div key={node.key} class={style.treenode}>
          <div
            class={
              selectedKeys.value.includes(node.key)
                ? style.selectedItem
                : style.item
            }
            style={{ paddingLeft: `${depth * 16}px` }}
            onClick={(e) => onClickNode(node, e)}
            onContextmenu={(e) => {
              emit("contextmenu", node, e);
            }}
          >
            <div class={style.label}>
              {node.children && (
                <div class={style.icon}>
                  <Icon
                    namespace="noix"
                    name={
                      expandKeys.value.includes(node.key)
                        ? "arrow-down"
                        : "arrow-right"
                    }
                  />
                </div>
              )}
              <div class={style.prefix}>
                {(props.prefix && props.prefix(node)) ||
                  (node.prefix && node.prefix(node))}
              </div>
              <div>
                {(props.label && props.label(node)) || renderLabel(node)}
              </div>
            </div>
            <div class={style.label}>
              <div class={style.suffix}>
                {(props.suffix && props.suffix(node)) ||
                  (node.stuffix && node.stuffix(node))}
              </div>
              {props.actions &&
                props.actions.map((act) => {
                  const action = act.render(node);
                  return (
                    action && (
                      <div
                        key={act.key}
                        class={style.action}
                        onClick={(e) => {
                          emit("action", act.key, node);
                          e.stopPropagation();
                        }}
                      >
                        {action}
                      </div>
                    )
                  );
                })}
            </div>
          </div>
          {expandKeys.value.includes(node.key) && node.children && (
            <div>
              {node.children.map((item) => renderTreeNode(item, depth + 1))}
            </div>
          )}
        </div>
      );
    };
    return () => {
      const { data } = props;
      return <div>{data.map((item) => renderTreeNode(item))}</div>;
    };
  },
});
export default Tree;
