"use client";

import { useState } from "react";

import { CATEGORIES } from "@/app/constants/categories";
import { CancelIcon, PlusIcon, SaveIcon, TrashIcon } from "../atoms/icons";

export default function ItemEditor({
	item = null,
	copy,
	onAddItem,
	onUpdateItem,
	onDeleteItem,
	onCancelEdit,
	suggestCategory,
	rememberCategoryPreference,
}) {
	const isEditing = Boolean(item);

	const defaultCategory = CATEGORIES[0]?.value ?? "";

	const [name, setName] = useState(item?.name ?? "");

	const [quantity, setQuantity] = useState(item?.quantity ?? 1);

	const [category, setCategory] = useState(item?.category ?? defaultCategory);

	const [note, setNote] = useState(item?.note ?? "");

	const [hasSelectedCategory, setHasSelectedCategory] = useState(false);

	const [isSaving, setIsSaving] = useState(false);

	const [isDeleting, setIsDeleting] = useState(false);

	const currentSuggestion =
		!isEditing && suggestCategory ? suggestCategory(name) : null;

	const isShowingAutomaticSuggestion =
		!isEditing &&
		!hasSelectedCategory &&
		Boolean(name.trim()) &&
		currentSuggestion &&
		currentSuggestion.category === category &&
		currentSuggestion.source !== "fallback";

	const handleNameChange = (event) => {
		const nextName = event.target.value;

		setName(nextName);

		if (isEditing || hasSelectedCategory || !suggestCategory) {
			return;
		}

		const suggestion = suggestCategory(nextName);

		if (suggestion?.category) {
			setCategory(suggestion.category);
		}
	};

	const resetAddForm = () => {
		setName("");
		setQuantity(1);
		setNote("");
		setHasSelectedCategory(false);

		// Deliberately keep the current category.
		// A new name can replace it with another
		// automatic suggestion.
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const trimmedName = name.trim();
		const safeQuantity = Number(quantity);

		if (
			!trimmedName ||
			!Number.isInteger(safeQuantity) ||
			safeQuantity < 1 ||
			safeQuantity > 99 ||
			isSaving
		) {
			return;
		}

		const nextItem = {
			name: trimmedName,
			quantity: safeQuantity,
			category,
			note: note.trim(),
		};

		try {
			setIsSaving(true);

			if (isEditing) {
				const succeeded = await onUpdateItem(item.id, nextItem);

				if (succeeded !== false) {
					onCancelEdit();
				}

				return;
			}

			const succeeded = await onAddItem(nextItem);

			if (succeeded === false) {
				return;
			}

			void rememberCategoryPreference?.({
				name: trimmedName,
				category,
				wasManuallySelected: hasSelectedCategory,
			});

			resetAddForm();
		} finally {
			setIsSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!item || !onDeleteItem || isDeleting) {
			return;
		}

		try {
			setIsDeleting(true);

			const succeeded = await onDeleteItem({
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

	const isBusy = isSaving || isDeleting;

	return (
		<>
			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				<div>
					<h2 className="text-xl font-bold">
						{isEditing ? copy.editTitle : copy.addTitle}
					</h2>

					<p className="mt-1 text-sm text-base-content/60">
						{isEditing ? copy.editDescription : copy.addDescription}
					</p>
				</div>

				<label className="form-control w-full">
					<span className="label-text mb-1 font-bold">Item name</span>

					<input
						type="text"
						required
						maxLength={100}
						value={name}
						onChange={handleNameChange}
						className="input input-bordered w-full"
						placeholder="Milk, eggs, apples..."
						disabled={isBusy}
					/>
				</label>

				<div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-2">
					<label className="form-control">
						<span className="label-text mb-1 font-bold">Qty</span>

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
							disabled={isBusy}
						/>
					</label>

					<label className="form-control">
						<span className="label-text mb-1 font-bold">Category</span>

						<select
							required
							value={category}
							onChange={(event) => {
								setCategory(event.target.value);

								setHasSelectedCategory(true);
							}}
							className="select select-bordered w-full"
							disabled={isBusy}
						>
							{CATEGORIES.map((category) => (
								<option key={category.value} value={category.value}>
									{category.label}
								</option>
							))}
						</select>
					</label>
				</div>

				{isShowingAutomaticSuggestion && (
					<p className="-mt-2 text-xs text-primary">
						{currentSuggestion.source === "preference"
							? "Remembered for this household"
							: "Suggested from the item name"}
					</p>
				)}

				<label className="form-control w-full">
					<span className="label-text mb-1 font-bold">Note</span>

					<textarea
						value={note}
						onChange={(event) => setNote(event.target.value)}
						maxLength={120}
						rows={3}
						className="textarea textarea-bordered w-full"
						placeholder="Brand, flavour, backup choice..."
						disabled={isBusy}
					/>
				</label>

				{isEditing ? (
					<div className="grid grid-cols-2 gap-2">
						<button
							type="button"
							className="btn btn-outline h-auto px-4 py-2"
							onClick={onCancelEdit}
							disabled={isBusy}
						>
							Cancel
							<CancelIcon size="size-4" />
						</button>

						<button
							type="submit"
							className="btn btn-primary h-auto px-4 py-2"
							disabled={isBusy}
						>
							{isSaving ? copy.editSavingLabel : copy.editSubmitLabel}
							<SaveIcon size="size-4" className="-translate-y-px" />
						</button>
					</div>
				) : (
					<button
						type="submit"
						className="btn btn-primary h-auto w-full px-4 py-2"
						disabled={isBusy}
					>
						{isSaving ? copy.addSavingLabel : copy.addSubmitLabel}
						<PlusIcon size="size-4" />
					</button>
				)}
			</form>

			{isEditing && onDeleteItem && (
				<div className="border-t border-base-300 pt-5">
					<p className="mb-2 text-sm font-bold text-error">
						{copy.deleteTitle}
					</p>

					<button
						type="button"
						className="btn btn-error btn-outline h-auto w-full px-4 py-2"
						onClick={handleDelete}
						disabled={isBusy}
					>
						{isDeleting ? copy.deletingLabel : `Delete ${item.name}`}
						<TrashIcon size="size-4" />
					</button>
				</div>
			)}
		</>
	);
}
