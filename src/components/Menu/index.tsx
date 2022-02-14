import { defineComponent } from "vue";
import { NDropdown } from "naive-ui";
import style from "./index.module.scss";
import { useMenu } from "@/service/menu";
import { useEventEmitter } from "@/service";
import { IMenuEventInfo } from "@/types";
import { menus, TOKEN_MENU_EMITTER } from "@/const";
export default defineComponent({
  setup() {
    const $menu = useEventEmitter<IMenuEventInfo>(TOKEN_MENU_EMITTER);
    const { menus: options } = useMenu($menu, menus);
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
              $menu.emit("select", key);
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
