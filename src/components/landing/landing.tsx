import { Box, Button, Chip, Typography } from "@mui/material";
import Image from "next/image";
import { LandingHowItWorks } from "./landing-how-it-works";
import { LandingMeetTheTeam } from "./landing-meet-the-team";
import { LandingNav } from "./landing-nav";

export function Landing() {
	return (
		<div id="landing">
			<LandingNav />
			<div className="mt-10 overflow-x-clip lg:mt-60">
				<div className="mx-auto flex max-w-[1600px] flex-col px-6 lg:flex-row lg:items-center lg:px-16">
					<div className="flex shrink-0 flex-col items-start gap-6 py-10">
						<Chip
							label="Brought to you by UCI's ICS Student Council"
							variant="outlined"
							component="a"
							href="https://studentcouncil.ics.uci.edu/"
							clickable
							rel="noopener noreferrer"
							sx={{ borderColor: "primary.main" }}
						/>
						<Typography
							variant="h2"
							component="h1"
							sx={{
								typography: { xs: "h4", sm: "h3", lg: "h2" },
								fontWeight: { xs: 600, sm: 600, lg: 700 },
							}}
						>
							UC Irvine’s all-in-one <br className="hidden lg:inline" />
							<Box component="span" sx={{ color: "primary.main" }}>
								meeting
							</Box>{" "}
							scheduling <br className="hidden lg:inline" />
							and{" "}
							<Box component="span" sx={{ color: "primary.main" }}>
								room
							</Box>{" "}
							exploring <br className="hidden lg:inline" />
							platform
						</Typography>

						<Typography
							variant="body1"
							color="text.secondary"
							className="max-w-2xl"
						>
							Find the perfect time and place to meet with your group,{" "}
							<br className="hidden lg:inline" /> with seamless access to UCI’s
							campus rooms and resources.
						</Typography>

						<div className="mt-2 flex gap-4">
							<Button
								variant="contained"
								size="large"
								href="http://localhost:3000/auth/login?returnTo=%2F"
							>
								Create a Meeting
							</Button>
							<Button
								variant="outlined"
								size="large"
								href="https://apps.apple.com/us/app/zotmeet/id6773529198"
							>
								Download the App
							</Button>
						</div>
					</div>

					<div className="flex min-w-0 flex-1 justify-center md:justify-start md:pb-16 md:pl-12 lg:items-center lg:py-10 lg:pl-16">
						<div className="relative h-[440px] w-[260px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_60%,transparent)] md:h-auto md:w-auto md:shrink-0 md:overflow-visible 2xl:w-full 2xl:shrink md:[mask-image:none]">
							<Image
								src="/screenshots/hero.png"
								alt="hero"
								width={1666}
								height={984}
								sizes="(min-width: 1536px) 1100px, 1200px"
								className="hidden h-auto w-[1200px] max-w-none rounded-xl shadow-2xl md:block 2xl:w-full"
							/>
							<Image
								src="/screenshots/hero-mobile.png"
								alt="ZotMeet on a phone showing a two-day availability grid"
								width={800}
								height={2000}
								priority
								sizes="(min-width: 768px) 264px, 260px"
								className="h-auto w-full max-w-none md:absolute md:-bottom-[8%] md:-left-[4%] md:w-[22%]"
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="lg:mt-24">
				<LandingHowItWorks />
			</div>
			<div className="lg:mt-24">
				<LandingMeetTheTeam />
			</div>
		</div>
	);
}
