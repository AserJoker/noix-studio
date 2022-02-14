import { IConsoleEventEmitter } from "@/types";
import moment from "moment";
import { reactive } from "vue";

export const useOutput = (emitter: IConsoleEventEmitter) => {
  const messages = reactive<
    {
      type: string;
      message: string;
      time: string;
    }[]
  >([]);
  emitter.on("output", (type, message) => {
    messages.push({
      type,
      message,
      time: moment().format("YYYY-MM-DD hh:mm:ss"),
    });
    if (messages.length > 200) {
      messages.shift();
    }
  });
  return { messages };
};
