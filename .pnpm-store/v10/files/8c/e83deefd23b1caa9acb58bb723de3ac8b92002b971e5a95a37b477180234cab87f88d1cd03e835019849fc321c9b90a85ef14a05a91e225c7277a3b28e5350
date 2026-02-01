import { PgRole } from "./roles.js";
import { PgTable } from "./table.js";
import { entityKind } from "../entity.js";
import { SQL } from "../sql/sql.js";

//#region src/pg-core/policies.d.ts
type PgPolicyToOption = 'public' | 'current_role' | 'current_user' | 'session_user' | (string & {}) | PgPolicyToOption[] | PgRole;
interface PgPolicyConfig {
  as?: 'permissive' | 'restrictive';
  for?: 'all' | 'select' | 'insert' | 'update' | 'delete';
  to?: PgPolicyToOption;
  using?: SQL;
  withCheck?: SQL;
}
declare class PgPolicy implements PgPolicyConfig {
  readonly name: string;
  static readonly [entityKind]: string;
  readonly as: PgPolicyConfig['as'];
  readonly for: PgPolicyConfig['for'];
  readonly to: PgPolicyConfig['to'];
  readonly using: PgPolicyConfig['using'];
  readonly withCheck: PgPolicyConfig['withCheck'];
  constructor(name: string, config?: PgPolicyConfig);
  link(table: PgTable): this;
}
declare function pgPolicy(name: string, config?: PgPolicyConfig): PgPolicy;
//#endregion
export { PgPolicy, PgPolicyConfig, PgPolicyToOption, pgPolicy };
//# sourceMappingURL=policies.d.ts.map