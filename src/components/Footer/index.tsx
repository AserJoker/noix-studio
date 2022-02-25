import { TOKEN_FOOTER_EMITTER } from "@/const";
import { useEventEmitter } from "@/service";
import { useFooter } from "@/service/footer";
import { IFooterInfo } from "@/types";
import { defineComponent, onMounted, onUnmounted } from "vue";
import style from "./index.module.scss";
const Footer = defineComponent({
  setup() {
    const $footer = useEventEmitter<IFooterInfo>(TOKEN_FOOTER_EMITTER);
    $footer.memory("ready");
    const { items, init, release } = useFooter($footer, [
      {
        key: "version",
        content: () => <div style={{ padding: "0 8px" }}>v0.1.0</div>,
      },
    ]);
    onMounted(() => {
      init();
    });
    onUnmounted(() => {
      release();
    });
    return () => {
      return (
        <div class={style.footer}>{items.map((item) => item.content())}</div>
      );
    };
  },
});
export default Footer;
