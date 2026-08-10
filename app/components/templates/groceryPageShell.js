const widthClasses = {
    narrow: "max-w-xl",
    wide: "max-w-6xl",
};

export default function GroceryPageShell({
    children,
    width = "narrow",
}) {
    const widthClass =
        widthClasses[width] ?? widthClasses.narrow;

    return (
        <main className="flex flex-1 flex-col items-center bg-base-200 px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] md:px-8 md:pt-8 md:pb-[calc(env(safe-area-inset-bottom)+2rem)]">
            <div className={`flex w-full ${widthClass} flex-1 flex-col gap-4`}>
                {children}
            </div>
        </main>
    );
}