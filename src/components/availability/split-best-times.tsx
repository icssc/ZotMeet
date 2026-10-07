import { Typography } from "@mui/material";
import {
	BLOCK_LENGTH,
	type SplitBestTimes,
	type SplitSession,
} from "@zotmeet/shared";
import { useMemo } from "react";
import type { Member } from "@/lib/types/availability";
import { cn } from "@/lib/utils";

const EN_DASH = "–";
const SLOT_MS = BLOCK_LENGTH * 60_000;

/** "Tue, Oct 14, 2:00 PM – 3:30 PM" for a session's longest window, in `timeZone`. */
function formatSessionWindow(
	session: SplitSession,
	timeZone: string,
	doesntNeedDay: boolean,
): string {
	const run = session.longestRun;
	const start = new Date(run[0]);
	const end = new Date(Date.parse(run[run.length - 1]) + SLOT_MS);
	const day = start.toLocaleDateString("en-US", {
		timeZone,
		weekday: "short",
		...(doesntNeedDay ? {} : { month: "short", day: "numeric" }),
	});
	const time = (d: Date) =>
		d.toLocaleTimeString("en-US", {
			timeZone,
			hour: "numeric",
			minute: "2-digit",
		});
	return `${day}, ${time(start)} ${EN_DASH} ${time(end)}`;
}

/** Contiguous windows in the session besides its longest one. */
function otherWindowCount(session: SplitSession): number {
	let runs = 0;
	let prev = Number.NaN;
	for (const ts of session.timestamps) {
		const t = Date.parse(ts);
		if (t - prev !== SLOT_MS) runs++;
		prev = t;
	}
	return Math.max(0, runs - 1);
}

interface SplitBestTimesListProps {
	split: SplitBestTimes;
	members: readonly Member[];
	hostId: string;
	timeZone: string;
	doesntNeedDay: boolean;
	selectedOption: number | null;
	onSelectOption: (index: number | null) => void;
	onHoverSession: (index: number | null) => void;
}

/**
 * Shown under the Best Times switch when no single slot fits every responder:
 * options that cover everyone across the fewest sessions, each attended by
 * the host. Selecting one draws its sessions on the grid; hovering a session
 * of the selected option draws that session alone.
 */
export function SplitBestTimesList({
	split,
	members,
	hostId,
	timeZone,
	doesntNeedDay,
	selectedOption,
	onSelectOption,
	onHoverSession,
}: SplitBestTimesListProps) {
	const nameById = useMemo(
		() => new Map(members.map((m) => [m.memberId, m.displayName])),
		[members],
	);
	const hostName = nameById.get(hostId) ?? "The host";
	const sessionCount = split.options[0]?.sessions.length ?? 0;

	return (
		<div className="mt-3 flex flex-col gap-2">
			<div>
				<Typography variant="subtitle2">
					No single time fits everyone
				</Typography>
				<Typography variant="caption" color="textSecondary">
					Split into {sessionCount} sessions so everyone attends one. {hostName}{" "}
					can attend each.
				</Typography>
			</div>

			{split.options.map((option, optionIndex) => {
				const isSelected = selectedOption === optionIndex;
				return (
					<button
						key={optionIndex}
						type="button"
						aria-pressed={isSelected}
						onClick={() => onSelectOption(isSelected ? null : optionIndex)}
						// Session rows can't be interactive inside a button, so the
						// button reads which row the pointer is over.
						onPointerMove={(event) => {
							if (!isSelected) return;
							const row = (event.target as HTMLElement).closest<HTMLElement>(
								"[data-session]",
							);
							onHoverSession(row ? Number(row.dataset.session) : null);
						}}
						onPointerLeave={() => isSelected && onHoverSession(null)}
						className={cn(
							"flex flex-col gap-2 rounded-lg border p-3 text-left transition-colors",
							isSelected
								? "border-primary bg-primary/5"
								: "border-gray-base hover:bg-primary/5",
						)}
					>
						<Typography variant="caption" color="textSecondary">
							Option {optionIndex + 1}
						</Typography>
						{option.sessions.map((session, sessionIndex) => {
							const others = otherWindowCount(session);
							const attendees = session.memberIds
								.filter((id) => id !== hostId)
								.map((id) => nameById.get(id) ?? "Unknown");
							return (
								<span
									key={session.memberIds.join(",")}
									data-session={sessionIndex}
									className="flex flex-col"
								>
									<Typography variant="subtitle2" component="span">
										Session {sessionIndex + 1} ·{" "}
										{formatSessionWindow(session, timeZone, doesntNeedDay)}
									</Typography>
									{others > 0 && (
										<Typography variant="caption" color="textSecondary">
											+{others} more {others === 1 ? "window" : "windows"}
										</Typography>
									)}
									<Typography variant="caption" color="textSecondary">
										{hostName} + {attendees.join(", ")}
									</Typography>
								</span>
							);
						})}
					</button>
				);
			})}

			{split.unreachableMemberIds.length > 0 && (
				<Typography variant="caption" color="textSecondary">
					Never free when {hostName} is:{" "}
					{split.unreachableMemberIds
						.map((id) => nameById.get(id) ?? "Unknown")
						.join(", ")}
				</Typography>
			)}
		</div>
	);
}
