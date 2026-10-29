// Mirrors src/components/studyrooms/search-bar.tsx.

import { useState } from "react";
import Legend from "@/components/studyrooms/legend";
import { Card } from "@/components/ui/card";
import { Drawer } from "@/components/ui/drawer";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Icon } from "@/lib/icons";

export default function SearchBar() {
	const availabilityColor = "#86efac";
	const notAvailableColor = "#fca5a5";
	const handleSearch = (text: string) => {
		console.log("Searching for:", text);
	};
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	return (
		<Card className="box-shadow-md mx-6 flex-row items-center gap-1 rounded-xl p-2">
			<Input
				containerClassName="flex-[4]"
				placeholder="Search Rooms"
				startAdornment={<Icon name="search" />}
				onSubmitEditing={(e) => handleSearch(e.nativeEvent.text)}
				autoCapitalize="none"
				autoCorrect={false}
				returnKeyType="search"
			/>
			<IconButton
				accessibilityLabel="Open search filters"
				onPress={() => setIsDrawerOpen(true)}
				className="flex-1 flex-col items-center justify-center"
			>
				<Icon name="filter-list" size={25} />
				<Text className="text-[10px]" numberOfLines={1}>
					Filter & Sort
				</Text>
			</IconButton>
			<Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
				<Legend
					availabilityColor={availabilityColor}
					notAvailableColor={notAvailableColor}
				/>
			</Drawer>
		</Card>
	);
}
