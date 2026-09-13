import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Availability } from "@/components/availability/availability";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useMeeting } from "@/hooks/use-meeting";
import { colorsFor } from "@/lib/theme";

/**
 * Route: `/availability/[slug]`, the same path as the web app's
 * `app/availability/[slug]/page.tsx`. Pushed on the root stack (no tab bar)
 * once a meeting has been created — see `CreateMeetingForm`.
 *
 * The web page loads the meeting on the server and has sibling `loading.tsx`
 * and `not-found.tsx` routes; here `useMeeting` fetches it over the API and
 * the same three states render inline.
 */
export default function AvailabilityScreen() {
	const { slug } = useLocalSearchParams<{ slug: string }>();
	const state = useMeeting(slug);

	if (state.status === "ready") {
		return <Availability key={state.meeting.id} meetingData={state.meeting} />;
	}

	return (
		<StatusScreen>
			{state.status === "loading" ? (
				<Spinner />
			) : state.status === "not-found" ? (
				<Message
					action="Back to Meetings"
					body="The meeting you're looking for doesn't exist or may have been moved."
					title="Oops! Meeting Not Found"
				/>
			) : (
				<Message
					action="Try Again"
					body={state.error}
					onAction={state.reload}
					title="Couldn't load this meeting"
				/>
			)}
		</StatusScreen>
	);
}

/** Same background and safe-area framing as the loaded screen. */
function StatusScreen({ children }: { children: React.ReactNode }) {
	const insets = useSafeAreaInsets();
	return (
		<View
			className="flex-1 items-center justify-center bg-background px-6"
			style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
		>
			{children}
		</View>
	);
}

function Spinner() {
	const { colorScheme } = useColorScheme();
	return (
		<ActivityIndicator
			accessibilityLabel="Loading meeting"
			color={colorsFor(colorScheme).primary}
			size="large"
		/>
	);
}

/**
 * The web `not-found.tsx` card, reduced to its copy: a heading, a line of
 * explanation, and one way out. `onAction` defaults to going back.
 */
function Message({
	title,
	body,
	action,
	onAction,
}: {
	title: string;
	body: string;
	action: string;
	onAction?: () => void;
}) {
	const router = useRouter();
	return (
		<View className="w-full max-w-[320px] items-center gap-6">
			<View className="items-center gap-2">
				<Typography align="center" variant="h6">
					{title}
				</Typography>
				<Typography align="center" color="textSecondary" variant="body2">
					{body}
				</Typography>
			</View>
			<Button
				label={action}
				onPress={onAction ?? (() => router.back())}
				variant="outlined"
			/>
		</View>
	);
}
