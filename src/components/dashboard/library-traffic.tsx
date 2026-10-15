"use client";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SensorsIcon from "@mui/icons-material/Sensors";
import {
	ButtonBase,
	Collapse,
	LinearProgress,
	type Theme,
	Typography,
} from "@mui/material";
import {
	getTrafficLevel,
	isLibraryTrafficLive,
	type LibraryTrafficLocation,
	type LibraryTrafficOverview,
	type LibraryTrafficSummary,
	summarizeLibraryTraffic,
	type TrafficLevel,
} from "@zotmeet/shared";
import { formatDistanceStrict } from "date-fns";
import { useEffect, useId, useState } from "react";
import { SectionCard } from "@/components/dashboard/dashboard-parts";
import { LibraryRowsSkeleton } from "@/components/dashboard/dashboard-skeletons";
import { fetchLibraryTraffic } from "@/lib/library-traffic/get-library-traffic";

const POLL_MS = 5 * 60 * 1000;
const CLOCK_TICK_MS = 60 * 1000;

const LEVELS: Record<TrafficLevel, { label: string; color: LevelColor }> = {
	quiet: { label: "Quiet", color: "success" },
	moderate: { label: "Moderate", color: "warning" },
	busy: { label: "Busy", color: "error" },
};

type LevelColor = "success" | "warning" | "error";

/** The darker `main` shades are too dim against the dark paper. */
function levelColor(theme: Theme, level: TrafficLevel | null) {
	if (!level) return theme.palette.text.secondary;
	const palette = theme.palette[LEVELS[level].color];
	return theme.palette.mode === "dark" ? palette.light : palette.main;
}

const formatPercentage = (percentage: number | null) =>
	percentage === null ? "—" : `${Math.round(percentage * 100)}%`;

type TrafficState =
	| { status: "loading" }
	| { status: "error" }
	| { status: "ready"; overview: LibraryTrafficOverview };

/**
 * Refetches once the last attempt is `POLL_MS` old, checked each minute and
 * whenever the tab is shown again; a hidden tab never fetches. A failed
 * refetch keeps the last good reading, which shows its own age.
 */
function useLibraryTraffic(): TrafficState {
	const [state, setState] = useState<TrafficState>({ status: "loading" });

	useEffect(() => {
		let controller: AbortController | undefined;
		let lastAttempt = 0;
		const load = () => {
			lastAttempt = Date.now();
			controller?.abort();
			const current = new AbortController();
			controller = current;
			fetchLibraryTraffic({ signal: current.signal })
				.then((rows) =>
					setState({
						status: "ready",
						overview: summarizeLibraryTraffic(rows),
					}),
				)
				.catch((err) => {
					if ((err as Error)?.name === "AbortError") return;
					console.error("Failed to load library traffic:", err);
					setState((prev) =>
						prev.status === "ready" ? prev : { status: "error" },
					);
				});
		};
		const refresh = () => {
			if (document.hidden || Date.now() - lastAttempt < POLL_MS) return;
			load();
		};

		load();
		const timer = setInterval(refresh, CLOCK_TICK_MS);
		document.addEventListener("visibilitychange", refresh);
		return () => {
			controller?.abort();
			clearInterval(timer);
			document.removeEventListener("visibilitychange", refresh);
		};
	}, []);

	return state;
}

/** Re-renders each minute so "Updated … ago" keeps counting. */
function useNow() {
	const [now, setNow] = useState(() => Date.now());
	useEffect(() => {
		const timer = setInterval(() => setNow(Date.now()), CLOCK_TICK_MS);
		return () => clearInterval(timer);
	}, []);
	return now;
}

function formatUpdated(updatedAt: Date, nowMs: number) {
	if (nowMs - updatedAt.getTime() < CLOCK_TICK_MS) return "just now";
	return formatDistanceStrict(updatedAt, nowMs, { addSuffix: true });
}

function TrafficBar({
	percentage,
	level,
	label,
	thin = false,
}: {
	percentage: number | null;
	level: TrafficLevel | null;
	label: string;
	thin?: boolean;
}) {
	return (
		<LinearProgress
			variant="determinate"
			value={Math.min(100, (percentage ?? 0) * 100)}
			aria-label={label}
			sx={(theme) => ({
				height: thin ? 4 : 6,
				borderRadius: 999,
				bgcolor: "action.hover",
				"& .MuiLinearProgress-bar": {
					borderRadius: 999,
					bgcolor: levelColor(theme, level),
				},
			})}
		/>
	);
}

