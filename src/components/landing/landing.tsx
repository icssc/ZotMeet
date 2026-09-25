import { Button, Typography } from "@mui/material";
import Image from "next/image";
import { LandingHowItWorks } from "./landing-how-it-works";
import { LandingNav } from "./landing-nav";

export function Landing() {
	return (
		<div>
			<LandingNav />
			<div className="mt-10 overflow-x-clip lg:mt-60">
				<div className="mx-auto flex max-w-[1600px] flex-col px-6 lg:flex-row lg:items-center lg:px-16">
					<div className="flex shrink-0 flex-col gap-6 py-10">
						<Typography
							variant="h2"
							component="h1"
							sx={{
								typography: { xs: "h4", sm: "h3", lg: "h2" },
								fontWeight: { xs: 700, sm: 700, lg: 700 },
							}}
						>
							Time Sync and <br /> Schedule Meetings
						</Typography>

						{/* Manual line breaks only on lg+; smaller screens wrap within max-w-2xl. */}
						<Typography
							variant="body1"
							color="text.secondary"
							className="max-w-2xl"
						>
							ICSSC Project Teams brings to you ZotMeet a web app and mobile
							application <br className="hidden lg:inline" /> build by students
							for students. Effortlessly coordinate group schedule with native{" "}
							<br className="hidden lg:inline" /> campus integration so your
							study groups, club boards, and student orgs{" "}
							<br className="hidden lg:inline" /> can be on top of your meeting
							game!
						</Typography>

						<div className="mt-2 flex gap-4">
							<Button variant="contained" size="large">
								Create a Meeting
							</Button>
							<Button variant="outlined" size="large">
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
		</div>
	);
}
