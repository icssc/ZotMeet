import { entityKind } from "../entity.cjs";

//#region src/gel-core/sequence.d.ts
type GelSequenceOptions = {
  increment?: number | string;
  minValue?: number | string;
  maxValue?: number | string;
  startWith?: number | string;
  cache?: number | string;
  cycle?: boolean;
};
declare class GelSequence {
  readonly seqName: string | undefined;
  readonly seqOptions: GelSequenceOptions | undefined;
  readonly schema: string | undefined;
  static readonly [entityKind]: string;
  constructor(seqName: string | undefined, seqOptions: GelSequenceOptions | undefined, schema: string | undefined);
}
declare function gelSequence(name: string, options?: GelSequenceOptions): GelSequence;
declare function isGelSequence(obj: unknown): obj is GelSequence;
//#endregion
export { GelSequence, GelSequenceOptions, gelSequence, isGelSequence };
//# sourceMappingURL=sequence.d.cts.map