import { defineComponent } from "vue";
import { DropdownOption, NDropdown } from "naive-ui";
import style from "./index.module.scss";
import { ITreeEventInfo, useEventEmitter, useMenu, useTree } from "@/service";
import { IEventEmitter, IMenuEventInfo, IMenuOption } from "@/types";
import { menus, TOKEN_MENU_EMITTER } from "@/const";
const Menu = defineComponent({
  setup() {
    const $menu = useEventEmitter<ITreeEventInfo<IMenuOption> & IMenuEventInfo>(
      TOKEN_MENU_EMITTER
    );
    $menu.memory("ready");
    const { tree, getTreeNode } = useTree(
      $menu as IEventEmitter<ITreeEventInfo<IMenuOption>>,
      { key: "root", children: menus }
    );
    useMenu($menu as IEventEmitter<IMenuEventInfo>, getTreeNode);

    return () => {
      const options: DropdownOption[] = tree.children || [];
      return (
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
    };
  },
});
export default Menu;
