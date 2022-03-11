import { createApp, defineComponent, onMounted, ref } from "vue";
import Application from "./components/Application";
import NoixWidget from "./widgets";
import "./global.scss";
import "./widgets/reset.scss";
import "//at.alicdn.com/t/font_3209065_7pwi96badis.js";
const modulePaths = import.meta.glob("./modules/*/index.*");
const app = createApp(
  defineComponent(() => {
    const modules = ref<{ install: () => void }[]>([]);
    onMounted(() => {
      for (const path in modulePaths) {
        modulePaths[path]().then((data) => {
          modules.value.push(
            (data as { default: { install: () => void } }).default
          );
        });
      }
    });
    return () => {
      return Object.keys(modulePaths).length !== modules.value.length ? (
        "loading..."
      ) : (
        <Application modules={modules.value} />
      );
    };
  })
);
app.use(NoixWidget);
app.mount("#app");

document.body.oncontextmenu = (e) => {
  e.preventDefault();
};
