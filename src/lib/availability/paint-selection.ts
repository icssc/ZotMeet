/*
 * Moved to `@zotmeet/shared` so the Expo app paints cells by the same rules;
 * re-exported here to keep this module's import path stable.
 */
export {
	type CellPaintTarget,
	effectiveCellTarget,
	type ImportPreviewTarget,
	importPreviewTargetFor,
	type PaintMode,
	type PersonalCellLayers,
	type PersonalCellState,
	paintPersonalSelection,
	paintWillChange,
	personalCellLayers,
	personalCellState,
} from "@zotmeet/shared";
