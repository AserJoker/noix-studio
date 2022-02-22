import { defineComponent, ref } from "vue";
import style from "./index.module.scss";
import { ITreeEventInfo, useEventEmitter, useMenu, useTree } from "@/service";
import { IEventEmitter, IMenuEventInfo, IMenuOption } from "@/types";
import { menus, TOKEN_MENU_EMITTER } from "@/const";
import Dropdown from "@/widgets/dropdown";
const Menu = defineComponent({
  setup() {
    const $menu = useEventEmitter<ITreeEventInfo<IMenuOption> & IMenuEventInfo>(
      TOKEN_MENU_EMITTER
    );
    $menu.memory("ready");
    const { tree, getTreeNode } = useTree(
      $menu as IEventEmitter<ITreeEventInfo<IMenuOption>>,
      { key: "root", children: menus, label: "root" }
    );
    useMenu($menu as IEventEmitter<IMenuEventInfo>, getTreeNode);
    const visible = ref(false);
    const active = ref("");

    return () => {
      const options: IMenuOption[] = tree.children || [];
      return (
        <div class={style.menu}>
          {options.map((node) => (
            <div class={style.item}>
              <div
                key={node.key}
                class={style["menu-node"]}
                onClick={() => {
                  visible.value = true;
                  active.value = node.key;
                }}
              >
                <div class={style["menu-node-name"]}>{node.label}</div>
                <div class="children">children</div>
              </div>
              <Dropdown
                dataSource={node.children}
                visible={visible.value && active.value === node.key}
                onClose={() => {
                  visible.value = false;
                }}
                onSelect={(node) => {
                  $menu.emit("select", node.key);
                }}
              />
            </div>
          ))}
        </div>
      );
    };
  },
});
export default Menu;
