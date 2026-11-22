"use client";

import { createContext, type ReactNode, useContext, useId } from "react";

const ChoiceGroupName = createContext("");

export const useChoiceGroupName = () => useContext(ChoiceGroupName);

export function ChoiceGroup({
	label,
	className,
	children,
}: {
	label: string;
	className?: string;
	children: ReactNode;
}) {
	const name = useId();
	return (
		<div role="radiogroup" aria-label={label} className={className}>
			<ChoiceGroupName.Provider value={name}>
				{children}
			</ChoiceGroupName.Provider>
		</div>
	);
}
