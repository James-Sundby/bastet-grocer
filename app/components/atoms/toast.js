const DEFAULT_TOAST_DURATION = 3500;
const MAX_TOASTS = 3;

const alertClassByType = {
    success: "alert-success",
    error: "alert-error",
    info: "alert-info",
    warning: "alert-warning",
};

const defaultTitleByType = {
    success: "Success",
    error: "Something went wrong",
    info: "Heads up",
    warning: "Check this",
};

const friendlyErrorMessages = new Set([
    "Item name is required.",
    "List title is required.",
    "Category is required.",
    "Quantity must be a whole number between 1 and 99.",
    "Quantity must stay between 1 and 99.",
    "That item is already on this list.",
    "That item is already in your quick adds.",
    "Create or select a list before adding items.",
    "Organization is required.",
    "List ID is required.",
    "This item is out of date. Refresh the list and try again.",
    "Someone else changed this item. Refresh the list and try again.",
    "Quantity change must be -1 or 1.",
]);

function normalizeToastType(type) {
    return String(type ?? "info").trim().toLowerCase();
}

export function getFriendlyErrorMessage(error, fallbackMessage) {
    if (friendlyErrorMessages.has(error?.message)) {
        return error.message;
    }

    return fallbackMessage;
}

export function addToast(setToasts, toast) {
    const id =
        toast.id ??
        globalThis.crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random()}`;

    const type = normalizeToastType(toast.type);

    const newToast = {
        id,
        type,
        title: toast.title ?? defaultTitleByType[type] ?? "Notice",
        message: toast.message,
    };

    setToasts((currentToasts) =>
        [newToast, ...currentToasts].slice(0, MAX_TOASTS)
    );

    setTimeout(() => {
        setToasts((currentToasts) =>
            currentToasts.filter((toast) => toast.id !== id)
        );
    }, toast.duration ?? DEFAULT_TOAST_DURATION);
}

export default function Toast({ toasts }) {
    if (!toasts.length) {
        return null;
    }

    return (
        <div className="toast toast-top toast-center z-100 w-full max-w-md px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
            {toasts.map((toast) => {
                const type = normalizeToastType(toast.type);
                const alertClass = alertClassByType[type] ?? "alert-info";
                const isUrgent = type === "error" || type === "warning";

                return (
                    <div
                        key={toast.id}
                        role={isUrgent ? "alert" : "status"}
                        aria-live={isUrgent ? "assertive" : "polite"}
                        aria-atomic="true"
                        className={`alert ${alertClass} alert-soft alert-vertical items-start border border-base-300 shadow-lg sm:alert-horizontal`}
                    >
                        <div>
                            <p className="font-bold">{toast.title}</p>
                            {toast.message && (
                                <p className="text-sm">{toast.message}</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}