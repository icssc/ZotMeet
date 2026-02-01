import { entityKind } from "../entity.js";

//#region src/pg-core/sequence.d.ts
type PgSequenceOptions = {
  increment?: number | string;
  minValue?: number | string;
  maxValue?: number | string;
  startWith?: number | string;
  cache?: number | string;
  cycle?: boolean;
};
declare class PgSequence {
  readonly seqName: string | undefined;
  readonly seqOptions: PgSequenceOptions | undefined;
  readonly schema: string | undefined;
  static readonly [entityKind]: string;
  constructor(seqName: string | undefined, seqOptions: PgSequenceOptions | undefined, schema: string | undefined);
}
declare function pgSequence(name: string, options?: PgSequenceOptions): PgSequence;
declare function isPgSequence(obj: unknown): obj is PgSequence;
//#endregion
export { PgSequence, PgSequenceOptions, isPgSequence, pgSequence };
//# sourceMappingURL=sequence.d.ts.map