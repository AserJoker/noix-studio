import { IMenuOption } from "@/types";

const menus: IMenuOption[] = [
  {
    label: "项目",
    key: "project",
    children: [
      {
        label: "新建项目...",
        key: "new-project",
        children: [
          {
            label: "来自文件",
            key: "from-file",
          },
          {
            label: "来自模板",
            key: "from-template",
          },
        ],
      },
      {
        label: "打开项目",
        key: "open-project",
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
  {
    label: "帮助",
    key: "help",
    children: [
      {
        label: "打开",
        key: "open",
        children: [
          {
            label: "打开文档",
            key: "open-document",
          },
          {
            label: "打开文档（web）",
            key: "open-document_web",
          },
        ],
      },
    ],
  },
];
const TOKEN_MENU_EMITTER = "token.emitter.menu";
export { menus, TOKEN_MENU_EMITTER };
