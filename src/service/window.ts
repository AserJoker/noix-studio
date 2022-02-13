import { IWindow } from "@/types/IWindow";

const windows: Record<string, IWindow<unknown[]>> = {};
export const useWindow = () => {
  const renderWindow = (key: string, ...args: unknown[]) => {
    return windows[key]?.content?.(...args);
  };
  const createWindow = <T extends unknown[]>(win: IWindow<T>) => {
    windows[win.key] = win as IWindow;
  };
  const getWindow = (key: string) => {
    return windows[key];
  };
  return { windows, renderWindow, createWindow, getWindow };
};
