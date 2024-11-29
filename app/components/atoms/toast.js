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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="stroke-info h-6 w-6 shrink-0"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                    <div>
                        <p className="font-bold">{toast.type}</p>
                        <p className="text-sm">{toast.message}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
