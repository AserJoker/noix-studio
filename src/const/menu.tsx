import { IMenuNode } from "@/types";

const menus: IMenuNode[] = [
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
      },
      {
        label: "构建项目",
        key: "build-project",
      },
      {
        label: "预览项目",
        key: "preview-project",
        children: [
          {
            label: "测试",
            key: "test",
          },
        ],
      },
    ],
  },
];
const TOKEN_MENU_EMITTER = Symbol("menu");
export { menus, TOKEN_MENU_EMITTER };
