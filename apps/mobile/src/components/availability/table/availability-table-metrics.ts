import { BLOCK_LENGTH } from "@zotmeet/shared";
import { PixelRatio } from "react-native";

/**
 * Shared geometry for the availability table. The web table is a real
 * `<table>`, so its rows and time ticks line up for free; here the time ticks
 * are a separate column, so every vertical measurement is derived from these
 * constants to keep the labels pinned to the hour lines.
 */

/** Height of one hour — the "Hour Block" component in Figma. */
export const HOUR_HEIGHT = 42;

/** Height of one grid row: a `BLOCK_LENGTH`-minute slot, as on the web. */
export const BLOCK_HEIGHT = HOUR_HEIGHT / (60 / BLOCK_LENGTH);

/**
 * Top edge of row `blockIndex`, snapped to the device pixel grid. Rows are
 * placed by this rather than stacked, because `BLOCK_HEIGHT` is fractional
 * and stacked fractional heights leave sub-pixel seams that the column's
 * stripe backdrop shows through.
 */
export function blockTop(blockIndex: number): number {
	return PixelRatio.roundToNearestPixel(blockIndex * BLOCK_HEIGHT);
}

/** The day-header row ("THUR" over "1/1") and the gap under it. */
export const DAY_HEADER_HEIGHT = 44;
export const DAY_HEADER_GAP = 4;

/** `text-[11px]` with a 16px line box, for the time-tick column. */
export const TIME_TICK_LINE_HEIGHT = 16;
