import { CockroachRole } from "./roles.cjs";
import { CockroachTable } from "./table.cjs";
import { entityKind } from "../entity.cjs";
import { SQL } from "../sql/sql.cjs";

//#region src/cockroach-core/policies.d.ts
type CockroachPolicyToOption = 'public' | 'current_user' | 'session_user' | (string & {}) | CockroachPolicyToOption[] | CockroachRole;
interface CockroachPolicyConfig {
  as?: 'permissive' | 'restrictive';
  for?: 'all' | 'select' | 'insert' | 'update' | 'delete';
  to?: CockroachPolicyToOption;
  using?: SQL;
  withCheck?: SQL;
}
declare class CockroachPolicy implements CockroachPolicyConfig {
  readonly name: string;
  static readonly [entityKind]: string;
  readonly as: CockroachPolicyConfig['as'];
  readonly for: CockroachPolicyConfig['for'];
  readonly to: CockroachPolicyConfig['to'];
  readonly using: CockroachPolicyConfig['using'];
  readonly withCheck: CockroachPolicyConfig['withCheck'];
  constructor(name: string, config?: CockroachPolicyConfig);
  link(table: CockroachTable): this;
}
declare function cockroachPolicy(name: string, config?: CockroachPolicyConfig): CockroachPolicy;
//#endregion
export { CockroachPolicy, CockroachPolicyConfig, CockroachPolicyToOption, cockroachPolicy };
//# sourceMappingURL=policies.d.cts.map