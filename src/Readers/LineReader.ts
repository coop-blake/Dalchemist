export abstract class StringsAssimilator<T> {
  raw: Array<string>;
  constructor(raw: Array<string>) {
    this.raw = raw;
  }
  abstract digest(): T | null;
}

export abstract class LineReader<T> {
  assimilator: new (raw: Array<string>) => StringsAssimilator<T>;
  constructor(assimilator: new (raw: Array<string>) => StringsAssimilator<T>) {
    this.assimilator = assimilator;
  }
  read(raw: Array<string>): T | null {
    return new this.assimilator(raw).digest();
  }
}

export abstract class InputStream {
  constructor() {}
  abstract getLines(): Array<Array<string>>;
}

export interface ImporterInterface<T> {
  lineReader: LineReader<T>;
  inputStream: InputStream;
  start(): Promise<Array<T> | null>;
}

export class Importer<T> implements ImporterInterface<T> {
  lineReader: LineReader<T>;
  inputStream: InputStream;

  entries = Array<T>();

  unrecognizedInputs = Array<Array<string>>();

  constructor(lineReader: LineReader<T>, inputStream: InputStream) {
    this.inputStream = inputStream;
    this.lineReader = lineReader;
  }

  async start(): Promise<Array<T>> {
    const filtered: Array<T> = this.inputStream
      .getLines()
      .map((inStreamLine) => {
        const entry = this.lineReader.read(inStreamLine) as T;
        entry ?? !this.unrecognizedInputs.push(inStreamLine);
        return entry;
      })
      .filter((line) => {
        return line as T;
      }) as Array<T>;
    this.entries = filtered;
    return filtered;
  }

  getNumberOfEntries() {
    return this.entries.length;
  }
  getNumberOfUnrecognizedEntries() {
    return this.unrecognizedInputs.length;
  }
}
