import tern from "tern";
declare global {
  interface Window {
    tern: typeof tern;
  }
}
export {};
