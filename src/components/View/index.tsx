import { useWindow } from "@/service";
import { IView } from "@/types";
import { defineComponent, PropType, ref, watch } from "vue";
import style from "./index.module.scss";
import Dropdown from "@/widgets/dropdown";

const View = defineComponent({
  props: {
    text: String,
    node: {
      type: Object as PropType<IView>,
    },
  },
  setup(props) {
    const { renderWindow, getWindow } = useWindow();
    const currentWindow = ref("");
    const visible = ref(false);
    const windows = ref<{ title: string; classname: string }[]>([]);
    watch(
      () => props.node,
      () => {
        if (props.node?.type === "window") {
          currentWindow.value = props.node.classname[0];
          windows.value = props.node.classname.map((classname) => {
            const win = getWindow(classname);
            if (win) {
              const { title } = win;
              return {
                classname,
                title,
              };
            } else {
              throw new Error(`unknown window ${classname}`);
            }
          });
        }
      },
      { immediate: true }
    );
    const onChangeWindow = (classname: string) => {
      if (windows.value.find((win) => win.classname === classname)) {
        currentWindow.value = classname;
      }
    };
    return () => {
      if (!props.node) {
        return null;
      }
      if (props.node.type === "window") {
        const win = getWindow(currentWindow.value);
        return (
          <div class={`${style.view}`} ref={currentWindow.value}>
            <div class={style.switch}>
              <div class={style.title}>
                <div class={style["title-text"]} key={currentWindow.value}>
                  {win?.title}
                </div>
              </div>
              {win?.action &&
                win.action.map((a) => {
                  return (
                    <div
                      onClick={() => {
                        win?.onAction?.(a.key);
                      }}
                      class={style["action"]}
                    >
                      {a.render()}
                    </div>
                  );
                })}
              {windows.value.length > 1 && (
                <div
                  onClick={() => {
                    visible.value = true;
                  }}
                  style={{
                    position: "relative",
                  }}
                >
                  <div class={style["view-action"]}>...</div>
                  <Dropdown
                    dataSource={windows.value.map((v) => {
                      return {
                        label: v.title,
                        key: v.classname,
                      };
                    })}
                    visible={visible.value}
                    onClose={() => (visible.value = false)}
                    onSelect={(node) => onChangeWindow(node.key)}
                  />
                </div>
              )}
            </div>
            <div class={style.window} key={currentWindow.value}>
              {renderWindow(currentWindow.value, props.node.key)}
            </div>
          </div>
        );
      } else if (props.node.type === "group") {
        const children0Style = {} as Record<string, unknown>;
        if (props.node.direction === "row") {
          if (props.node.split) {
            children0Style.width = props.node.split;
          } else {
            children0Style.width = "50%";
          }
        } else if (props.node.direction === "column") {
          children0Style.height = props.node.split;
          if (props.node.split) {
            children0Style.height = props.node.split;
          } else {
            children0Style.height = "50%";
          }
        }
        return (
          <div
            class={`${style.view} ${
              style[
                `${props.node.direction}-${
                  props.node.reverse ? "reverse" : "normal"
                }-group`
              ]
            }`}
          >
            <div class={style["group-item"]} style={{ ...children0Style }}>
              <View node={props.node.children[0]} />
            </div>
            <div class={style["group-item"]}>
              <View node={props.node.children[1]} />
            </div>
          </div>
        );
      }
    };
  },
});
export default View;
