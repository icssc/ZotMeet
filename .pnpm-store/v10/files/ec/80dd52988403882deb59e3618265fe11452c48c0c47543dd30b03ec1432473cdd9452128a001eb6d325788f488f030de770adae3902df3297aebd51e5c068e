import { PrismaMySqlPreparedQueryHKT, PrismaMySqlQueryResultHKT } from "./session.cjs";
import { entityKind } from "../../entity.cjs";
import { DrizzleConfig } from "../../utils.cjs";
import { Logger } from "../../logger.cjs";
import { MySqlDatabase } from "../../mysql-core/index.cjs";
import { PrismaClient } from "@prisma/client/extension";

//#region src/prisma/mysql/driver.d.ts
declare class PrismaMySqlDatabase extends MySqlDatabase<PrismaMySqlQueryResultHKT, PrismaMySqlPreparedQueryHKT, Record<string, never>> {
  static readonly [entityKind]: string;
  constructor(client: PrismaClient, logger: Logger | undefined);
}
type PrismaMySqlConfig = Omit<DrizzleConfig, 'schema'>;
declare function drizzle(config?: PrismaMySqlConfig): (client: any) => {
  $extends: {
    extArgs: {
      result: {};
      model: {};
      query: {};
      client: {
        $drizzle: () => PrismaMySqlDatabase;
      };
    };
  };
};
//#endregion
export { PrismaMySqlConfig, PrismaMySqlDatabase, drizzle };
//# sourceMappingURL=driver.d.cts.map