import { SQL, SQLWrapper } from "../sql.cjs";
import { AnyColumn } from "../../column.cjs";

//#region src/sql/expressions/select.d.ts

/**
 * Used in sorting, this specifies that the given
 * column or expression should be sorted in ascending
 * order. By the SQL standard, ascending order is the
 * default, so it is not usually necessary to specify
 * ascending sort order.
 *
 * ## Examples
 *
 * ```ts
 * // Return cars, starting with the oldest models
 * // and going in ascending order to the newest.
 * db.select().from(cars)
 *   .orderBy(asc(cars.year));
 * ```
 *
 * @see desc to sort in descending order
 */
declare function asc(column: AnyColumn | SQLWrapper): SQL;
/**
 * Used in sorting, this specifies that the given
 * column or expression should be sorted in descending
 * order.
 *
 * ## Examples
 *
 * ```ts
 * // Select users, with the most recently created
 * // records coming first.
 * db.select().from(users)
 *   .orderBy(desc(users.createdAt));
 * ```
 *
 * @see asc to sort in ascending order
 */
declare function desc(column: AnyColumn | SQLWrapper): SQL;
//#endregion
export { asc, desc };
//# sourceMappingURL=select.d.cts.map