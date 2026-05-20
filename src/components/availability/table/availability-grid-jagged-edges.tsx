"use client";

import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import type { PageEdgeVariant } from "@/lib/availability/utils";

const EDGE_WIDTH = 10;
const TOOTH_HEIGHT = 8;
const TOOTH_DEPTH = 6;

/** Filled strip with a sawtooth on the inner (right) edge. */
function buildLeftEdgePath(height: number): string {
	const teeth = Math.ceil(height / TOOTH_HEIGHT);
	const parts = ["M 0 0", `L ${EDGE_WIDTH} 0`];
	for (let i = 0; i < teeth; i++) {
		const yPeak = Math.min(i * TOOTH_HEIGHT, height);
		const yValley = Math.min((i + 0.5) * TOOTH_HEIGHT, height);
		const yNextPeak = Math.min((i + 1) * TOOTH_HEIGHT, height);
		if (yPeak < height) parts.push(`L ${EDGE_WIDTH} ${yPeak}`);
		if (yValley < height)
			parts.push(`L ${EDGE_WIDTH - TOOTH_DEPTH} ${yValley}`);
		if (yNextPeak < height && i < teeth - 1) {
			parts.push(`L ${EDGE_WIDTH} ${yNextPeak}`);
		}
	}
	parts.push(`L 0 ${height}`, "Z");
	return parts.join(" ");
}

/** Open path tracing only the inner zigzag edge of the left strip. */
function buildLeftZigzagStroke(height: number): string {
	const teeth = Math.ceil(height / TOOTH_HEIGHT);
	const parts = [`M ${EDGE_WIDTH} 0`];
	for (let i = 0; i < teeth; i++) {
		const yValley = Math.min((i + 0.5) * TOOTH_HEIGHT, height);
		const yNextPeak = Math.min((i + 1) * TOOTH_HEIGHT, height);
		if (yValley < height)
			parts.push(`L ${EDGE_WIDTH - TOOTH_DEPTH} ${yValley}`);
		if (yNextPeak < height) parts.push(`L ${EDGE_WIDTH} ${yNextPeak}`);
	}
	return parts.join(" ");
}

/** Filled strip with a sawtooth on the inner (left) edge. */
function buildRightEdgePath(height: number): string {
	const teeth = Math.ceil(height / TOOTH_HEIGHT);
	const parts = [`M ${EDGE_WIDTH} ${height}`, `L 0 ${height}`];
	for (let i = teeth - 1; i >= 0; i--) {
		const yNextPeak = Math.min((i + 1) * TOOTH_HEIGHT, height);
		const yValley = Math.min((i + 0.5) * TOOTH_HEIGHT, height);
		const yPeak = Math.min(i * TOOTH_HEIGHT, height);
		if (yNextPeak > 0) parts.push(`L 0 ${yNextPeak}`);
		if (yValley > 0) parts.push(`L ${TOOTH_DEPTH} ${yValley}`);
		if (yPeak >= 0) parts.push(`L 0 ${yPeak}`);
	}
	parts.push(`L ${EDGE_WIDTH} 0`, "Z");
	return parts.join(" ");
}

/** Open path tracing only the inner zigzag edge of the right strip. */
function buildRightZigzagStroke(height: number): string {
	const teeth = Math.ceil(height / TOOTH_HEIGHT);
	const parts = ["M 0 0"];
	for (let i = 0; i < teeth; i++) {
		const yValley = Math.min((i + 0.5) * TOOTH_HEIGHT, height);
		const yNextPeak = Math.min((i + 1) * TOOTH_HEIGHT, height);
		if (yValley < height) parts.push(`L ${TOOTH_DEPTH} ${yValley}`);
		if (yNextPeak < height) parts.push(`L 0 ${yNextPeak}`);
	}
	return parts.join(" ");
}

const GRAY_MEDIUM = "#9CA3AF";
const GRAY_BASE = "#D1D5DB";

interface AvailabilityGridJaggedEdgesProps {
	variant: PageEdgeVariant;
	tableRef: React.RefObject<HTMLTableElement | null>;
}

export function AvailabilityGridJaggedEdges({
	variant,
	tableRef,
}: AvailabilityGridJaggedEdgesProps) {
	const theme = useTheme();
	const edgeFill = theme.palette.background.paper;
	/** Matches grid vertical borders (gray-medium) / horizontal (gray-base) in light mode. */
	const edgeStroke = theme.palette.mode === "dark" ? GRAY_BASE : GRAY_MEDIUM;

	const [layout, setLayout] = useState({ top: 0, height: 0, left: 0 });

	const showLeft = variant === "middle" || variant === "last";
	const showRight = variant === "first" || variant === "middle";

	useEffect(() => {
		const table = tableRef.current;
		if (!table) return;

		const thead = table.querySelector("thead");
		const tbody = table.querySelector("tbody");
		if (!thead || !tbody) return;

		const updateLayout = () => {
			const timeCol = thead.querySelector("th");
			setLayout({
				top: tbody.offsetTop,
				height: tbody.offsetHeight,
				left: timeCol?.offsetWidth ?? 0,
			});
		};

		updateLayout();

		const observer = new ResizeObserver(updateLayout);
		observer.observe(table);
		observer.observe(thead);
		observer.observe(tbody);

		return () => observer.disconnect();
	}, [tableRef]);

	if (variant === "none" || layout.height <= 0) {
		return null;
	}

	const edgeHeight = Math.round(layout.height);
	const leftFillPath = buildLeftEdgePath(edgeHeight);
	const leftStrokePath = buildLeftZigzagStroke(edgeHeight);
	const rightFillPath = buildRightEdgePath(edgeHeight);
	const rightStrokePath = buildRightZigzagStroke(edgeHeight);

	const strokeProps = {
		fill: "none",
		stroke: edgeStroke,
		strokeWidth: 1,
		vectorEffect: "non-scaling-stroke" as const,
	};

	return (
		<div
			className="pointer-events-none absolute z-10"
			style={{
				top: layout.top,
				left: layout.left,
				right: 0,
				height: layout.height,
			}}
			aria-hidden
		>
			{showLeft && (
				<svg
					className="absolute top-0 left-0 block overflow-visible"
					width={EDGE_WIDTH}
					height={edgeHeight}
					aria-hidden
					role="presentation"
					focusable="false"
				>
					<path d={leftFillPath} fill={edgeFill} />
					<path d={leftStrokePath} {...strokeProps} />
				</svg>
			)}
			{showRight && (
				<svg
					className="absolute top-0 right-0 block overflow-visible"
					width={EDGE_WIDTH}
					height={edgeHeight}
					aria-hidden
					role="presentation"
					focusable="false"
				>
					<path d={rightFillPath} fill={edgeFill} />
					<path d={rightStrokePath} {...strokeProps} />
				</svg>
			)}
		</div>
	);
}
