"use client";

import { useState } from "react";

import { CATEGORIES } from "@/app/constants/categories";

export default function NewItemForm({ onAddItem, isQuickAdd = false }) {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [category, setCategory] = useState("bakery");
    const [isChecked, setIsChecked] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        const newItem = {
            name,
            quantity,
            category,
            ...(isQuickAdd ? {} : { completed: false }),
        };

        onAddItem(newItem);
        resetForm();
    };

    const resetForm = () => {
        setName("");
        setQuantity(1);
    };

    const handleCheckboxChange = (e) => {
        e.stopPropagation();
        setIsChecked(e.target.checked);
    };

    return (
        <div className="mx-4 mb-4">
            <div className="collapse card-compact collapse-arrow rounded-md">
                <input
                    type="checkbox"
                    id={`collapse-add-item`}
                    className="collapse-checkbox hidden"
                    checked={isChecked}
                    onChange={handleCheckboxChange} />

                <label
                    htmlFor={`collapse-add-item`}
                    aria-label={isChecked ? "Close new item form" : "Add a new item"}
                    className={`collapse-title bg-primary font-semibold flex items-center ${isChecked ? "bg-info" : "bg-primary"}`}
                >
                    {isChecked ? "Click to Close Form" : "Click to Add an Item"}
                </label>
                <div className="bg-base-200 collapse-content">
                    <form className="card-body" onSubmit={handleSubmit}>
                        <input
                            placeholder="Item Name"
                            type="text"
                            required
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            className="input input-bordered text-base rounded-md"
                            aria-label="Item Name"
                        />
                        <div className="flex space-x-2">
                            <input
                                type="number"
                                min="1"
                                max="99"
                                required
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                value={quantity}
                                className="input input-bordered w-1/4 text-base rounded-md"
                                aria-label="Quantity"
                            />
                            <select
                                required
                                onChange={(e) => setCategory(e.target.value)}
                                value={category}
                                className="select select-bordered flex-grow text-base rounded-md"
                                aria-label="Category"
                            >
                                <option disabled>Select a Category</option>
                                {CATEGORIES.map((category) => (
                                    <option key={category.value} value={category.value} aria-label={category.label}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex">
                            <button type="submit" className="btn btn-primary flex-1 rounded-md">
                                Add Item to List
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
