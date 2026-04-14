"use client";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import type { UserProfile } from "@/lib/auth/user";
import {
	removeProfilePicture,
	updateProfilePicture,
	updateUserProfile,
} from "@/server/actions/user/profile/action";

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
	const [displayName, setDisplayName] = useState(user.displayName ?? "");
	const [username, setUsername] = useState(user.username ?? "");
	const [year, setYear] = useState(user.year ?? "");
	const [school, setSchool] = useState(user.school ?? "");
	const [profilePicture, setProfilePicture] = useState(
		user.profilePicture ?? "",
	);
	const [isPending, startTransition] = useTransition();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleSave = () => {
		startTransition(async () => {
			const result = await updateUserProfile({
				displayName,
				username,
				year,
				school,
			});
			if (result.success) {
				toast.success("Profile saved", { duration: 1200 });
			} else {
				toast.error(result.message);
			}
		});
	};

	const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			const base64 = reader.result as string;
			setProfilePicture(base64);
			startTransition(async () => {
				await updateProfilePicture(base64);
			});
		};
		reader.readAsDataURL(file);
	};

	const handleRemovePhoto = () => {
		setProfilePicture("");
		startTransition(async () => {
			await removeProfilePicture();
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
		<div className="flex flex-col gap-8">
			{/* Avatar row */}
			<div className="flex items-center gap-6">
				{profilePicture ? (
					<img
						src={profilePicture}
						alt="Profile"
						className="size-24 rounded-full object-cover"
					/>
				) : (
					<div className="flex size-24 items-center justify-center rounded-full bg-gray-200 font-semibold text-2xl text-gray-500">
						{initials}
					</div>
				)}

				<div className="flex flex-col gap-1">
					<p className="font-semibold text-xl">{displayName}</p>
					{username && <p className="text-gray-500 text-sm">@{username}</p>}
				</div>

				<div className="ml-auto flex items-center gap-4">
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						className="hidden"
						onChange={handleUploadPhoto}
					/>
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
					>
						Upload Photo
					</button>
					<button
						type="button"
						onClick={handleRemovePhoto}
						disabled={!profilePicture}
						className="text-red-500 text-sm hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
					>
						Remove Photo
					</button>
				</div>
			</div>

			<hr className="border-gray-200" />

			{/* Fields */}
			<div className="flex flex-col gap-6">
				<ProfileRow label="Name" description="Your display name">
					<TextField
						label="Name"
						value={displayName}
						onChange={(e) => setDisplayName(e.target.value)}
						fullWidth
						size="small"
						variant="outlined"
					/>
				</ProfileRow>

				<hr className="border-gray-200" />

				<ProfileRow label="Username" description="Your unique username">
					<TextField
						label="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						fullWidth
						size="small"
						variant="outlined"
						inputProps={{ maxLength: 30 }}
					/>
				</ProfileRow>

				<hr className="border-gray-200" />

				<ProfileRow label="Year" description="Your current year or grade">
					<TextField
						label="Year"
						value={year}
						onChange={(e) => setYear(e.target.value)}
						fullWidth
						size="small"
						variant="outlined"
					/>
				</ProfileRow>

				<hr className="border-gray-200" />

				<ProfileRow label="School" description="Your UCI school">
					<Autocomplete
						options={UCI_SCHOOLS}
						value={school || null}
						onChange={(_, value) => setSchool(value ?? "")}
						renderInput={(params) => (
							<TextField {...params} label="School" variant="outlined" />
						)}
					/>
				</ProfileRow>
			</div>

			<div className="flex justify-end">
				<button
					type="button"
					onClick={handleSave}
					disabled={isPending}
					className="rounded bg-[#f1658c] px-6 py-2 font-medium text-sm text-white hover:bg-primary/90 disabled:opacity-50"
				>
					{isPending ? "Saving..." : "Save Changes"}
				</button>
			</div>
		</div>
	);
}

function ProfileRow({
	label,
	description,
	children,
}: {
	label: string;
	description: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex items-center gap-8">
			<div className="w-40 shrink-0">
				<p className="font-medium text-sm">{label}</p>
				<p className="mt-0.5 text-gray-400 text-xs">{description}</p>
			</div>
			<div className="flex-1">{children}</div>
		</div>
	);
}
