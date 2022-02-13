import { defineComponent } from "vue";
import { NDropdown } from "naive-ui";
import style from "./index.module.scss";
import { useMenu } from "@/service/menu";
import { useEventEmitter } from "@/service";
import { IMenuEventInfo, IMenuNode } from "@/types";
import { menus, TOKEN_MENU_EMITTER } from "@/const";
export default defineComponent({
  setup() {
    const emitter = useEventEmitter<IMenuEventInfo>(TOKEN_MENU_EMITTER);
    const { menus: options } = useMenu(emitter);
    const resolveMenuNode = (
      node: IMenuNode,
      parentKey?: string,
      lastKey?: string
    ) => {
      emitter.emit("insert", node, parentKey, lastKey);
      node.children &&
        node.children.forEach((item, index) => {
          resolveMenuNode(item, node.key, node.children?.[index - 1]?.key);
        });
    };
    menus.forEach((item) => {
      resolveMenuNode(item);
    });
    return () => (
      <div class={style.menu}>
        {options.map((node) => (
          <NDropdown
            options={node.children || []}
            placement="bottom-start"
            trigger="click"
            style={{
              minWidth: "180px",
              marginTop: 0,
            }}
            animated={false}
            onSelect={(key) => {
              emitter.emit("select", key);
            }}
          >
            <div key={node.key} class={style["menu-node"]}>
              <div class={style["menu-node-name"]}>
                {node.icon && node.icon()}
                {node.label}
              </div>
              <div class="children">children</div>
            </div>
          </NDropdown>
        ))}
      </div>
    );
  },
});
