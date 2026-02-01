import { GelRole } from "./roles.cjs";
import { GelTable } from "./table.cjs";
import { entityKind } from "../entity.cjs";
import { SQL } from "../sql/sql.cjs";

//#region src/gel-core/policies.d.ts
type GelPolicyToOption = 'public' | 'current_role' | 'current_user' | 'session_user' | (string & {}) | GelPolicyToOption[] | GelRole;
interface GelPolicyConfig {
  as?: 'permissive' | 'restrictive';
  for?: 'all' | 'select' | 'insert' | 'update' | 'delete';
  to?: GelPolicyToOption;
  using?: SQL;
  withCheck?: SQL;
}
declare class GelPolicy implements GelPolicyConfig {
  readonly name: string;
  static readonly [entityKind]: string;
  readonly as: GelPolicyConfig['as'];
  readonly for: GelPolicyConfig['for'];
  readonly to: GelPolicyConfig['to'];
  readonly using: GelPolicyConfig['using'];
  readonly withCheck: GelPolicyConfig['withCheck'];
  constructor(name: string, config?: GelPolicyConfig);
  link(table: GelTable): this;
}
declare function gelPolicy(name: string, config?: GelPolicyConfig): GelPolicy;
//#endregion
export { GelPolicy, GelPolicyConfig, GelPolicyToOption, gelPolicy };
//# sourceMappingURL=policies.d.cts.map