import React from "react";

export function addToast(toasts, setToasts, newToast) {
    setToasts([...toasts, newToast]);
    setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== newToast.id));
    }, 700);
}

export default function Toast({ toasts }) {
    return (
        <div className="toast">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    role="alert"

                    className={`alert border border-base-300 shadow-lg rounded-md ${toast.colour}`}
                >
                    <div>
                        <p className="font-bold mr-auto flex">{toast.type}</p>
                        <p className="text-sm">{toast.message}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
