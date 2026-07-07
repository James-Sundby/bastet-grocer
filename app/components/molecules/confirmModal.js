export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    onClose,
    isLoading = false,
    variant = "error",
}) {
    if (!isOpen) {
        return null;
    }

    const confirmButtonClass =
        variant === "error" ? "btn-error" : "btn-primary";

    return (
        <dialog className="modal modal-open" open>
            <div className="modal-box border border-base-300 bg-base-100">
                <h2 className="text-xl font-bold">{title}</h2>

                <p className="mt-3 text-sm text-base-content/75">{message}</p>

                <div className="modal-action">
                    <button
                        type="button"
                        className="btn btn-ghost h-auto px-4 py-2"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </button>

                    <button
                        type="button"
                        className={`btn ${confirmButtonClass} h-auto px-4 py-2`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? "Working..." : confirmLabel}
                    </button>
                </div>
            </div>

            <form method="dialog" className="modal-backdrop">
                <button type="button" onClick={onClose} disabled={isLoading}>
                    close
                </button>
            </form>
        </dialog>
    );
}