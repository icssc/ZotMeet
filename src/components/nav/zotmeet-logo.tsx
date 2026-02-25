"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function ZotMeetLogo() {
	const [src, setSrc] = useState("/ZotMeet_BLACK.png");
	const [alt, setAlt] = useState("ZotMeet logo");

	const anteaterImages = [
		"/ZotMeet_Anteater-01.jpg",
		"/ZotMeet_Anteater-02.jpg",
	];

	useEffect(() => {
		if (Math.random() < 1 / 200) {
			setSrc(anteaterImages[Math.floor(Math.random() * anteaterImages.length)]);
			setAlt("Peter the Anteater");
		}
	}, []);

	return <Image src={src} fill alt={alt} />;
}
