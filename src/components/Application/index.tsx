import { defineComponent } from "vue";
import style from "./index.module.scss";
import Header from "@/components/Header";
import Content from "@/components/Content";
import Footer from "../Footer";
import { installWelcomeWindow } from "@/windows/welcome";
import { installConsoleWindow } from "@/windows/console";
export default defineComponent({
  setup() {
    installWelcomeWindow();
    installConsoleWindow();
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
