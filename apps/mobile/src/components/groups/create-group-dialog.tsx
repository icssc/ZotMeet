import { GROUP_DESCRIPTION_MAX, GROUP_NAME_MAX } from "@zotmeet/shared";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Typography } from "@/components/ui/typography";
import { ApiError } from "@/lib/api/client";
import { createGroup } from "@/lib/api/groups";
import { Icon } from "@/lib/icons";

/** Native counterpart to the web app's `CreateGroupDialog` (`src/components/groups/`). */
export function CreateGroupDialog() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [isCreating, setIsCreating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const canSubmit =
		name.trim().length > 0 && description.trim().length > 0 && !isCreating;

	const submit = async () => {
		if (!canSubmit) return;

		setIsCreating(true);
		setError(null);
		try {
			const result = await createGroup({
				name: name.trim(),
				description: description.trim(),
			});
			if (!result.success) {
				setError(result.message);
				setIsCreating(false);
				return;
			}
			router.replace({
				pathname: "/groups/[id]",
				params: { id: result.groupId },
			});
		} catch (caught) {
			if (caught instanceof ApiError && caught.status === 401) {
				router.replace("/profile");
				return;
			}
			setError(
				caught instanceof Error ? caught.message : "Failed to create group.",
			);
			setIsCreating(false);
		}
	};

	return (
		<View className="flex-1 bg-paper px-6 pt-4 pb-10">
			<View className="items-end">
				<IconButton
					accessibilityLabel="Close"
					edge="end"
					onPress={() => router.back()}
				>
					<Icon name="close" />
				</IconButton>
			</View>

			<View className="items-center gap-6 pt-2">
				<Typography variant="h5">Create Group</Typography>
				<View className="size-[72px] rounded-full bg-divider" />
			</View>

			<View className="gap-5 pt-8">
				<View className="gap-1">
					<Input
						label="Group Name*"
						value={name}
						onChangeText={(text) => setName(text.slice(0, GROUP_NAME_MAX))}
						maxLength={GROUP_NAME_MAX}
						returnKeyType="next"
					/>
					<Text className="self-end px-3 text-helper text-muted-foreground">
						{name.length}/{GROUP_NAME_MAX}
					</Text>
				</View>
				<View className="gap-1">
					<Input
						label="Group Description*"
						value={description}
						onChangeText={(text) =>
							setDescription(text.slice(0, GROUP_DESCRIPTION_MAX))
						}
						maxLength={GROUP_DESCRIPTION_MAX}
						rows={6}
					/>
					<Text className="self-end px-3 text-helper text-muted-foreground">
						{description.length}/{GROUP_DESCRIPTION_MAX}
					</Text>
				</View>
				{error ? (
					<Typography variant="body2" color="error">
						{error}
					</Typography>
				) : null}
			</View>

			<View className="flex-1" />

			<View className="items-end pt-8">
				<Button
					variant="contained"
					label={isCreating ? "Creating..." : "Create Group"}
					disabled={!canSubmit}
					onPress={submit}
				/>
			</View>
		</View>
	);
}
