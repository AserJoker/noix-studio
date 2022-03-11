import { TOKEN_BUFFER_EMITTER } from "@/const";
import { useEventEmitter } from "@/service";
import { IBuffer } from "@/types";
import { IBufferEventInfo } from "@/types/IBufferEventEmitter";
import { IEditor } from "@/types/IEditor";
import {
  defineComponent,
  h,
  onMounted,
  PropType,
  VNodeChild,
  resolveComponent,
  DefineComponent,
  ref,
} from "vue";
import style from "./index.module.scss";
interface IResolvedNode {
  name: string;
  children: IResolvedNode[];
  props: Record<string, unknown>;
  parent?: IResolvedNode;
}
const ComponentEditorWorkbranch = defineComponent({
  props: {
    buffer: {
      type: Object as PropType<IBuffer>,
      required: true,
    },
  },
  setup(props) {
    const $buffer = useEventEmitter<IBufferEventInfo>(TOKEN_BUFFER_EMITTER);
    const onChangeBuffer = (buf: string) => {
      $buffer.emit("change", props.buffer.name, buf);
    };
    onChangeBuffer;
    const tree = ref<IResolvedNode | null>(null);
    onMounted(() => {
      const buf = "<div></div>";
      const domTree = parser.parseFromString(buf, "text/xml");
      tree.value = resolveDOMTree(domTree.documentElement);
    });
    const resolveDOMTree = (root: Element) => {
      const children: IResolvedNode[] = [];
      for (let index = 0; index < root.children.length; index++) {
        children.push(resolveDOMTree(root.children[index]));
      }
      const props: Record<string, unknown> = {};
      for (let index = 0; index < root.attributes.length; index++) {
        const item = root.attributes.item(index);
        if (item) {
          props[item.name] = item.value;
        }
      }
      if (!root.children.length && root.textContent) {
        props.textContent = root.textContent;
      }
      return {
        name: root.tagName,
        children,
        props,
      };
    };
    const renderDom = (node: IResolvedNode): VNodeChild => {
      if (node.name.charAt(0) >= "A" && node.name.charAt(0) <= "Z") {
        const Comp = resolveComponent(node.name) as DefineComponent;
        if (Comp) {
          return h(Comp, node.props, {
            default: () => node.children.map((c) => renderDom(c)),
          });
        }
      }
      const children = [
        ...node.children.map((c) => renderDom(c)),
        h("div", {
          class: style.content,
          onDragover: (e: DragEvent) => {
            e.preventDefault();
          },
          onDrop: (e: DragEvent) => {
            const dom = e.dataTransfer?.getData("comp");
            const props = JSON.parse(e.dataTransfer?.getData("props") || "{}");
            if (dom) {
              node.children.push({
                name: dom,
                props,
                children: [],
                parent: node,
              });
            }
            e.stopPropagation();
          },
        }),
      ];
      return (
        <div class={style.wrapper}>
          <div class={style.headerbar}>
            <div>{node.name}</div>
            <div class={style.actionbar}>
              <button>edit</button>
              {node.parent && (
                <button
                  onClick={() => {
                    const parent = node.parent;
                    if (parent) {
                      const index = parent.children.findIndex(
                        (c) => c === node
                      );
                      if (index !== -1) {
                        parent.children.splice(index, 1);
                      }
                    }
                  }}
                >
                  remove
                </button>
              )}
            </div>
          </div>
          <div class={style.body}>{h(node.name, node.props, children)}</div>
        </div>
      );
    };
    const parser = new DOMParser();
    return () => {
      if (!tree.value) {
        return null;
      }
      return (
        <div class={style.container}>
          <div class={style.preview}>{renderDom(tree.value)}</div>
        </div>
      );
    };
  },
});
const ComponentEditor: IEditor = {
  check: (type) => type === "component",
  render: (buf: IBuffer) => <ComponentEditorWorkbranch buffer={buf} />,
  name: "component-editor",
};
export default ComponentEditor;
