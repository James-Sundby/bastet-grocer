const TOAST_DURATION = 3000;
const MAX_TOASTS = 3;

const alertClassByType = {
    success: "alert-success",
    error: "alert-error",
    info: "alert-info",
    warning: "alert-warning",
};

export function addToast(setToasts, toast) {
    const id =
        toast.id ??
        globalThis.crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random()}`;

    const newToast = {
        id,
        type: toast.type ?? "Info",
        message: toast.message,
    };

    setToasts((currentToasts) => [newToast, ...currentToasts].slice(0, MAX_TOASTS));

    setTimeout(() => {
        setToasts((currentToasts) =>
            currentToasts.filter((toast) => toast.id !== id)
        );
    }, TOAST_DURATION);
}

export default function Toast({ toasts }) {
    if (!toasts.length) {
        return null;
    }

    return (
        <div className="toast toast-top toast-center z-50 w-full max-w-md px-4">
            {toasts.map((toast) => {
                const toastType = toast.type.toLowerCase();
                const alertClass = alertClassByType[toastType] ?? "alert-info";

                return (
                    <div
                        key={toast.id}
                        role="status"
                        aria-live="polite"
                        className={`alert ${alertClass} grid-cols-1 border border-base-300 shadow-lg`}
                    >
                        <div>
                            <p className="font-bold">{toast.type}</p>
                            <p className="text-sm">{toast.message}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}