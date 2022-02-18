import { createApp, defineComponent } from "vue";
import { NDialogProvider, NMessageProvider } from "naive-ui";
import Application from "./components/Application";
import "./global.scss";
createApp(
  defineComponent(() => {
    return () => {
      return (
        <NMessageProvider>
          <NDialogProvider>
            <Application />
          </NDialogProvider>
        </NMessageProvider>
      );
    };
  })
).mount("#app");
