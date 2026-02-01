import { entityKind } from "../entity.js";

//#region src/gel-core/roles.d.ts
interface GelRoleConfig {
  createDb?: boolean;
  createRole?: boolean;
  inherit?: boolean;
}
declare class GelRole implements GelRoleConfig {
  readonly name: string;
  static readonly [entityKind]: string;
  constructor(name: string, config?: GelRoleConfig);
  existing(): this;
}
declare function gelRole(name: string, config?: GelRoleConfig): GelRole;
//#endregion
export { GelRole, GelRoleConfig, gelRole };
//# sourceMappingURL=roles.d.ts.map