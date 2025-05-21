import { GroupCard } from "@/components/summary/GroupCard";

export const GroupsDisplay = () => {
    return (
        <div className="flex w-full flex-nowrap gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar]:h-[5px]">
            <GroupCard name="AntAlmanac" />
            <GroupCard name="ZotMeet" />
            <GroupCard name="Some group" />
            <GroupCard name="Some group" />
            <GroupCard name="Some group" />
            <GroupCard name="Some group" />
        </div>
    );
};
