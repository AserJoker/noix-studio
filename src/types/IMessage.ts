export interface IMessage<
  INFO extends Record<string, unknown> = Record<string, unknown>,
  M extends keyof INFO = keyof INFO
> {
  type: M;
  param?: INFO[M];
  callback?: <T>(data: T) => void;
}
