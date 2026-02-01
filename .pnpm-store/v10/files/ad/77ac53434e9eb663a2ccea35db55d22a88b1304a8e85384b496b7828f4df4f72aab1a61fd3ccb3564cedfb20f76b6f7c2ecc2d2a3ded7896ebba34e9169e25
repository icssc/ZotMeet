import { QueryTypingsValue } from "../../sql/sql.cjs";
import * as _aws_sdk_client_rds_data0 from "@aws-sdk/client-rds-data";
import { Field, TypeHint } from "@aws-sdk/client-rds-data";

//#region src/aws-data-api/common/index.d.ts
declare const typeHint: { [K in TypeHint]: K };
declare function getValueFromDataApi(field: Field): string | number | boolean | string[] | number[] | Uint8Array<ArrayBufferLike> | boolean[] | _aws_sdk_client_rds_data0.ArrayValue[] | null;
declare function typingsToAwsTypeHint(typings?: QueryTypingsValue): TypeHint | undefined;
declare function toValueParam(value: any, typings?: QueryTypingsValue): {
  value: Field;
  typeHint?: TypeHint;
};
//#endregion
export { getValueFromDataApi, toValueParam, typeHint, typingsToAwsTypeHint };
//# sourceMappingURL=index.d.cts.map