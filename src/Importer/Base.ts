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

export abstract class InputLines {
  constructor() {}
  abstract getLines(): Promise<Array<Array<string>>>;
}

export interface ImporterInterface<T> {
  lineReader: LineReader<T>;
  inputStream: InputLines;
  start(): Promise<Array<T> | null>;
}

export class Importer<T> implements ImporterInterface<T> {
  lineReader: LineReader<T>;
  inputStream: InputLines;

  entries = Array<T>();

  unrecognizedInputs = Array<Array<string>>();

  constructor(lineReader: LineReader<T>, inputStream: InputLines) {
    this.inputStream = inputStream;
    this.lineReader = lineReader;
  }

  async start(): Promise<Array<T>> {
    const lines = await this.inputStream.getLines();
    const filtered: Array<T> = lines
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

export abstract class LineImporter<T> {
  abstract input: InputLines;
  abstract lineReader: LineReader<T>;

  async read(): Promise<T[]> {
    const importer = new Importer(this.lineReader, this.input);
    const entries = await importer.start();
    return entries.filter((entry): entry is T => entry !== null) as T[];
  }
}
