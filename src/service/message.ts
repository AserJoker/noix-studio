import { IMessage } from "@/types";

export const useMessage = <T extends Record<string, unknown>>() => {
  let messageHandle = 0;
  const listeners: Record<string, (param?: unknown) => unknown> = {};
  const send = (msg: IMessage<T>) => {
    const handle = ++messageHandle;
    const readcallback = (event: MessageEvent) => {
      const data = event.data as IMessage & { handle: number };
      if (data.type === "callback" && data.handle === handle && msg.callback) {
        msg.callback(data.param);
      }
      if (data.type === "callback") {
        window.removeEventListener("message", readcallback);
      }
    };
    window.addEventListener("message", readcallback);
    window.postMessage(
      { type: msg.type, param: msg.param, handle },
      window.location.href
    );
  };
  const onMessage = (event: MessageEvent) => {
    const data = event.data as IMessage<T> & { handle: number };
    if (data.type !== "callback") {
      const res = listeners[data.type as string]?.(data.param);
      window.postMessage({
        type: "callback",
        handle: data.handle,
        param: res,
      });
    }
  };
  const addListener = <M extends keyof T>(
    type: M,
    callback: (data: T[M]) => unknown
  ) => {
    listeners[type as string] = callback as (param?: unknown) => unknown;
  };
  const removeListener = <M extends keyof T>(type: M) => {
    delete listeners[type as string];
  };
  const init = () => {
    window.addEventListener("message", onMessage);
  };
  const uninit = () => {
    window.removeEventListener("message", onMessage);
  };
  return { send, init, uninit, addListener, removeListener };
};
