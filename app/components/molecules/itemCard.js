"use client";

import { useState } from "react";

import { CATEGORIES } from "@/app/constants/categories";
import CategoryBadge from "../atoms/categoryBadge";
import {
	AddtoCartIcon,
	CancelIcon,
	CloseIcon,
	EditIcon,
	SaveIcon,
	SettingsIcon,
	TrashIcon,
} from "../atoms/icons";

export default function ItemCard({
	id,
	name,
	quantity,
	category,
	note = "",
	completed = false,
	onDelete,
	onStatusChange,
	onAdd,
	onIncrement,
	onDecrement,
	onUpdate,
	variant = "list",
}) {
	const editableItem = { name, quantity, category, note };
	const item = { id, ...editableItem };
	const itemRef = { id, name };
	const actionsId = `item-actions-${id}`;

	const [actionMode, setActionMode] = useState("closed");
	const [isSaving, setIsSaving] = useState(false);
	const [draftItem, setDraftItem] = useState(editableItem);

	const isList = variant === "list";
	const isQuickAdd = variant === "quick-add";
	const isShopping = variant === "shopping";

	const isActionsOpen = actionMode !== "closed";
	const isEditMode = actionMode === "edit";

	const resetDraft = () => {
		setDraftItem(editableItem);
	};

	const updateDraft = (field, value) => {
		setDraftItem((current) => ({
			...current,
			[field]: value,
		}));
	};

	const startEditMode = () => {
		resetDraft();
		setActionMode("edit");
	};

	const closeActions = () => {
		resetDraft();
		setActionMode("closed");
	};

	const handleCheckboxChange = (event) => {
		event.stopPropagation();
		onStatusChange?.(id, event.target.checked);
	};

	const handleCardClick = () => {
		onStatusChange?.(id, !completed);
	};

	const handleCardKeyDown = (event) => {
		if (event.key !== "Enter" && event.key !== " ") return;

		event.preventDefault();
		onStatusChange?.(id, !completed);
	};

	const handleToggleActions = (event) => {
		event.stopPropagation();

		if (isActionsOpen) {
			closeActions();
			return;
		}

		setActionMode("actions");
	};

	const handleAdd = (event) => {
		event.stopPropagation();
		onAdd?.(item);
	};

	const handleIncrement = (event) => {
		event.stopPropagation();
		onIncrement?.(itemRef, 1);
	};

	const handleDecrement = (event) => {
		event.stopPropagation();
		onDecrement?.(itemRef, -1);
	};

	const handleDelete = (event) => {
		event.stopPropagation();
		onDelete?.(itemRef);
	};

	const handleSubmitEdit = async (event) => {
		event.preventDefault();
		event.stopPropagation();

		const trimmedName = draftItem.name.trim();
		const safeQuantity = Number(draftItem.quantity);

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
				...draftItem,
				name: trimmedName,
				quantity: safeQuantity,
				note: draftItem.note.trim(),
			});

			if (wasUpdated !== false) {
				setActionMode("closed");
			}
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<li>
			<article
				onClick={isShopping ? handleCardClick : undefined}
				onKeyDown={isShopping ? handleCardKeyDown : undefined}
				tabIndex={isShopping ? 0 : undefined}
				role={isShopping ? "button" : undefined}
				aria-label={
					isShopping
						? `${name}, quantity ${quantity}, ${
								completed ? "in cart" : "not in cart"
							}`
						: undefined
				}
				className={`card card-sm border border-base-300 bg-base-100 shadow-sm transition ${
					completed ? "opacity-60" : ""
				} ${isShopping ? "cursor-pointer active:bg-base-200" : ""}`}
			>
				<div className="card-body">
					{isShopping ? (
						<div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-2">
							<div className="min-w-0">
								<h2
									className={`wrap-break-word text-3xl font-bold ${
										completed ? "line-through" : ""
									}`}
								>
									{name}
								</h2>

								<span className="badge badge-primary badge-lg mt-2 h-auto px-3 py-1">
									Need <span className="font-bold">{quantity}</span>
								</span>
							</div>

							<span className="badge badge-neutral badge-outline h-fit max-w-32 capitalize">
								{category}
							</span>

							{note && (
								<p className="col-span-2 text-sm font-medium text-base-content/70">
									{note}
								</p>
							)}
						</div>
					) : (
						<div className="flex items-start justify-between gap-3">
							<div className="min-w-0 flex-1">
								<div className="flex items-start gap-3">
									{isList && (
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
									)}

									<div className="min-w-0">
										<h2
											className={`wrap-break-word text-2xl font-bold ${
												completed ? "line-through" : ""
											}`}
										>
											{name}
										</h2>

										<div className="mt-2 flex flex-wrap gap-2">
											<span className="badge badge-neutral badge-outline">
												Qty: <span className="font-bold">{quantity}</span>
											</span>
											<CategoryBadge category={item.category} />
										</div>

										{note && (
											<p className="mt-2 text-sm text-base-content/70">
												{note}
											</p>
										)}
									</div>
								</div>
							</div>

							<div className="flex shrink-0 items-center gap-2">
								{isQuickAdd && (
									<button
										type="button"
										aria-label={`Add ${name} to shopping list`}
										title={`Add ${name} to shopping list`}
										className="btn btn-primary btn-sm h-auto px-4 py-2"
										onClick={handleAdd}
									>
										<AddtoCartIcon size="size-4" />
										Add to Cart
									</button>
								)}

								<button
									type="button"
									aria-expanded={isActionsOpen}
									aria-controls={actionsId}
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
									className="btn btn-ghost btn-sm h-auto px-2 py-2"
								>
									{isActionsOpen ? (
										<CloseIcon size="size-4" />
									) : (
										<SettingsIcon size="size-4" />
									)}
								</button>
							</div>
						</div>
					)}
				</div>

				{isActionsOpen && !isShopping && (
					<div
						id={actionsId}
						className="border-t border-base-300 bg-base-200/40 px-4 pt-3 pb-4"
					>
						{isEditMode ? (
							<ItemEditForm
								draftItem={draftItem}
								isSaving={isSaving}
								onChange={updateDraft}
								onCancel={closeActions}
								onSubmit={handleSubmitEdit}
							/>
						) : (
							<div className="flex flex-wrap items-center gap-2">
								{onUpdate && (
									<button
										type="button"
										className="btn btn-outline btn-sm h-auto px-4 py-2"
										onClick={startEditMode}
									>
										<EditIcon size="size-4" />
										Edit
									</button>
								)}

								{onIncrement && (
									<button
										type="button"
										aria-label={`Increase quantity of ${name}`}
										className="btn btn-primary btn-sm h-auto px-4 py-2"
										onClick={handleIncrement}
									>
										+ 1
									</button>
								)}

								{onDecrement && quantity > 1 && (
									<button
										type="button"
										aria-label={`Decrease quantity of ${name}`}
										className="btn btn-accent btn-sm h-auto px-4 py-2"
										onClick={handleDecrement}
									>
										- 1
									</button>
								)}

								{onDelete && (
									<button
										type="button"
										aria-label={`Delete ${name}`}
										className="btn btn-error btn-sm ml-auto h-auto px-4 py-2"
										onClick={handleDelete}
									>
										<TrashIcon size="size-4" />
										Delete
									</button>
								)}
							</div>
						)}
					</div>
				)}
			</article>
		</li>
	);
}

