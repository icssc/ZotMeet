export function JaggedClipDefs() {
	return (
		<svg
			width="0"
			height="0"
			style={{ position: "absolute" }}
			aria-hidden="true"
		>
			<defs>
				{/* Masks that preserve time column */}
				<mask
					id="jagged-mask-right"
					maskUnits="objectBoundingBox"
					maskContentUnits="objectBoundingBox"
				>
					<rect x="0" y="0" width="0.08" height="1" fill="white" />
					{/* Data area with right jagged edge */}
					<polygon
						fill="white"
						points="0.08,0 0.98,0 1,0.05 0.98,0.1 1,0.15 0.98,0.2 1,0.25 0.98,0.3 
                     1,0.35 0.98,0.4 1,0.45 0.98,0.5 1,0.55 0.98,0.6 1,0.65 0.98,0.7 
                     1,0.75 0.98,0.8 1,0.85 0.98,0.9 1,0.95 0.98,1 
                     0.08,1"
					/>
				</mask>

				<mask
					id="jagged-mask-left"
					maskUnits="objectBoundingBox"
					maskContentUnits="objectBoundingBox"
				>
					<rect x="0" y="0" width="0.08" height="1" fill="white" />
					{/* Data area with left jagged edge */}
					<polygon
						fill="white"
						points="0.10,0 1,0 1,1 0.10,1 0.08,0.95 0.10,0.9 0.08,0.85 0.10,0.8 
                     0.08,0.75 0.10,0.7 0.08,0.65 0.10,0.6 0.08,0.55 0.10,0.5 
                     0.08,0.45 0.10,0.4 0.08,0.35 0.10,0.3 0.08,0.25 0.10,0.2 
                     0.08,0.15 0.10,0.1 0.08,0.05 0.10,0"
					/>
				</mask>

				<mask
					id="jagged-mask-both"
					maskUnits="objectBoundingBox"
					maskContentUnits="objectBoundingBox"
				>
					<rect x="0" y="0" width="0.08" height="1" fill="white" />
					{/* Data area with both jagged edges */}
					<polygon
						fill="white"
						points="0.10,0 0.98,0 1,0.05 0.98,0.1 1,0.15 0.98,0.2 1,0.25 0.98,0.3 
                     1,0.35 0.98,0.4 1,0.45 0.98,0.5 1,0.55 0.98,0.6 1,0.65 0.98,0.7 
                     1,0.75 0.98,0.8 1,0.85 0.98,0.9 1,0.95 0.98,1 
                     0.10,1 0.08,0.95 0.10,0.9 0.08,0.85 0.10,0.8 0.08,0.75 0.10,0.7 
                     0.08,0.65 0.10,0.6 0.08,0.55 0.10,0.5 0.08,0.45 0.10,0.4 
                     0.08,0.35 0.10,0.3 0.08,0.25 0.10,0.2 0.08,0.15 0.10,0.1 
                     0.08,0.05 0.10,0"
					/>
				</mask>

				<clipPath id="jagged-right" clipPathUnits="objectBoundingBox">
					<polygon
						points="0,0 0.08,0 0.98,0 1,0.05 0.98,0.1 1,0.15 0.98,0.2 1,0.25 0.98,0.3 
                             1,0.35 0.98,0.4 1,0.45 0.98,0.5 1,0.55 0.98,0.6 1,0.65 0.98,0.7 
                             1,0.75 0.98,0.8 1,0.85 0.98,0.9 1,0.95 0.98,1 1,1 0.08,1 0,1"
					/>
				</clipPath>

				<clipPath id="jagged-left" clipPathUnits="objectBoundingBox">
					<polygon
						points="0,0 0.10,0 1,0 1,1 0.08,1 0.08,0.95 0.10,0.9 0.08,0.85 0.10,0.8 
                             0.08,0.75 0.10,0.7 0.08,0.65 0.10,0.6 0.08,0.55 0.10,0.5 
                             0.08,0.45 0.10,0.4 0.08,0.35 0.10,0.3 0.08,0.25 0.10,0.2 
                             0.08,0.15 0.10,0.1 0.08,0.05 0.10,0 0,0"
					/>
				</clipPath>

				<clipPath id="jagged-both" clipPathUnits="objectBoundingBox">
					<polygon
						points="0,0 0.10,0 0.98,0 1,0.05 0.98,0.1 1,0.15 0.98,0.2 1,0.25 0.98,0.3 
                             1,0.35 0.98,0.4 1,0.45 0.98,0.5 1,0.55 0.98,0.6 1,0.65 0.98,0.7 
                             1,0.75 0.98,0.8 1,0.85 0.98,0.9 1,0.95 0.98,1 
                             0.08,1 0.08,0.95 0.10,0.9 0.08,0.85 0.10,0.8 0.08,0.75 0.10,0.7 
                             0.08,0.65 0.10,0.6 0.08,0.55 0.10,0.5 0.08,0.45 0.10,0.4 
                             0.08,0.35 0.10,0.3 0.08,0.25 0.10,0.2 0.08,0.15 0.10,0.1 
                             0.08,0.05 0.10,0 0,0"
					/>
				</clipPath>

				{/* Stroke paths for outlines */}
				<path
					id="jagged-right-stroke"
					clipPathUnits="objectBoundingBox"
					d="M 0.98,0 L 1,0.05 L 0.98,0.1 L 1,0.15 L 0.98,0.2 L 1,0.25 L 0.98,0.3 L 1,0.35 L 0.98,0.4 L 1,0.45 L 0.98,0.5 L 1,0.55 L 0.98,0.6 L 1,0.65 L 0.98,0.7 L 1,0.75 L 0.98,0.8 L 1,0.85 L 0.98,0.9 L 1,0.95 L 0.98,1 L 1,1"
					fill="none"
					vectorEffect="non-scaling-stroke"
				/>

				<path
					id="jagged-left-stroke"
					clipPathUnits="objectBoundingBox"
					d="M 0.10,0 L 0.08,0.05 L 0.10,0.1 L 0.08,0.15 L 0.10,0.2 L 0.08,0.25 L 0.10,0.3 L 0.08,0.35 L 0.10,0.4 L 0.08,0.45 L 0.10,0.5 L 0.08,0.55 L 0.10,0.6 L 0.08,0.65 L 0.10,0.7 L 0.08,0.75 L 0.10,0.8 L 0.08,0.85 L 0.10,0.9 L 0.08,0.95 L 0.10,1 L 0.08,1"
					fill="none"
					vectorEffect="non-scaling-stroke"
				/>
			</defs>
		</svg>
	);
}
