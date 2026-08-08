"use client";

import { useState } from "react";
import { CATEGORIES } from "@/app/constants/categories";

export default function NewItemForm({ onAddItem, isQuickAdd = false, suggestCategory, rememberCategoryPreference }) {
    const defaultCategory = CATEGORIES[0]?.value ?? "";

    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [category, setCategory] = useState(defaultCategory);
    const [note, setNote] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasSelectedCategory, setHasSelectedCategory] = useState(false);

    const collapseId = isQuickAdd
        ? "collapse-add-quick-item"
        : "collapse-add-item";

    const categoryHelpId = `${collapseId}-category-help`;

    const currentSuggestion = suggestCategory
        ? suggestCategory(name)
        : null;

    const isShowingAutomaticSuggestion =
        !hasSelectedCategory &&
        name.trim() &&
        currentSuggestion &&
        currentSuggestion.category === category &&
        currentSuggestion.source !== "fallback";

    const resetForm = () => {
        setName("");
        setQuantity(1);
        setNote("");
        setHasSelectedCategory(false);

        // Keep the last category visible until the next item name produces a new automatic suggestion.
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName || isSubmitting) {
            return;
        }

        const safeQuantity = Number(quantity);

        if (
            !Number.isInteger(safeQuantity) ||
            safeQuantity < 1 ||
            safeQuantity > 99
        ) {
            return;
        }

        const newItem = {
            name: trimmedName,
            quantity: safeQuantity,
            category,
            note: note.trim(),
            ...(isQuickAdd ? {} : { completed: false }),
        };

        try {
            setIsSubmitting(true);

            const wasAdded = await onAddItem(newItem);

            if (!wasAdded) {
                return;
            }

            void rememberCategoryPreference?.({
                name: trimmedName,
                category,
                wasManuallySelected: hasSelectedCategory,
            });

            resetForm();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="w-full">
            <div className={`collapse collapse-arrow rounded-md border border-base-300 bg-primary`}>

                <input
                    type="checkbox"
                    id={collapseId}
                    checked={isChecked}
                    onChange={(event) => setIsChecked(event.target.checked)}
                />
                <label
                    htmlFor={collapseId}
                    aria-label={isChecked ? "Close new item form" : "Add a new item"}
                    className="collapse-title flex items-center justify-between gap-3 font-semibold"
                >
                    <span>
                        {isChecked
                            ? "Close Form"
                            : isQuickAdd
                                ? "Create a Quick Add"
                                : "Add a new Item"}
                    </span>
                </label>

                <div className={`collapse-content bg-base-100 ${isChecked ? 'border-t border-base-300' : ''}`}>
                    <form className="flex flex-col gap-4 pt-4" onSubmit={handleSubmit}>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text font-bold">Item name</span>
                            </div>

                            <input
                                type="text"
                                required
                                value={name}
                                className="input input-bordered w-full"
                                placeholder="Milk, eggs, apples..."
                                onChange={(event) => {
                                    const nextName = event.target.value;

                                    setName(nextName);

                                    if (!hasSelectedCategory && suggestCategory) {
                                        const suggestion = suggestCategory(nextName);
                                        setCategory(suggestion.category);
                                    }
                                }}
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
                                    value={quantity}
                                    onChange={(event) => {
                                        const value = event.target.valueAsNumber;
                                        setQuantity(Number.isNaN(value) ? "" : value);
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
                                    value={category}
                                    aria-describedby={
                                        isShowingAutomaticSuggestion
                                            ? categoryHelpId
                                            : undefined
                                    }
                                    onChange={(event) => {
                                        setCategory(event.target.value);
                                        setHasSelectedCategory(true);
                                    }}
                                    className="select select-bordered w-full"
                                >
                                    {CATEGORIES.map((category) => (
                                        <option
                                            key={category.value}
                                            value={category.value}
                                        >
                                            {category.label}
                                        </option>
                                    ))}
                                </select>

                                <div className="min-h-5 pt-1">
                                    {isShowingAutomaticSuggestion && (
                                        <span
                                            id={categoryHelpId}
                                            className="text-xs font-medium text-primary"
                                        >
                                            {currentSuggestion.source === "preference"
                                                ? "Remembered for this household"
                                                : "Suggested from the item name"}
                                        </span>
                                    )}
                                </div>
                            </label>
                        </div>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text font-bold">Note</span>
                                <div className="badge badge-sm badge-secondary">Optional</div>
                            </div>

                            <textarea
                                value={note}
                                onChange={(event) => setNote(event.target.value)}
                                maxLength={120}
                                rows={2}
                                className="textarea textarea-bordered w-full"
                                placeholder="Brand, flavour, backup choice..."
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary btn-lg h-auto w-full px-4 py-2"
                        >
                            {isSubmitting
                                ? "Adding..."
                                : isQuickAdd
                                    ? "Add Quick Add"
                                    : "Add Item to List"}
                        </button>
                    </form >
                </div >
            </div >
        </section >
    );
}