"use client";

import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRef, useState, useTransition } from "react";
import { useSnackbar } from "@/components/ui/snackbar-provider";
import type { UserProfile } from "@/lib/auth/user";
import {
	checkUsernameAvailability,
	updateUserProfile,
} from "@/server/actions/user/profile/action";

const USERNAME_INVALID_CHARS = /[^a-z0-9._]/;

const UCI_SCHOOLS = [
	"Claire Trevor School of the Arts",
	"Charlie Dunlop School of Biological Sciences",
	"The Paul Merage School of Business",
	"School of Education",
	"The Henry Samueli School of Engineering",
	"School of Humanities",
	"Donald Bren School of Information and Computer Sciences",
	"Interdisciplinary Studies",
	"School of Law",
	"School of Medicine",
	"Sue and Bill Gross School of Nursing",
	"School of Pharmacy and Pharmaceutical Sciences",
	"School of Physical Sciences",
	"Joe C. Wen School of Population and Public Health",
	"School of Social Ecology",
	"School of Social Sciences",
];

interface ProfileSettingsProps {
	user: UserProfile;
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
	const initial = {
		displayName: user.displayName ?? "",
		username: user.username ?? "",
		year: user.year ?? "",
		school: user.school ?? "",
	};

	const [displayName, setDisplayName] = useState(initial.displayName);
	const [username, setUsername] = useState(initial.username);
	const [year, setYear] = useState(initial.year);
	const [school, setSchool] = useState(initial.school);
	const [isPending, startTransition] = useTransition();
	const [usernameError, setUsernameError] = useState<string | null>(null);
	const [usernameAvailable, setUsernameAvailable] = useState(false);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const { showSuccess, showError } = useSnackbar();

	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.toLowerCase();
		setUsername(value);
		setUsernameAvailable(false);
		if (debounceRef.current) clearTimeout(debounceRef.current);

		if (value && USERNAME_INVALID_CHARS.test(value)) {
			setUsernameError(
				'Username can only contain the following special characters: "_" and "."',
			);
			return;
		}
		setUsernameError(null);

		if (!value || value === initial.username) return;

		debounceRef.current = setTimeout(async () => {
			const { available } = await checkUsernameAvailability(value);
			setUsernameAvailable(available);
		}, 500);
	};

	const handleDiscard = () => {
		setDisplayName(initial.displayName);
		setUsername(initial.username);
		setYear(initial.year);
		setSchool(initial.school);
		setUsernameError(null);
		setUsernameAvailable(false);
	};

	const handleSave = () => {
		if (usernameError) return;
		startTransition(async () => {
			const result = await updateUserProfile({
				displayName,
				username,
				year,
				school,
			});
			if (result.success) {
				showSuccess("Profile saved");
				setUsernameAvailable(false);
				if (!displayName.trim())
					setDisplayName(user.googleName ?? user.displayName);
				if (!username.trim()) setUsername(initial.username);
			} else {
				showError(result.message ?? "Failed to save profile");
				setUsernameError(result.message ?? null);
			}
		});
	};

	const initials = displayName
		? displayName
				.split(" ")
				.map((n) => n[0])
				.join("")
				.slice(0, 2)
				.toUpperCase()
		: user.email.slice(0, 2).toUpperCase();

	return (
		<Stack direction="row" spacing={6}>
			<Stack
				alignItems="center"
				spacing={1.5}
				sx={{ width: 160, flexShrink: 0 }}
			>
				<Avatar
					src={user.profilePicture ?? undefined}
					alt="Profile"
					slotProps={{ img: { referrerPolicy: "no-referrer" } }}
					sx={{ width: 144, height: 144, fontSize: "2rem", fontWeight: 600 }}
				>
					{initials}
				</Avatar>
			</Stack>

			<Stack sx={{ flex: 1 }} spacing={4}>
				<Stack spacing={2}>
					<Typography variant="h6">Profile</Typography>
					<TextField
						label="Full Name"
						required
						value={displayName}
						onChange={(e) => setDisplayName(e.target.value)}
						fullWidth
						variant="outlined"
					/>
					<Stack spacing={0.5}>
						<TextField
							label="Username"
							required
							value={username}
							onChange={handleUsernameChange}
							fullWidth
							variant="outlined"
							slotProps={{ htmlInput: { maxLength: 30 } }}
						/>
						{usernameError && (
							<FormHelperText
								error
								sx={{ display: "flex", alignItems: "center", gap: 0.5, m: 0 }}
							>
								<CancelIcon fontSize="small" />
								{usernameError}
							</FormHelperText>
						)}
						{!usernameError && usernameAvailable && (
							<FormHelperText
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 0.5,
									m: 0,
									color: "success.main",
								}}
							>
								<CheckCircleIcon fontSize="small" />
								Username is available!
							</FormHelperText>
						)}
					</Stack>
				</Stack>

				<Divider />

				<Stack spacing={2}>
					<Typography variant="h6">About You</Typography>
					<Stack direction="row" spacing={2}>
						<Autocomplete
							sx={{ flex: 1 }}
							options={UCI_SCHOOLS}
							value={school || null}
							onChange={(_, value) => setSchool(value ?? "")}
							renderInput={(params) => (
								<TextField {...params} label="School" variant="outlined" />
							)}
						/>
						<Autocomplete
							sx={{ flex: 1 }}
							options={["1", "2", "3", "4", "5+"]}
							value={year || null}
							onChange={(_, value) => setYear(value ?? "")}
							renderInput={(params) => (
								<TextField {...params} label="Year" variant="outlined" />
							)}
						/>
					</Stack>
				</Stack>

				<Stack direction="row" justifyContent="flex-end" spacing={2}>
					<Button variant="text" color="primary" onClick={handleDiscard}>
						Discard
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={handleSave}
						disabled={isPending}
					>
						{isPending ? "Saving..." : "Save Changes"}
					</Button>
				</Stack>
			</Stack>
		</Stack>
	);
}
