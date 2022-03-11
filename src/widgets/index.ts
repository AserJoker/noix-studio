import { App } from "vue";
import Button from "./button";
import Checkbox from "./checkbox";
import Dropdown from "./dropdown";
import Form, { FormItem } from "./form";
import Icon from "./icon";
import Input from "./input";
import Select from "./select";
import Tree from "./tree";

export default {
  install: (app: App) => {
    app.component("NButton", Button);
    app.component("NCheckbox", Checkbox);
    app.component("NDropdown", Dropdown);
    app.component("NForm", Form);
    app.component("NFormIteem", FormItem);
    app.component("NIcon", Icon);
    app.component("NInput", Input);
    app.component("NSelect", Select);
    app.component("NTree", Tree);
  },
};
