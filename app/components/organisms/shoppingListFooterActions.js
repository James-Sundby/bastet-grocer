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
            <div className="mt-auto grid w-full max-w-xl grid-cols-2 gap-3 pt-8">
                <button
                    type="button"
                    className="btn btn-outline h-auto px-4 py-2"
                    onClick={onExitShoppingMode}
                >
                    Exit Mode
                </button>

                {hasCompletedItems ? (
                    <ClearCompletedButton
                        onClearCompleted={onClearCompleted}
                        count={completedCount}
                    />
                ) : (
                    <button type="button" className="btn btn-disabled h-auto px-4 py-2">
                        Clear Checked
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