import { TOKEN_CONSOLE_EMITTER } from "@/const";
import { useEventEmitter, useWindow } from "@/service";
import { useConsole } from "@/service/console";
import { IConsoleEventInfo } from "@/types";
import { defineComponent, nextTick, ref, watch } from "vue";
import style from "./index.module.scss";

const ConsoleWindow = defineComponent({
  setup() {
    const el = ref<HTMLDivElement | null>();
    const eli = ref<HTMLInputElement | null>();
    const $console = useEventEmitter<IConsoleEventInfo>(TOKEN_CONSOLE_EMITTER);
    $console.memory("ready");
    const { messages } = useConsole($console);
    watch(messages, () => {
      nextTick(() => {
        if (el.value) {
          el.value.scrollTop = el.value.scrollHeight;
        }
      });
    });
    const onClick = (event: MouseEvent) => {
      if (eli.value && event.target === el.value) {
        eli.value.focus();
      }
    };
    return () => {
      return (
        <div ref={el} class={style.output} onClick={onClick}>
          <div>
            {messages.map((msg) => {
              const lines = msg.message.split("\n");
              return (
                <div class={style[`${msg.type}-context`]}>
                  <div style={{ display: "flex" }}>
                    {"> "} <div>[ {msg.type} ]</div>
                    <div>[ {msg.time} ]</div> {`: ${lines[0]}`}
                  </div>
                  {lines.map((line, index) => {
                    return index === 0 ? null : (
                      <div>
                        &nbsp; &nbsp; &nbsp; &nbsp;
                        {`${line}`}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            <div class={style.inputline}>
              {">"}
              <input
                ref={eli}
                autofocus
                class={style.input}
                onKeydown={(event) => {
                  if (event.key === "Enter") {
                    const target = event.target as HTMLInputElement;
                    $console.emit("output", target.value, "input");
                    const inputValue = target.value;
                    target.value = "";
                    $console.emit("input", inputValue);
                  }
                }}
              />
            </div>
          </div>
        </div>
      );
    };
  },
});

export const installConsoleWindow = () => {
  const { createWindow } = useWindow();
  createWindow({
    title: "console",
    content: () => <ConsoleWindow />,
    classname: TOKEN_CONSOLE_WINDOW,
  });
};
export const TOKEN_CONSOLE_WINDOW = "token.window.console";
