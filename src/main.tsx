import { createApp, defineComponent, onMounted, ref } from "vue";
import Application from "./components/Application";
import "./global.scss";
import "./widgets/reset.scss";
const modulePaths = import.meta.glob("./modules/*/index.*");
createApp(
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
).mount("#app");
document.body.oncontextmenu = (e) => {
  e.preventDefault();
};
