import { entityKind } from "../entity.js";

//#region src/cockroach-core/roles.d.ts
interface CockroachRoleConfig {
  createDb?: boolean;
  createRole?: boolean;
}
declare class CockroachRole implements CockroachRoleConfig {
  readonly name: string;
  static readonly [entityKind]: string;
  constructor(name: string, config?: CockroachRoleConfig);
  existing(): this;
}
declare function cockroachRole(name: string, config?: CockroachRoleConfig): CockroachRole;
//#endregion
export { CockroachRole, CockroachRoleConfig, cockroachRole };
//# sourceMappingURL=roles.d.ts.map