import { IWindow } from "@/types/IWindow";

const windows: Record<string, IWindow<unknown[]>> = {};
export const useWindow = () => {
  const renderWindow = (classname: string, ...args: unknown[]) => {
    return windows[classname]?.content?.(...args);
  };
  const createWindow = <T extends unknown[] = unknown[]>(win: IWindow<T>) => {
    windows[win.classname] = win as IWindow;
  };
  const getWindow = (classname: string) => {
    return windows[classname];
  };
  return { windows, renderWindow, createWindow, getWindow };
};
