import {
	createNewNotification,
	getNotificationsByUserId,
	markNotificationAsRead,
} from "@/server/data/user/queries";

await markNotificationAsRead("1fce73ef-0fbf-4a61-a298-7a4153b29df4");
console.log("Test completed");

export default function TestPage() {
	return <div>Test Page</div>;
}
