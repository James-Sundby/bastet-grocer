"use client";

import { useState } from "react";
import { CATEGORIES } from "@/app/constants/categories";

export default function NewItemForm({ onAddItem, isQuickAdd = false }) {
    const defaultCategory = CATEGORIES[0]?.value ?? "";

    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [category, setCategory] = useState(defaultCategory);
    const [note, setNote] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const collapseId = isQuickAdd
        ? "collapse-add-quick-item"
        : "collapse-add-item";

    const resetForm = () => {
        setName("");
        setQuantity(1);
        setCategory(defaultCategory);
        setNote("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName || isSubmitting) {
            return;
        }

        const safeQuantity = Number(quantity);

        if (!Number.isInteger(safeQuantity) || safeQuantity < 1) {
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
            await onAddItem(newItem);
            resetForm();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="w-full">
            <div className="collapse collapse-arrow rounded-md border border-base-300 bg-base-100">
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
                                ? "Add a Quick Add"
                                : "Add an Item"}
                    </span>
                </label>

                <div className="collapse-content border-t border-base-300 bg-base-100">
                    <form className="flex flex-col gap-4 pt-4" onSubmit={handleSubmit}>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text font-bold">Item name</span>
                            </div>

                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                className="input input-bordered w-full"
                                placeholder="Milk, eggs, apples..."
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
                                    onChange={(event) => setCategory(event.target.value)}
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

                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text font-bold">Note</span>
                                <div className="badge badge-xs badge-secondary">Opt</div>
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
                    </form>
                </div>
            </div>
        </section>
    );
}