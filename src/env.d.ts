declare global {
  interface ImportMeta {
    glob: (path: string) => Record<string, () => Promise<unknown>>;
  }
}
export {};
