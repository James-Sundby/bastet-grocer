"use client";

import { useState } from "react";
import { CATEGORIES } from "@/app/constants/categories";

export default function ItemCard({
    id,
    name,
    quantity,
    category,
    completed = false,
    onDelete,
    onStatusChange,
    onAdd,
    onIncrement,
    onDecrement,
    onUpdate,
    isQuickAdd = false,
    isShoppingMode = false,
}) {
    const [isActionsOpen, setIsActionsOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [draftName, setDraftName] = useState(name);
    const [draftQuantity, setDraftQuantity] = useState(quantity);
    const [draftCategory, setDraftCategory] = useState(category);

    const resetDraft = () => {
        setDraftName(name);
        setDraftQuantity(quantity);
        setDraftCategory(category);
    };

    const startEditMode = () => {
        setDraftName(name);
        setDraftQuantity(quantity);
        setDraftCategory(category);
        setIsEditMode(true);
    };

    const closeEditMode = () => {
        resetDraft();
        setIsEditMode(false);
    };

    const handleCheckboxChange = (event) => {
        event.stopPropagation();
        onStatusChange?.(id, event.target.checked);
    };

    const handleCardClick = () => {
        if (!isShoppingMode || isQuickAdd) {
            return;
        }

        onStatusChange?.(id, !completed);
    };

    const handleToggleActions = (event) => {
        event.stopPropagation();

        setIsActionsOpen((current) => {
            const nextValue = !current;

            if (!nextValue) {
                setIsEditMode(false);
                resetDraft();
            }

            return nextValue;
        });
    };

    const handleSubmitEdit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const trimmedName = draftName.trim();
        const safeQuantity = Number(draftQuantity);

        if (
            !trimmedName ||
            !Number.isInteger(safeQuantity) ||
            safeQuantity < 1 ||
            safeQuantity > 99
        ) {
            return;
        }

        try {
            setIsSaving(true);

            const wasUpdated = await onUpdate?.(id, {
                name: trimmedName,
                quantity: safeQuantity,
                category: draftCategory,
            });

            if (wasUpdated !== false) {
                setIsEditMode(false);
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <li>
            <article
                onClick={handleCardClick}
                className={`card card-sm border border-base-300 bg-base-100 shadow-sm transition ${completed ? "opacity-60" : ""
                    } ${isShoppingMode ? "cursor-pointer active:bg-base-200" : ""}`}
            >
                <div className="card-body gap-4">
                    {isShoppingMode && !isQuickAdd ? (
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id={`checkbox-${id}`}
                                    className="checkbox checkbox-primary checkbox-xl shrink-0"
                                    checked={completed}
                                    onChange={handleCheckboxChange}
                                    onClick={(event) => event.stopPropagation()}
                                    aria-label={`Mark ${name} as in the cart`}
                                    title={`Mark ${name} as in the cart`}
                                />

                                <div className="min-w-0">
                                    <h2 className="wrap-break-word text-3xl font-bold leading-tight">
                                        {name}
                                    </h2>

                                    <p className="mt-1 text-sm font-medium capitalize text-base-content/60">
                                        {category}
                                    </p>
                                </div>
                            </div>

                            <span className="badge badge-primary badge-lg shrink-0">
                                Need <span className="font-bold">{quantity}</span>
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start gap-3">
                                    {!isQuickAdd && (
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${id}`}
                                            className="checkbox checkbox-primary checkbox-lg shrink-0"
                                            checked={completed}
                                            onChange={handleCheckboxChange}
                                            onClick={(event) => event.stopPropagation()}
                                            aria-label={`Mark ${name} as in the cart`}
                                            title={`Mark ${name} as in the cart`}
                                        />
                                    )}

                                    <div className="min-w-0">
                                        <h2 className="wrap-break-word text-2xl font-bold leading-tight">
                                            {name}
                                        </h2>

                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <span className="badge badge-neutral badge-outline">
                                                Qty: <span className="font-bold">{quantity}</span>
                                            </span>

                                            <span className="badge badge-neutral badge-outline h-auto wrap-break-word capitalize">
                                                {category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                {isQuickAdd && (
                                    <button
                                        type="button"
                                        aria-label={`Add ${name} to shopping list`}
                                        onClick={(event) =>
                                            onAdd?.({ name, quantity, category }, event)
                                        }
                                        className="btn btn-primary btn-sm btn-square"
                                        title={`Add ${name} to shopping list`}
                                    >
                                        <svg
                                            aria-hidden="true"
                                            focusable="false"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 576 512"
                                            className="size-4 fill-current"
                                        >
                                            <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                                        </svg>
                                    </button>
                                )}

                                <button
                                    type="button"
                                    aria-expanded={isActionsOpen}
                                    aria-controls={`item-actions-${id}`}
                                    aria-label={
                                        isActionsOpen
                                            ? `Close ${name} options`
                                            : `Open ${name} options`
                                    }
                                    title={
                                        isActionsOpen
                                            ? `Close ${name} options`
                                            : `Open ${name} options`
                                    }
                                    onClick={handleToggleActions}
                                    className="btn btn-ghost btn-sm btn-square"
                                >
                                    {isActionsOpen ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 512 512"
                                            className="size-4 fill-current"
                                            aria-hidden="true"
                                        >
                                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 512 512"
                                            className="size-4 fill-current"
                                            aria-hidden="true"
                                        >
                                            <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8-6.5 30.6-15.1 44-25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {isActionsOpen && !isShoppingMode && (
                    <div
                        id={`item-actions-${id}`}
                        className="border-t border-base-300 bg-base-200/40 px-4 pb-4 pt-3"
                    >
                        {isEditMode ? (
                            <form className="flex flex-col gap-4" onSubmit={handleSubmitEdit}>
                                <label className="form-control w-full">
                                    <div className="label">
                                        <span className="label-text font-bold">Item name</span>
                                    </div>

                                    <input
                                        type="text"
                                        required
                                        value={draftName}
                                        onChange={(event) => setDraftName(event.target.value)}
                                        className="input input-bordered w-full"
                                    />
                                </label>

                                <div className="grid grid-cols-[5rem_1fr] gap-2">
                                    <label className="form-control">
                                        <div className="label">
                                            <span className="label-text font-bold">Qty</span>
                                        </div>

                                        <input
                                            type="number"
                                            min="1"
                                            max="99"
                                            required
                                            value={draftQuantity}
                                            onChange={(event) => {
                                                const value = event.target.valueAsNumber;
                                                setDraftQuantity(Number.isNaN(value) ? "" : value);
                                            }}
                                            className="input input-bordered w-full"
                                        />
                                    </label>

                                    <label className="form-control">
                                        <div className="label">
                                            <span className="label-text font-bold">Category</span>
                                        </div>

                                        <select
                                            required
                                            value={draftCategory}
                                            onChange={(event) => setDraftCategory(event.target.value)}
                                            className="select select-bordered w-full"
                                        >
                                            {CATEGORIES.map((category) => (
                                                <option key={category.value} value={category.value}>
                                                    {category.label}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-sm h-auto px-4 py-2"
                                        onClick={closeEditMode}
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-sm h-auto px-4 py-2"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex flex-wrap items-center gap-2">
                                {onUpdate && (
                                    <button
                                        type="button"
                                        className="btn btn-outline btn-sm h-auto px-4 py-2"
                                        onClick={startEditMode}
                                    >
                                        Edit
                                    </button>
                                )}

                                <button
                                    type="button"
                                    aria-label={`Increase quantity of ${name}`}
                                    className="btn btn-primary btn-sm h-auto px-4 py-2"
                                    onClick={(event) => onIncrement?.({ id, name }, event, 1)}
                                >
                                    + 1
                                </button>

                                {quantity > 1 && (
                                    <button
                                        type="button"
                                        aria-label={`Decrease quantity of ${name}`}
                                        className="btn btn-accent btn-sm h-auto px-4 py-2"
                                        onClick={(event) => onDecrement?.({ id, name }, event, -1)}
                                    >
                                        - 1
                                    </button>
                                )}

                                <button
                                    type="button"
                                    aria-label={`Delete ${name}`}
                                    className="btn btn-error btn-sm ml-auto h-auto px-4 py-2"
                                    onClick={(event) => onDelete?.({ id, name }, event)}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </article>
        </li>
    );
}