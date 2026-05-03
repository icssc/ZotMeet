"use client";

import {
	acceptInvite,
	declineInvite,
} from "@actions/group/invite/create/action";
import {
	Avatar,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import type { UserProfile } from "@/lib/auth/user";
import { GROUP_INVITE_QUERY_PARAM } from "@/lib/group-open-invite";

export type GroupInviteUrlPreview = {
	token: string;
	groupName: string;
	groupIcon: string | null;
};

type GroupInviteFromUrlHandlerProps = {
	user: UserProfile | null;
	preview: GroupInviteUrlPreview | null;
	stripInviteQuery: boolean;
};

export function GroupInviteFromUrlHandler({
	user,
	preview,
	stripInviteQuery,
}: GroupInviteFromUrlHandlerProps) {
	const router = useRouter();
	const [, setInviteToken] = useQueryState(
		GROUP_INVITE_QUERY_PARAM,
		parseAsString,
	);
	const [open, setOpen] = useState(Boolean(preview));
	const [acceptError, setAcceptError] = useState<string | null>(null);

	useEffect(() => {
		if (stripInviteQuery) {
			void setInviteToken(null);
		}
	}, [stripInviteQuery, setInviteToken]);

	useEffect(() => {
		if (preview) {
			setOpen(true);
			setAcceptError(null);
		}
	}, [preview]);

	const clearInviteFromUrl = () => {
		void setInviteToken(null);
	};

	const handleClose = () => {
		setOpen(false);
		clearInviteFromUrl();
	};

	const handleAccept = async () => {
		if (!preview || !user) return;
		setAcceptError(null);
		const result = await acceptInvite(preview.token);
		if (result.success) {
			setOpen(false);
			clearInviteFromUrl();
			router.refresh();
		} else {
			setAcceptError(result.message);
		}
	};

	const handleDecline = async () => {
		if (!preview || !user) return;
		await declineInvite(preview.token);
		setOpen(false);
		clearInviteFromUrl();
		router.refresh();
	};

	if (!preview) {
		return null;
	}

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
			<DialogTitle>Join group</DialogTitle>
			<DialogContent>
				<div className="flex items-center gap-3">
					<Avatar
						src={preview.groupIcon || "/icssc-logo.svg"}
						alt=""
						sx={{ width: 50, height: 50 }}
					/>
					<div>
						<p className="font-semibold">{preview.groupName}</p>
						<p className="text-gray-600 text-sm">
							You&apos;ve been invited to join this group.
						</p>
						{acceptError ? (
							<p className="mt-2 text-red-600 text-sm">{acceptError}</p>
						) : null}
					</div>
				</div>
			</DialogContent>
			<DialogActions>
				{user ? (
					<>
						<Button onClick={handleDecline}>Decline</Button>
						<Button variant="contained" onClick={handleAccept}>
							Accept
						</Button>
					</>
				) : (
					<>
						<Button onClick={handleClose}>Not now</Button>
						<Button
							component={Link}
							href="/auth/login/google"
							variant="contained"
						>
							Sign in to accept
						</Button>
					</>
				)}
			</DialogActions>
		</Dialog>
	);
}
