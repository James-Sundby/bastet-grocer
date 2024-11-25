"use client";

import { useState } from "react";

import { CATEGORIES } from "@/app/constants/categories";

export default function NewItemForm({ onAddItem, isQuickAdd = false }) {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [category, setCategory] = useState("bakery");

    const handleSubmit = (event) => {
        event.preventDefault();

        const newItem = {
            name,
            quantity,
            category,
            ...(isQuickAdd ? {} : { completed: false }), // Add `completed` only for non-QuickAdd
        };

        onAddItem(newItem);
        resetForm();
    };

    const resetForm = () => {
        setName("");
        setQuantity(1);
    };

    return (<>
        {/* <div className="card card-compact bg-transparent">
            <form className="card-body" onSubmit={handleSubmit}>
                <input
                    placeholder="Item Name"
                    type="text"
                    required
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className="input input-bordered text-base"
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
                        className="input input-bordered w-1/4 text-base"
                        aria-label="Quantity"
                    />
                    <select
                        required
                        onChange={(e) => setCategory(e.target.value)}
                        value={category}
                        className="select select-bordered flex-grow text-base"
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
                    <button type="submit" className="btn btn-primary flex-1">
                        Add Item to List
                    </button>
                </div>
            </form>
        </div> */}
        <div className="mx-4 mb-4">
            <div className="collapse card-compact collapse-arrow">
                <input
                    type="checkbox"
                    id={`collapse-add-item`}
                    className="collapse-checkbox hidden" />

                <label
                    htmlFor={`collapse-add-item`}
                    aria-label="Edit item details"
                    className="collapse-title bg-primary font-semibold flex items-center"
                >
                    Click to Add a New Item
                </label>
                {/* <div className="collapse-title bg-primary font-semibold flex items-center">
                    Click to Add a New Item
                </div> */}
                <div className="bg-base-200 collapse-content">
                    <form className="card-body" onSubmit={handleSubmit}>
                        <input
                            placeholder="Item Name"
                            type="text"
                            required
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            className="input input-bordered text-base"
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
                                className="input input-bordered w-1/4 text-base"
                                aria-label="Quantity"
                            />
                            <select
                                required
                                onChange={(e) => setCategory(e.target.value)}
                                value={category}
                                className="select select-bordered flex-grow text-base"
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
                            <button type="submit" className="btn btn-primary flex-1">
                                Add Item to List
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
    );
}
