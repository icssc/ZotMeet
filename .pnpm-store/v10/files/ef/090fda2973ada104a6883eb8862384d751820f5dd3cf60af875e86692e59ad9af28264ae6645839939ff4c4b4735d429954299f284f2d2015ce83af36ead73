import { entityKind } from "./entity.cjs";

//#region src/logger.d.ts
interface Logger {
  logQuery(query: string, params: unknown[]): void;
}
interface LogWriter {
  write(message: string): void;
}
declare class ConsoleLogWriter implements LogWriter {
  static readonly [entityKind]: string;
  write(message: string): void;
}
declare class DefaultLogger implements Logger {
  static readonly [entityKind]: string;
  readonly writer: LogWriter;
  constructor(config?: {
    writer: LogWriter;
  });
  logQuery(query: string, params: unknown[]): void;
}
declare class NoopLogger implements Logger {
  static readonly [entityKind]: string;
  logQuery(): void;
}
//#endregion
export { ConsoleLogWriter, DefaultLogger, LogWriter, Logger, NoopLogger };
//# sourceMappingURL=logger.d.cts.map