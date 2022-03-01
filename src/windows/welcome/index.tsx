import { useWindow } from "@/service";
import Button from "@/widgets/button";
import { useForm } from "@/widgets/form";
import Input from "@/widgets/input";
import { defineComponent, ref } from "vue";
// import style from "./index.module.scss";
export const TOKEN_WELCOME_WINDOW = "token.window.welcome";
const CustomForm = useForm({
  items: [
    {
      label: "name",
      Component: Input,
      name: "name",
      required: true,
    },
    {
      label: "sex",
      name: "sex",
      Component: Input,
    },
  ],
  formProps: {
    labelWidth: 120,
  },
});
const WelcomeWindow = defineComponent({
  props: {
    layoutKey: {
      type: String,
      required: true,
    },
  },
  setup() {
    const form = ref<InstanceType<typeof CustomForm>>();
    const onClick = () => {
      if (form.value) {
        form.value.validate();
      }
    };
    return () => {
      return (
        <div>
          <CustomForm ref={form} />
          <Button onClick={onClick}>validate</Button>
        </div>
      );
    };
  },
});
export const installWelcomeWindow = () => {
  const { createWindow } = useWindow();
  createWindow({
    classname: TOKEN_WELCOME_WINDOW,
    content: (layoutkey: string) => {
      return <WelcomeWindow layoutKey={layoutkey} />;
    },
    title: "welcome",
  });
};
