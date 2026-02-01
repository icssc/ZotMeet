import { entityKind } from "./entity.js";

//#region src/errors.d.ts
declare class DrizzleError extends Error {
  static readonly [entityKind]: string;
  constructor({
    message,
    cause
  }: {
    message?: string;
    cause?: unknown;
  });
}
declare class DrizzleQueryError extends Error {
  query: string;
  params: any[];
  cause?: Error | undefined;
  static readonly [entityKind]: string;
  constructor(query: string, params: any[], cause?: Error | undefined);
}
declare class TransactionRollbackError extends DrizzleError {
  static readonly [entityKind]: string;
  constructor();
}
//#endregion
export { DrizzleError, DrizzleQueryError, TransactionRollbackError };
//# sourceMappingURL=errors.d.ts.map