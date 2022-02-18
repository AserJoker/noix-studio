import { TOKEN_CONSOLE_EMITTER, TOKEN_EXPLORER_EMITTER } from "@/const";
import { ITreeEventInfo, useEventEmitter } from "@/service";
import { IConsoleEventInfo, IExplorerEventInfo, IResource } from "@/types";
import { installConsoleWindow } from "@/windows/console";
import { installExplorerWindow } from "@/windows/explorer";
import { installWelcomeWindow } from "@/windows/welcome";
import { NButton, NForm, NFormItem, NInput, useDialog } from "naive-ui";
import { defineComponent, ref } from "vue";

const installWindow = () => {
  installWelcomeWindow();
  installConsoleWindow();
  installExplorerWindow();
};
const installConsole = () => {
  const $console = useEventEmitter<IConsoleEventInfo>(TOKEN_CONSOLE_EMITTER);
  $console.once("ready", () => {
    $console.emit("install", "clear", () => {
      $console.emit("clear");
    });
    $console.emit("install", "echo", (...msgs: string[]) => {
      $console.emit(
        "output",
        msgs
          .map((msg) => {
            return msg;
          })
          .join(" "),
        "info"
      );
    });
  });
};
const installExplorer = () => {
  const dialog = useDialog();
  const $explorer = useEventEmitter<
    IExplorerEventInfo & ITreeEventInfo<IResource>
  >(TOKEN_EXPLORER_EMITTER);
  $explorer.once("ready", () => {
    $explorer.emit(
      "addContentmenuItem",
      {
        label: "new group",
        key: "new group",
      },
      (node: IResource) => {
        return node.children;
      }
    );
  });
  const NewGroupForm = defineComponent({
    emits: {
      ok: (data: Record<string, unknown>) => {
        return typeof data === "object";
      },
    },
    setup(props, { emit }) {
      const formdata = ref<Record<string, unknown>>({});
      const formRef = ref<typeof NForm | null>(null);
      return () => {
        return (
          <NForm
            model={formdata.value}
            ref={formRef}
            rules={{
              name: {
                required: true,
                trigger: ["blur"],
              },
            }}
          >
            <NFormItem label="name:" path="name" required>
              <NInput
                value={formdata.value.name as string}
                onUpdate:value={(val) => {
                  formdata.value.name = val;
                }}
              />
            </NFormItem>
            <div>
              <NButton
                type="primary"
                onClick={() => {
                  emit("ok", formdata.value);
                }}
              >
                ok
              </NButton>
            </div>
          </NForm>
        );
      };
    },
  });
  $explorer.on("contextmenu", (key, node) => {
    if (key === "new group") {
      if (node.children) {
        const d = dialog.create({
          type: "default",
          content: () => (
            <NewGroupForm
              onOk={(data) => {
                $explorer.emit(
                  "insert",
                  {
                    label: data.name,
                    key: `${node.key}.children[${node.children?.length || 0}]`,
                    children: [],
                  },
                  node.key
                );
                d.destroy();
              }}
            />
          ),
        });
      }
    }
  });
};
const system = {
  install: () => {
    installWindow();
    installConsole();
    installExplorer();
  },
};
export default system;
