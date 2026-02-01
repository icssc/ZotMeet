import { PrismaPgQueryResultHKT } from "./session.cjs";
import { entityKind } from "../../entity.cjs";
import { DrizzleConfig } from "../../utils.cjs";
import { Logger } from "../../logger.cjs";
import { PgAsyncDatabase } from "../../pg-core/async/db.cjs";
import { PrismaClient } from "@prisma/client/extension";

//#region src/prisma/pg/driver.d.ts
declare class PrismaPgDatabase extends PgAsyncDatabase<PrismaPgQueryResultHKT, Record<string, never>> {
  static readonly [entityKind]: string;
  constructor(client: PrismaClient, logger: Logger | undefined);
}
type PrismaPgConfig = Omit<DrizzleConfig, 'schema'>;
declare function drizzle(config?: PrismaPgConfig): (client: any) => {
  $extends: {
    extArgs: {
      result: {};
      model: {};
      query: {};
      client: {
        $drizzle: () => PrismaPgDatabase;
      };
    };
  };
};
//#endregion
export { PrismaPgConfig, PrismaPgDatabase, drizzle };
//# sourceMappingURL=driver.d.cts.map