function ItemEditForm({ draftItem, isSaving, onChange, onCancel, onSubmit }) {
	return (
		<form className="flex flex-col gap-4" onSubmit={onSubmit}>
			<label className="form-control w-full">
				<div className="label">
					<span className="label-text font-bold">Item name</span>
				</div>

				<input
					type="text"
					required
					maxLength={100}
					value={draftItem.name}
					onChange={(event) => onChange("name", event.target.value)}
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
						value={draftItem.quantity}
						onChange={(event) => {
							const value = event.target.valueAsNumber;
							onChange("quantity", Number.isNaN(value) ? "" : value);
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
						value={draftItem.category}
						onChange={(event) => onChange("category", event.target.value)}
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
					value={draftItem.note}
					onChange={(event) => onChange("note", event.target.value)}
					maxLength={120}
					rows={2}
					className="textarea textarea-bordered w-full"
					placeholder="Brand, flavour, backup choice..."
				/>
			</label>

			<div className="grid grid-cols-2 gap-2">
				<button
					type="button"
					className="btn btn-outline btn-sm h-auto px-4 py-2"
					onClick={onCancel}
					disabled={isSaving}
				>
					Cancel
					<CancelIcon size="size-4" />
				</button>

				<button
					type="submit"
					className="btn btn-primary btn-sm h-auto px-4 py-2"
					disabled={isSaving}
				>
					{isSaving ? "Saving..." : "Save"}
					<SaveIcon size="size-4" />
				</button>
			</div>
		</form>
	);
}
