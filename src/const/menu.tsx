import { IMenuOption } from "@/types";

const menus: IMenuOption[] = [
  {
    label: "项目",
    key: "project",
    children: [
      {
        label: "新建项目",
        key: "new-project",
      },
      {
        label: "打开项目",
        key: "open-project",
      },
      {
        key: "di",
        type: "divider",
      },
      {
        label: "构建项目",
        key: "build-project",
      },
      {
        label: "预览项目",
        key: "preview-project",
      },
    ],
  },
];
const TOKEN_MENU_EMITTER = "token.emitter.menu";
export { menus, TOKEN_MENU_EMITTER };
