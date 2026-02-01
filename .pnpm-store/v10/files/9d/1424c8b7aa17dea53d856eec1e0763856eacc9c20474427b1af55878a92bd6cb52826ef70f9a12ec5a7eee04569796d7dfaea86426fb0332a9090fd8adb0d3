import { entityKind } from "../entity.cjs";

//#region src/pg-core/roles.d.ts
interface PgRoleConfig {
  createDb?: boolean;
  createRole?: boolean;
  inherit?: boolean;
}
declare class PgRole implements PgRoleConfig {
  readonly name: string;
  static readonly [entityKind]: string;
  constructor(name: string, config?: PgRoleConfig);
  existing(): this;
}
declare function pgRole(name: string, config?: PgRoleConfig): PgRole;
//#endregion
export { PgRole, PgRoleConfig, pgRole };
//# sourceMappingURL=roles.d.cts.map