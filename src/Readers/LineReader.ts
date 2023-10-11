export interface LineReaderInterface<T> {
  data: Array<Array<string>>;
  entries: Array<T>;
  unexpected: Array<T>;
  processLine(line: string): boolean;
}

export interface AssimilatorInterface<T> {
  raw: Array<string>;
  digest(): T | null;
}

export abstract class StringsAssimilator<T> implements AssimilatorInterface<T> {
  raw: Array<string>;

  constructor(raw: Array<string>) {
    this.raw = raw;
  }

  abstract digest(): T | null;
}

export abstract class LineReader<T> {
  assimilator: new (raw: Array<string>) => AssimilatorInterface<T>;

  constructor(
    assimilator: new (raw: Array<string>) => AssimilatorInterface<T>
  ) {
    this.assimilator = assimilator;
  }

  read(raw: Array<string>): T | null {
    return new this.assimilator(raw).digest();
  }
}
