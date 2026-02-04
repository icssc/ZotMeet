import StudyRoomsClient from "@/app/studyrooms/studyrooms-client";
import { getStudyRooms } from "@/lib/studyrooms/getrooms";
import { groupRoomsByLocationAndRoom } from "@/lib/studyrooms/groupRooms";

export default async function StudyRoomsPage() {
	const dates = "2026-02-04";
	const times = "08:00-23:59";

	const { data: roomsFromApi } = await getStudyRooms(dates, times);
	const grouped = groupRoomsByLocationAndRoom(roomsFromApi);

	return <StudyRoomsClient grouped={grouped} roomsFromApi={roomsFromApi} />;
}
