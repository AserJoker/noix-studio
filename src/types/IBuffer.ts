export interface IBuffer {
  buf: string;
  cursor: { line: number; pos: number };
  readonly?: boolean;
  name: string;
}
