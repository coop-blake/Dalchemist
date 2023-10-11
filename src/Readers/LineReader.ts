export interface LineReader<T> {
  data: Array<string>;
  entries: Array<T>;
  unexpected: Array<T>;
  processLine(line: string): boolean;
}