function LocationRow({ location }: { location: LibraryTrafficLocation }) {
	const { locationName, trafficPercentage } = location;
	const level =
		trafficPercentage === null ? null : getTrafficLevel(trafficPercentage);

	return (
		<li className="flex flex-col gap-1">
			<div className="flex items-center justify-between gap-3">
				<Typography variant="body2" color="text.secondary" noWrap>
					{locationName}
				</Typography>
				<Typography
					variant="body2"
					sx={(theme) => ({ color: levelColor(theme, level), flexShrink: 0 })}
				>
					{formatPercentage(trafficPercentage)}
				</Typography>
			</div>
			<TrafficBar
				percentage={trafficPercentage}
				level={level}
				label={`${locationName} occupancy`}
				thin
			/>
		</li>
	);
}

function LibraryRow({
	library,
	now,
}: {
	library: LibraryTrafficSummary;
	now: number;
}) {
	const [open, setOpen] = useState(false);
	const floorsId = useId();
	const { libraryName, percentage, level, locations, updatedAt } = library;
	const expandable = locations.length > 1;
	const stale = updatedAt !== null && !isLibraryTrafficLive(updatedAt, now);

	const header = (
		<div className="flex w-full items-center gap-3">
			<Typography variant="body1" className="min-w-0 flex-1 text-left" noWrap>
				{libraryName}
			</Typography>
			{level && (
				<Typography
					variant="body2"
					sx={(theme) => ({ color: levelColor(theme, level) })}
				>
					{LEVELS[level].label}
				</Typography>
			)}
			<Typography
				variant="body1"
				className="min-w-10 text-right"
				sx={{ fontWeight: 600 }}
			>
				{formatPercentage(percentage)}
			</Typography>
			{/* Keeps every percentage in one column, expandable or not. */}
			<ExpandMoreIcon
				aria-hidden
				sx={{
					fontSize: 20,
					color: "text.secondary",
					visibility: expandable ? "visible" : "hidden",
					transform: open ? "rotate(180deg)" : "none",
					transition: (theme) => theme.transitions.create("transform"),
				}}
			/>
		</div>
	);

	return (
		<li className="flex flex-col gap-2">
			{expandable ? (
				<ButtonBase
					onClick={() => setOpen((o) => !o)}
					aria-expanded={open}
					aria-controls={floorsId}
					sx={{ borderRadius: 1 }}
				>
					{header}
				</ButtonBase>
			) : (
				header
			)}
			<TrafficBar
				percentage={percentage}
				level={level}
				label={`${libraryName} occupancy`}
			/>
			{stale && (
				<Typography variant="caption" color="text.secondary">
					Updated {formatUpdated(updatedAt, now)}
				</Typography>
			)}
			{expandable && (
				<Collapse in={open} id={floorsId}>
					<ul className="m-0 flex list-none flex-col gap-3 p-0 pt-2 pl-3">
						{locations.map((location) => (
							<LocationRow key={location.id} location={location} />
						))}
					</ul>
				</Collapse>
			)}
		</li>
	);
}

/** Occupancy per campus library, busiest first; tap one for its floors. */
export function LibraryTraffic() {
	const state = useLibraryTraffic();
	const now = useNow();
	const overview = state.status === "ready" ? state.overview : null;
	const live = overview ? isLibraryTrafficLive(overview.updatedAt, now) : false;

	return (
		<SectionCard
			component="section"
			className="flex flex-col gap-6 px-5 py-[30px]"
		>
			<div className="flex items-center justify-between gap-3">
				<Typography variant="h6" component="h2">
					Library Traffic
				</Typography>
				{live && (
					<div className="flex items-center gap-1">
						<SensorsIcon
							aria-hidden
							sx={(theme) => ({
								fontSize: 16,
								color: levelColor(theme, "quiet"),
							})}
						/>
						<Typography
							variant="caption"
							sx={(theme) => ({ color: levelColor(theme, "quiet") })}
						>
							Live
						</Typography>
					</div>
				)}
			</div>

			{state.status === "loading" && <LibraryRowsSkeleton />}
			{state.status === "error" && (
				<Typography variant="body2" color="text.secondary">
					Couldn't load library traffic. Try again later.
				</Typography>
			)}
			{overview &&
				(overview.libraries.length === 0 ? (
					<Typography variant="body2" color="text.secondary">
						No library traffic data right now.
					</Typography>
				) : (
					<ul className="m-0 flex list-none flex-col gap-5 p-0">
						{overview.libraries.map((library) => (
							<LibraryRow
								key={library.libraryName}
								library={library}
								now={now}
							/>
						))}
					</ul>
				))}

			{overview?.updatedAt && (
				<Typography variant="caption" color="text.secondary">
					Updated {formatUpdated(overview.updatedAt, now)} · via{" "}
					<a
						href="https://anteaterapi.com"
						target="_blank"
						rel="noreferrer"
						className="text-inherit underline-offset-2 hover:underline"
					>
						Anteater API
					</a>
				</Typography>
			)}
		</SectionCard>
	);
}
