"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function ZotMeetLogo() {
	const [src, setSrc] = useState("/ZotMeet_BLACK.png");
	const [alt, setAlt] = useState("ZotMeet logo");

	useEffect(() => {
		if (Math.random() < 1 / 10) {
			setSrc("/ZotMeet_Anteater-01.jpg");
			setAlt("Peter the Anteater");
		}
	}, []);

	return <Image src={src} fill alt={alt} />;
}
