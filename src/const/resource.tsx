import { IResource } from "@/types";

export const TOKEN_EXPLORER_EMITTER = "token.emitter.explorer";
export const resourcesTree: IResource[] = [
  {
    label: "component",
    key: "component",
    children: [
      {
        label: "Table",
        key: "table",
      },
      {
        label: "Tree",
        key: "tree",
      },
    ],
  },
  {
    label: "page",
    key: "page",
  },
];
