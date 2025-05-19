export const GroupCard = ({ name }: { name: string }) => {
    return (
        <div className="flex flex-shrink-0 cursor-pointer gap-4 rounded-xl border border-gray-200 bg-white p-2 pr-8">
            <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-gray-300" />

            <div className="flex flex-grow flex-col justify-between">
                <div className="flex -space-x-4">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="h-8 w-8 rounded-full border-2 border-white bg-gray-300"
                        />
                    ))}
                </div>
                <h3 className="font-dm-sans text-xl font-medium text-gray-800">
                    {name}
                </h3>
                <p className="font-dm-sans text-xs font-medium text-gray-500">
                    8 upcoming meetings
                </p>
            </div>
        </div>
    );
};
