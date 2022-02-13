import { defineComponent } from "vue";
import style from "./index.module.scss";
import Header from "@/components/Header";
import Content from "@/components/Content";
export default defineComponent({
  setup() {
    return () => (
      <div class={style.application}>
        <div class={style.header}>
          <Header />
        </div>
        <div class={style.main}>
          <Content />
        </div>
      </div>
    );
  },
});
