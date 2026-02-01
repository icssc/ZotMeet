import { BuildRelationalQueryResult } from "../relations.js";

//#region src/row-mappers/index.d.ts

/**
 * Type for the selection structure used by row mappers.
 */
type RowMapperSelection = BuildRelationalQueryResult['selection'];
/**
 * Result of a row mapper generator.
 * Contains the mapper function and metadata about the expected input format.
 */
interface RowMapperResult {
  /** The mapper function that transforms ALL raw rows into typed objects in a single call */
  mapper: ((rows: Record<string, unknown>[]) => Record<string, unknown>[]) | ((rows: unknown[][]) => Record<string, unknown>[]);
  /** Whether this mapper expects array-mode input (from .values()) */
  isArrayMode: boolean;
  /** The generated function body code (for debugging purposes) */
  code?: string;
}
/**
 * A function that generates a row mapper for a given selection.
 * The row mapper transforms raw database rows into properly typed objects.
 */
type RowMapperGenerator = (selection: RowMapperSelection, parseJson: boolean) => RowMapperResult;
/**
 * JIT-compiled row mapper generator.
 * Uses `new Function()` to generate optimized mapping code at prepare time.
 *
 * **Note:** This mapper does NOT work in environments that restrict dynamic code evaluation,
 * such as Cloudflare Workers, Deno Deploy, or Vercel Edge Functions.
 * Use `interpretedRowMapper` in those environments.
 *
 * @example
 * ```ts
 * import { jitRowMapper } from 'drizzle-orm/row-mappers';
 *
 * const db = drizzle({
 *   client,
 *   schema,
 *   relations,
 *   rowMapperGenerator: jitRowMapper,
 * });
 * ```
 */
declare const jitRowMapper: RowMapperGenerator;
/**
 * Interpreted row mapper generator.
 * Uses a recursive function to map rows at runtime.
 *
 * This mapper works in ALL JavaScript environments, including those that
 * restrict dynamic code evaluation (Cloudflare Workers, Deno Deploy, Vercel Edge Functions).
 *
 * Performance is slightly slower than `jitRowMapper`, but the difference
 * is negligible for most use cases.
 *
 * @example
 * ```ts
 * import { interpretedRowMapper } from 'drizzle-orm/row-mappers';
 *
 * const db = drizzle({
 *   client,
 *   schema,
 *   relations,
 *   rowMapperGenerator: interpretedRowMapper,
 * });
 * ```
 */
declare const interpretedRowMapper: RowMapperGenerator;
/**
 * Default row mapper generator.
 * Currently uses the JIT mapper for best performance.
 */
declare const defaultRowMapper: RowMapperGenerator;
/**
 * JIT-compiled array-mode row mapper generator.
 * Uses `new Function()` to generate optimized mapping code that works with
 * array-based rows from `.values()` queries for maximum performance.
 *
 * This mapper expects the driver to return rows as arrays (e.g., `[1, "John", "2024-01-01"]`)
 * instead of objects (e.g., `{id: 1, name: "John", createdAt: "2024-01-01"}`).
 *
 * **Note:** This mapper does NOT work in environments that restrict dynamic code evaluation,
 * such as Cloudflare Workers, Deno Deploy, or Vercel Edge Functions.
 *
 * @example
 * ```ts
 * import { jitArrayRowMapper } from 'drizzle-orm/row-mappers';
 *
 * const db = drizzle({
 *   client,
 *   schema,
 *   relations,
 *   rowMapperGenerator: jitArrayRowMapper,
 * });
 * ```
 */
declare const jitArrayRowMapper: RowMapperGenerator;
//#endregion
export { RowMapperGenerator, RowMapperResult, RowMapperSelection, defaultRowMapper, interpretedRowMapper, jitArrayRowMapper, jitRowMapper };
//# sourceMappingURL=index.d.ts.map