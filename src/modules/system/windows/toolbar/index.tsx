import { useWindow } from "@/service";
import { defineComponent } from "vue";
const ToolbarWindow = defineComponent({
  setup() {
    const list = [
      {
        key: "div",
        props: {
          textContent: "a empty text",
        },
        render: () => {
          return (
            <div
              key={"div"}
              style={{
                width: "80px",
                height: "80px",
                border: "1px solid #000",
              }}
            >
              text
            </div>
          );
        },
      },
      {
        key: "div",
        props: {},
        render: () => {
          return (
            <div
              key={"div"}
              style={{
                width: "80px",
                height: "80px",
                border: "1px solid #000",
              }}
            ></div>
          );
        },
      },
      {
        key: "button",
        props: {
          style: { width: "100%" },
        },
        render: () => {
          return (
            <button
              key={"button"}
              style={{
                width: "80px",
                height: "80px",
                border: "1px solid #000",
              }}
            >
              button
            </button>
          );
        },
      },
    ];
    return () => {
      return (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {list.map((item) => {
            return (
              <div
                draggable
                onDragstart={(e) => {
                  e.dataTransfer?.setData("comp", item.key);
                  e.dataTransfer?.setData("props", JSON.stringify(item.props));
                }}
              >
                {item.render()}
              </div>
            );
          })}
        </div>
      );
    };
  },
});
export const installToolbarWindow = () => {
  const { createWindow } = useWindow();
  createWindow({
    title: "toolbar",
    content: () => <ToolbarWindow />,
    classname: TOKEN_TOOLBAR_WINDOW,
  });
};
export const TOKEN_TOOLBAR_WINDOW = "token.window.toolbar";
