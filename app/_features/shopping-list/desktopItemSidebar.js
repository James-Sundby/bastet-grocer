"use client";

import Link from "next/link";
import { useState } from "react";

import { CATEGORIES } from "@/app/constants/categories";
import ListManager from "@/app/components/organisms/listManager";

export default function DesktopItemSidebar({
    activeList,
    activeListId,
    selectedItem,
    listManagerProps,
    onAddItem,
    onUpdateItem,
    onDeleteItem,
    onCancelEdit,
    suggestCategory,
    rememberCategoryPreference,
}) {
    return (
        <aside className="min-h-0 overflow-y-auto border-r border-base-300 bg-base-100">
            <div className="flex min-h-full flex-col gap-6 p-5">
                {selectedItem ? (
                    <EditItemForm
                        key={selectedItem.id}
                        item={selectedItem}
                        onUpdateItem={onUpdateItem}
                        onDeleteItem={onDeleteItem}
                        onCancelEdit={onCancelEdit}
                    />
                ) : (
                    <AddItemForm
                        onAddItem={onAddItem}
                        suggestCategory={
                            suggestCategory
                        }
                        rememberCategoryPreference={
                            rememberCategoryPreference
                        }
                    />
                )}

                <div className="mt-auto border-t border-base-300 pt-5">
                    <div className="grid gap-2">
                        <Link
                            href={
                                activeListId
                                    ? `/quick-add?list=${activeListId}`
                                    : "/quick-add"
                            }
                            className="btn btn-outline h-auto px-4 py-2"
                        >
                            Quick Adds
                        </Link>

                        <ListManager
                            {...listManagerProps}
                        />
                    </div>
                </div>
            </div>
        </aside>
    );
}

