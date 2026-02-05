import StudyRooms from "@/components/studyrooms/studyrooms";
import { getStudyRooms } from "@/lib/studyrooms/getrooms";
import { groupRoomsByLocationAndRoom } from "@/lib/studyrooms/utils";

function getLAIsoDate() {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "America/Los_Angeles",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(new Date());
}

export default async function StudyRoomsPage() {
	const dates = getLAIsoDate();
	const times = "08:00-22:00";

	const { data: roomsFromApi } = await getStudyRooms(dates, times);

	const grouped = groupRoomsByLocationAndRoom(roomsFromApi);

	return <StudyRooms grouped={grouped} roomsFromApi={roomsFromApi} />;
}
