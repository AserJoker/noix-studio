import { createApp, defineComponent } from "vue";
import Application from "./components/Application";
import "./global.scss";
createApp(
  defineComponent(() => {
    return () => {
      return <Application />;
    };
  })
).mount("#app");
document.body.oncontextmenu = (e) => {
  e.preventDefault();
};
