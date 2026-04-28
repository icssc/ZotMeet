export interface MeetingInviteEmailData {
	inviterName: string;
	meetingTitle: string;
	meetingDescription: string;
	meetingLink: string;
	recipientName: string;
}

export function buildMeetingInviteEmail(data: MeetingInviteEmailData): string {
	return `
    <!DOCTYPE html>
    <html>
        <p>Hi ${data.recipientName}, </p>
        <p>You've been invited to ${data.meetingTitle} by ${data.inviterName}.</p>
        <p>${data.meetingDescription}</p>
        <p>${data.meetingLink}</p>


    </html>
    
    `;
}
