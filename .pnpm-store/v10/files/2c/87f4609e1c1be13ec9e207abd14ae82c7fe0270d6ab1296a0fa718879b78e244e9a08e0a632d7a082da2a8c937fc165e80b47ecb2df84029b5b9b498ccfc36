import { DrizzleConfig } from "../../utils.js";
import { BaseSQLiteDatabase } from "../../sqlite-core/index.js";

//#region src/prisma/sqlite/driver.d.ts
type PrismaSQLiteDatabase = BaseSQLiteDatabase<'async', []>;
type PrismaSQLiteConfig = Omit<DrizzleConfig, 'schema'>;
declare function drizzle(config?: PrismaSQLiteConfig): (client: any) => {
  $extends: {
    extArgs: {
      result: {};
      model: {};
      query: {};
      client: {
        $drizzle: () => PrismaSQLiteDatabase;
      };
    };
  };
};
//#endregion
export { PrismaSQLiteConfig, PrismaSQLiteDatabase, drizzle };
//# sourceMappingURL=driver.d.ts.map