import { TOKEN_VIEW_EMITTER } from "@/const";
import { ITreeEventInfo, useEventEmitter, useWindow } from "@/service";
import { IView, IViewEventInfo } from "@/types";
import Button from "@/widgets/button";
import Input from "@/widgets/input";
import Select from "@/widgets/select";
import Checkbox from "@/widgets/checkbox";
import Form, { FormItem } from "@/widgets/form";
import { defineComponent, ref } from "vue";
import { TOKEN_CODE_WINDOW } from "../code";
import { view } from "./const";
const NewTemplateProjectWindow = defineComponent({
  setup() {
    const $view = useEventEmitter<IViewEventInfo & ITreeEventInfo<IView>>(
      TOKEN_VIEW_EMITTER
    );
    const onSubmit = () => {
      $view.emit("update", JSON.parse(JSON.stringify(view)));
      $view.emit("focusWindow", "workbranch", TOKEN_CODE_WINDOW);
    };
    const name = ref("demo-page");
    const size = ref<"small" | "medium" | "large">("medium");
    return () => {
      return (
        <div>
          <div></div>
          <div>
            <Form labelWidth={120} labelAlign="left" inline size={size.value}>
              <FormItem label="name:" required>
                <Input
                  onUpdate:value={(val) => {
                    name.value = val || "";
                  }}
                  value={name.value}
                />
              </FormItem>
              <FormItem label="template type:">
                <Select
                  options={[
                    {
                      label: "type1",
                      value: "type1",
                    },
                    {
                      label: "type2",
                      value: "type2",
                    },
                  ]}
                />
              </FormItem>
              <FormItem label="radio:">
                <Checkbox
                  options={[
                    {
                      label: "aaaa",
                      key: "aaa",
                    },
                    {
                      label: "bbb",
                      key: "bbb",
                    },
                  ]}
                />
              </FormItem>
            </Form>
            <div>
              <Button onClick={onSubmit}>创建</Button>
              <Button
                size={size.value}
                type="success"
                onClick={() => {
                  size.value = "small";
                }}
              >
                small
              </Button>
              <Button
                size={size.value}
                onClick={() => {
                  size.value = "medium";
                }}
              >
                medium
              </Button>
              <Button
                size={size.value}
                onClick={() => {
                  size.value = "large";
                }}
              >
                large
              </Button>
            </div>
          </div>
        </div>
      );
    };
  },
});
export const installNewTemplateProejctWindow = () => {
  const { createWindow } = useWindow();
  createWindow({
    title: "create project from template",
    content: () => <NewTemplateProjectWindow />,
    classname: TOKEN_NEW_TEMPLATE_PROJECT_WINDOW,
  });
};
export const TOKEN_NEW_TEMPLATE_PROJECT_WINDOW =
  "token.window.new-template-project";
