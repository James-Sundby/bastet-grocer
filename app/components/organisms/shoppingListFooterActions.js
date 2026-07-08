import ClearCompletedButton from "../atoms/clearCompletedButton";
import DeleteAllButton from "../atoms/deleteAllButton";

export default function ShoppingListFooterActions({
    isShoppingMode,
    hasCompletedItems,
    completedCount,
    showActionGroup,
    onExitShoppingMode,
    onClearCompleted,
    onDeleteAll,
}) {
    if (isShoppingMode) {
        return (
            <div className="mt-auto w-full max-w-xl pt-8">
                {hasCompletedItems ? (
                    <div className="grid grid-cols-2 gap-3">
                        <ClearCompletedButton
                            onClearCompleted={onClearCompleted}
                            count={completedCount}
                        />
                        <button
                            type="button"
                            className="btn btn-accent h-auto px-4 py-2"
                            onClick={onExitShoppingMode}
                        >
                            Exit Mode
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        className="btn btn-accent h-auto px-4 py-2 w-full"
                        onClick={onExitShoppingMode}
                    >
                        Exit Mode
                    </button>
                )}
            </div>
        );
    }

    if (!showActionGroup) {
        return null;
    }

    return (
        <div className="mt-auto w-full max-w-xl pt-8">
            {hasCompletedItems ? (
                <div className="grid grid-cols-2 gap-3">
                    <ClearCompletedButton
                        onClearCompleted={onClearCompleted}
                        count={completedCount}
                    />
                    <DeleteAllButton onDeleteAll={onDeleteAll} />
                </div>
            ) : (
                <DeleteAllButton onDeleteAll={onDeleteAll} />
            )}
        </div>
    );
}