import { t as CasingType } from "./common-C4PhmYTg.js";

//#region src/cli/validations/sqlite.d.ts

type SqliteCredentials = {
  driver: 'd1-http';
  accountId: string;
  databaseId: string;
  token: string;
} | {
  driver: 'sqlite-cloud';
  url: string;
} | {
  url: string;
};
//#endregion
//#region src/ext/api-sqlite.d.ts
declare const startStudioServer: (imports: Record<string, unknown>, credentials: SqliteCredentials, options?: {
  host?: string;
  port?: number;
  casing?: CasingType;
  key?: string;
  cert?: string;
}) => Promise<void>;
//#endregion
export { startStudioServer };