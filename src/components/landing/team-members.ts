/**
 * The people shown in the landing page's "The Students behind ZotMeet" section,
 * in display order.
 *
 * To add a headshot, drop the image in `public/team/` and set `headshot` to its
 * path, e.g. `"/team/ethan-chao.jpg"`. Photos are cropped to fill a 187×225
 * (roughly 5:6) frame, so portrait shots work best; members without one show
 * the mascot placeholder.
 *
 * Each link is optional — its icon only appears once the URL is filled in.
 */
export interface TeamMember {
	name: string;
	position: string;
	headshot?: string;
	websiteUrl?: string;
	linkedinUrl?: string;
	githubUrl?: string;
}

export const teamMembers: TeamMember[] = [
	{
		name: "Ethan Chao",
		position: "Project Lead",
		headshot: undefined,
		websiteUrl: undefined,
		linkedinUrl: undefined,
		githubUrl: undefined,
	},
	{
		name: "Kailee Kaocharoen",
		position: "Design Lead",
		headshot: undefined,
		websiteUrl: undefined,
		linkedinUrl: undefined,
		githubUrl: undefined,
	},
	{
		name: "Valerie Hyunh",
		position: "Design Lead",
		headshot: undefined,
		websiteUrl: undefined,
		linkedinUrl: undefined,
		githubUrl: undefined,
	},
	{
		name: "Arshia Aravinthan",
		position: "Developer",
		headshot: undefined,
		websiteUrl: undefined,
		linkedinUrl: undefined,
		githubUrl: undefined,
	},
	{
		name: "Alex Zhuang",
		position: "Developer",
		headshot: undefined,
		websiteUrl: undefined,
		linkedinUrl: undefined,
		githubUrl: undefined,
	},
	{
		name: "Arya Palanivel",
		position: "Developer",
		headshot: undefined,
		websiteUrl: undefined,
		linkedinUrl: undefined,
		githubUrl: undefined,
	},
	{
		name: "Anna Chen",
		position: "Developer",
		headshot: undefined,
		websiteUrl: undefined,
		linkedinUrl: undefined,
		githubUrl: undefined,
	},
	{
		name: "Ethan Tran",
		position: "Developer",
		headshot: undefined,
		websiteUrl: undefined,
		linkedinUrl: undefined,
		githubUrl: undefined,
	},
	{
		name: "Isaac Phoon",
		position: "Developer",
		headshot: undefined,
		websiteUrl: undefined,
		linkedinUrl: undefined,
		githubUrl: undefined,
	},
	{
		name: "Alex Liu",
		position: "Winter PL 26'",
		headshot: undefined,
		websiteUrl: undefined,
		linkedinUrl: undefined,
		githubUrl: undefined,
	},
	{
		name: "Kyle Tran",
		position: "PL 25'-26'",
		headshot: undefined,
		websiteUrl: undefined,
		linkedinUrl: undefined,
		githubUrl: undefined,
	},
	{
		name: "Arya Mhaiskar",
		position: "Developer 24'-26'",
		headshot: undefined,
		websiteUrl: undefined,
		linkedinUrl: undefined,
		githubUrl: undefined,
	},
];
