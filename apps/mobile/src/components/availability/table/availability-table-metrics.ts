/**
 * Shared geometry for the availability table. The web table is a real
 * `<table>`, so its rows and time ticks line up for free; here the time ticks
 * are a separate column, so every vertical measurement is derived from these
 * constants to keep the labels pinned to the hour lines.
 */

/** Height of one hour — the "Hour Block" component in Figma. */
export const HOUR_HEIGHT = 42;

/** The day-header row ("THUR" over "1/1") and the gap under it. */
export const DAY_HEADER_HEIGHT = 44;
export const DAY_HEADER_GAP = 4;

/** `text-[11px]` with a 16px line box, for the time-tick column. */
export const TIME_TICK_LINE_HEIGHT = 16;
