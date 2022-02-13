import { defineComponent } from "vue";
import { NIcon } from "naive-ui";
import { BuildOutline } from "@vicons/ionicons5";
import Menu from "@/components/Menu";
import style from "./index.module.scss";
export default defineComponent({
  setup() {
    return () => (
      <div class={style.header}>
        <NIcon color="#0000ff" size={32}>
          <BuildOutline />
        </NIcon>
        <Menu />
      </div>
    );
  },
});