function AddItemForm({
    onAddItem,
    suggestCategory,
    rememberCategoryPreference,
}) {
    const defaultCategory =
        CATEGORIES[0]?.value ?? "";

    const [name, setName] = useState("");
    const [quantity, setQuantity] =
        useState(1);
    const [category, setCategory] =
        useState(defaultCategory);
    const [note, setNote] = useState("");
    const [isSaving, setIsSaving] =
        useState(false);
    const [
        hasSelectedCategory,
        setHasSelectedCategory,
    ] = useState(false);

    const handleNameChange = (event) => {
        const nextName = event.target.value;

        setName(nextName);

        if (
            !hasSelectedCategory &&
            suggestCategory
        ) {
            setCategory(
                suggestCategory(nextName).category
            );
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedName = name.trim();
        const safeQuantity = Number(quantity);

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

            const succeeded = await onAddItem({
                name: trimmedName,
                quantity: safeQuantity,
                category,
                note: note.trim(),
                completed: false,
            });

            if (!succeeded) {
                return;
            }

            void rememberCategoryPreference?.({
                name: trimmedName,
                category,
                wasManuallySelected:
                    hasSelectedCategory,
            });

            setName("");
            setQuantity(1);
            setNote("");
            setHasSelectedCategory(false);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
        >
            <div>
                <h2 className="text-xl font-bold">
                    Add Item
                </h2>

                <p className="mt-1 text-sm text-base-content/60">
                    Add something to the current
                    shopping list.
                </p>
            </div>

            <label className="form-control">
                <span className="label-text mb-1 font-bold">
                    Item name
                </span>

                <input
                    type="text"
                    required
                    value={name}
                    onChange={handleNameChange}
                    className="input input-bordered w-full"
                    placeholder="Milk, eggs, apples..."
                />
            </label>

            <div className="grid grid-cols-[5rem_1fr] gap-2">
                <label className="form-control">
                    <span className="label-text mb-1 font-bold">
                        Qty
                    </span>

                    <input
                        type="number"
                        min="1"
                        max="99"
                        required
                        value={quantity}
                        onChange={(event) => {
                            const value =
                                event.target
                                    .valueAsNumber;

                            setQuantity(
                                Number.isNaN(value)
                                    ? ""
                                    : value
                            );
                        }}
                        className="input input-bordered w-full"
                    />
                </label>

                <label className="form-control">
                    <span className="label-text mb-1 font-bold">
                        Category
                    </span>

                    <select
                        required
                        value={category}
                        onChange={(event) => {
                            setCategory(
                                event.target.value
                            );
                            setHasSelectedCategory(
                                true
                            );
                        }}
                        className="select select-bordered w-full"
                    >
                        {CATEGORIES.map(
                            (category) => (
                                <option
                                    key={
                                        category.value
                                    }
                                    value={
                                        category.value
                                    }
                                >
                                    {
                                        category.label
                                    }
                                </option>
                            )
                        )}
                    </select>
                </label>
            </div>

            <label className="form-control">
                <span className="label-text mb-1 font-bold">
                    Note
                </span>

                <textarea
                    value={note}
                    onChange={(event) =>
                        setNote(event.target.value)
                    }
                    maxLength={120}
                    rows={3}
                    className="textarea textarea-bordered w-full"
                    placeholder="Brand, flavour, backup choice..."
                />
            </label>

            <button
                type="submit"
                className="btn btn-primary h-auto px-4 py-2"
                disabled={isSaving}
            >
                {isSaving
                    ? "Adding..."
                    : "Add Item"}
            </button>
        </form>
    );
}

function EditItemForm({
    item,
    onUpdateItem,
    onDeleteItem,
    onCancelEdit,
}) {
    const [name, setName] =
        useState(item.name);
    const [quantity, setQuantity] =
        useState(item.quantity);
    const [category, setCategory] =
        useState(item.category);
    const [note, setNote] =
        useState(item.note ?? "");
    const [isSaving, setIsSaving] =
        useState(false);
    const [isDeleting, setIsDeleting] =
        useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedName = name.trim();
        const safeQuantity = Number(quantity);

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

            const succeeded =
                await onUpdateItem(item.id, {
                    name: trimmedName,
                    quantity: safeQuantity,
                    category,
                    note: note.trim(),
                });

            if (succeeded) {
                onCancelEdit();
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);

            const succeeded =
                await onDeleteItem({
                    id: item.id,
                    name: item.name,
                });

            if (succeeded !== false) {
                onCancelEdit();
            }
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit}
            >
                <div>
                    <h2 className="text-xl font-bold">
                        Edit Item
                    </h2>

                    <p className="mt-1 text-sm text-base-content/60">
                        Update the selected grocery item.
                    </p>
                </div>

                <label className="form-control">
                    <span className="label-text mb-1 font-bold">
                        Item name
                    </span>

                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(event) =>
                            setName(
                                event.target.value
                            )
                        }
                        className="input input-bordered w-full"
                    />
                </label>

                <div className="grid grid-cols-[5rem_1fr] gap-2">
                    <label className="form-control">
                        <span className="label-text mb-1 font-bold">
                            Qty
                        </span>

                        <input
                            type="number"
                            min="1"
                            max="99"
                            required
                            value={quantity}
                            onChange={(event) => {
                                const value =
                                    event.target
                                        .valueAsNumber;

                                setQuantity(
                                    Number.isNaN(
                                        value
                                    )
                                        ? ""
                                        : value
                                );
                            }}
                            className="input input-bordered w-full"
                        />
                    </label>

                    <label className="form-control">
                        <span className="label-text mb-1 font-bold">
                            Category
                        </span>

                        <select
                            required
                            value={category}
                            onChange={(event) =>
                                setCategory(
                                    event.target
                                        .value
                                )
                            }
                            className="select select-bordered w-full"
                        >
                            {CATEGORIES.map(
                                (category) => (
                                    <option
                                        key={
                                            category.value
                                        }
                                        value={
                                            category.value
                                        }
                                    >
                                        {
                                            category.label
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </label>
                </div>

                <label className="form-control">
                    <span className="label-text mb-1 font-bold">
                        Note
                    </span>

                    <textarea
                        value={note}
                        onChange={(event) =>
                            setNote(
                                event.target.value
                            )
                        }
                        maxLength={120}
                        rows={3}
                        className="textarea textarea-bordered w-full"
                    />
                </label>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        className="btn btn-outline h-auto px-4 py-2"
                        onClick={onCancelEdit}
                        disabled={isSaving}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="btn btn-primary h-auto px-4 py-2"
                        disabled={isSaving}
                    >
                        {isSaving
                            ? "Saving..."
                            : "Save"}
                    </button>
                </div>
            </form>

            <div className="border-t border-base-300 pt-5">
                <p className="mb-2 text-sm font-bold text-error">
                    Delete item
                </p>

                <button
                    type="button"
                    className="btn btn-error btn-outline btn-sm h-auto px-4 py-2"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting
                        ? "Deleting..."
                        : "Delete"}
                </button>
            </div>
        </>
    );
}