"use client";

import { useState } from "react";
import { CATEGORIES } from "@/app/constants/categories";

export default function NewItemForm({ onAddItem, isQuickAdd = false }) {
    const defaultCategory = CATEGORIES[0]?.value ?? "";

    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [category, setCategory] = useState(defaultCategory);
    const [isChecked, setIsChecked] = useState(false);

    const collapseId = isQuickAdd
        ? "collapse-add-quick-item"
        : "collapse-add-item";

    const resetForm = () => {
        setName("");
        setQuantity(1);
        setCategory(defaultCategory);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName) {
            return;
        }

        const newItem = {
            name: trimmedName,
            quantity,
            category,
            ...(isQuickAdd ? {} : { completed: false }),
        };

        await onAddItem(newItem);
        resetForm();
    };

    return (
        <div className="w-full max-w-xl">
            <div className="collapse collapse-arrow rounded-box border border-base-300 bg-base-100">
                <input
                    type="checkbox"
                    id={collapseId}
                    checked={isChecked}
                    onChange={(event) => setIsChecked(event.target.checked)}
                />

                <label
                    htmlFor={collapseId}
                    aria-label={isChecked ? "Close new item form" : "Add a new item"}
                    className={`collapse-title flex items-center font-semibold ${isChecked ? "bg-secondary text-secondary-content" : "bg-primary text-primary-content"
                        }`}
                >
                    {isChecked ? "Close Form" : isQuickAdd ? "Add a Quick Add" : "Add an Item"}
                </label>

                <div className="collapse-content bg-base-200">
                    <form className="card-body gap-4 px-0 sm:px-4" onSubmit={handleSubmit}>
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
                                    onChange={(event) => setQuantity(event.target.valueAsNumber)}
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

                        <button type="submit" className="btn btn-lg btn-primary h-auto px-4 py-2">
                            {isQuickAdd ? "Add Quick Add" : "Add Item to List"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}