import { defineComponent, PropType } from "vue";
import style from "./index.module.scss";
import Header from "@/components/Header";
import Content from "@/components/Content";
import Footer from "../Footer";
import { installWelcomeWindow } from "@/windows/welcome";
export default defineComponent({
  props: {
    modules: {
      type: Array as PropType<{ install: () => void }[]>,
      default: () => {
        return [];
      },
    },
  },
  setup(props) {
    installWelcomeWindow();
    props.modules.forEach((m) => {
      m.install();
    });
    return () => (
      <div class={style.application}>
        <div class={style.header}>
          <Header />
        </div>
        <div class={style.main}>
          <Content />
        </div>
        <div class={style.footer}>
          <Footer />
        </div>
      </div>
    );
  },
});
