const widthClasses = {
	narrow: "max-w-xl",
	shopping: "max-w-xl lg:max-w-7xl",
	wide: "max-w-6xl",
};

const desktopModeClasses = {
	page: {
		main: "lg:overflow-y-auto",
		content: "lg:flex-none",
	},
	workspace: {
		main: "lg:overflow-hidden",
		content: "lg:min-h-0 lg:flex-1",
	},
};

export default function GroceryPageShell({
	children,
	width = "narrow",
	desktopMode = "page",
}) {
	const widthClass = widthClasses[width] ?? widthClasses.narrow;

	const mode = desktopModeClasses[desktopMode] ?? desktopModeClasses.page;

	return (
		<main
			className={`flex min-h-0 flex-1 flex-col items-center bg-base-200 px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] md:px-8 md:pt-8 md:pb-[calc(env(safe-area-inset-bottom)+2rem)] ${mode.main}`}
		>
			<div
				className={`flex w-full ${widthClass} flex-1 flex-col gap-4 ${mode.content}`}
			>
				{children}
			</div>
		</main>
	);
}
