import { useWindow } from "@/service";
import { defineComponent } from "vue";

const WorkbranchWindow = defineComponent({
  setup() {
    return () => {
      return <div>workbranch</div>;
    };
  },
});
export const installWorkbranchWindow = () => {
  const { createWindow } = useWindow();
  createWindow({
    title: "workbranch",
    content: () => <WorkbranchWindow />,
    classname: TOKEN_WORKBRANCH_WINDOW,
  });
};
export const TOKEN_WORKBRANCH_WINDOW = "token.window.workbranch";
