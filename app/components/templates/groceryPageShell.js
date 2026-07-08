export default function GroceryPageShell({ children }) {
    return (
        <main
            className="flex flex-1 flex-col items-center bg-base-200 px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] md:px-8 md:pt-8 md:pb-[calc(env(safe-area-inset-bottom)+2rem)]"
            role="main"
        >
            <div className="flex w-full max-w-xl flex-1 flex-col items-center gap-4">
                {children}
            </div>
        </main>
    );
}