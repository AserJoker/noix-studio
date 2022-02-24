import { defineComponent } from "vue";
import Menu from "@/components/Menu";
import style from "./index.module.scss";
export default defineComponent({
  setup() {
    return () => (
      <div class={style.header}>
        <div class={style.icon}>Noix-Studio</div>
        <Menu />
      </div>
    );
  },
});
