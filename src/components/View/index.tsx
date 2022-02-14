import { useWindow } from "@/service";
import { IView } from "@/types";
import { defineComponent, PropType, ref } from "vue";
import { DropdownOption, NButton, NDropdown } from "naive-ui";
import style from "./index.module.scss";

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
    const windows = ref<{ title: string; classname: string }[]>([]);
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
    const onCloseWindow = (classname: string) => {
      const index = windows.value.findIndex(
        (win) => win.classname === classname
      );
      if (index !== -1) {
        windows.value.splice(index, 1);
      }
      if (classname === currentWindow.value) {
        currentWindow.value = windows.value[0].classname;
      }
    };
    const onChangeWindow = (classname: string) => {
      if (windows.value.find((win) => win.classname === classname)) {
        currentWindow.value = classname;
      }
    };
    const renderDropdownWindow = (opt: DropdownOption) => {
      const key = opt.key as string;
      return (
        <div class={style["dropdown-item"]}>
          <div class={style["dropdown-item-title"]}>{opt.label}</div>
          <div class={style["dropdown-item-close"]}>
            <NButton
              type="error"
              size="tiny"
              onClick={() => {
                onCloseWindow(key);
              }}
              disabled={windows.value.length <= 1}
            >
              x
            </NButton>
          </div>
        </div>
      );
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
                <NDropdown
                  options={windows.value.map((win) => {
                    return {
                      label: win.title,
                      key: win.classname,
                    };
                  })}
                  trigger="click"
                  onSelect={onChangeWindow}
                  renderLabel={renderDropdownWindow}
                >
                  <div class={style["view-action"]}>...</div>
                </NDropdown>
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
