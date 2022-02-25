import { TOKEN_VIEW_EMITTER } from "@/const";
import { ITreeEventInfo, useEventEmitter, useWindow } from "@/service";
import { IView, IViewEventInfo } from "@/types";
import Button from "@/widgets/button";
import { defineComponent } from "vue";
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
    return () => {
      return (
        <div>
          <div></div>
          <div>
            <div></div>
            <div>
              <Button onClick={onSubmit}>创建</Button>
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
