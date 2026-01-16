export function JaggedOutlineOverlay({
	isFirstPage,
	isLastPage,
	theadHeight = 0,
}: {
	isFirstPage: boolean;
	isLastPage: boolean;
	theadHeight?: number;
}) {
	const getStrokeIds = () => {
		if (isFirstPage && !isLastPage) return ["jagged-right-stroke"];
		if (isLastPage && !isFirstPage) return ["jagged-left-stroke"];
		if (!isFirstPage && !isLastPage)
			return ["jagged-right-stroke", "jagged-left-stroke"];
		return [];
	};

	const strokeIds = getStrokeIds();

	if (strokeIds.length === 0) return null;

	return (
		<svg
			className="calendar-jagged-outline"
			viewBox="0 0 1 1"
			preserveAspectRatio="none"
			aria-hidden="true"
			style={{
				top: `${theadHeight}px`,
				height: `calc(100% - ${theadHeight}px + 2px)`,
			}}
		>
			{strokeIds.map((id) => (
				<use
					key={id}
					href={`#${id}`}
					fill="none"
					vectorEffect="non-scaling-stroke"
				/>
			))}
		</svg>
	);
}
