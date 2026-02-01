//#region src/entity.d.ts
declare const entityKind: unique symbol;
declare const hasOwnEntityKind: unique symbol;
interface DrizzleEntity {
  [entityKind]: string;
}
type DrizzleEntityClass<T> = ((abstract new (...args: any[]) => T) | (new (...args: any[]) => T)) & DrizzleEntity;
declare function is<T extends DrizzleEntityClass<any>>(value: any, type: T): value is InstanceType<T>;
//#endregion
export { DrizzleEntity, DrizzleEntityClass, entityKind, hasOwnEntityKind, is };
//# sourceMappingURL=entity.d.ts.map