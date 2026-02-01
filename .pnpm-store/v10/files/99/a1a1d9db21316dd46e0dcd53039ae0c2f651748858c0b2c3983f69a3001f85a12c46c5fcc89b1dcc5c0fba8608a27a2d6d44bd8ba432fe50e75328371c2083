import { entityKind } from "../entity.js";

//#region src/cockroach-core/sequence.d.ts
type CockroachSequenceOptions = {
  increment?: number | string;
  minValue?: number | string;
  maxValue?: number | string;
  startWith?: number | string;
  cache?: number | string;
};
declare class CockroachSequence {
  readonly seqName: string;
  readonly seqOptions: CockroachSequenceOptions | undefined;
  readonly schema: string | undefined;
  static readonly [entityKind]: string;
  constructor(seqName: string, seqOptions: CockroachSequenceOptions | undefined, schema: string | undefined);
}
declare function cockroachSequence(name: string, options?: CockroachSequenceOptions): CockroachSequence;
declare function isCockroachSequence(obj: unknown): obj is CockroachSequence;
//#endregion
export { CockroachSequence, CockroachSequenceOptions, cockroachSequence, isCockroachSequence };
//# sourceMappingURL=sequence.d.ts.map