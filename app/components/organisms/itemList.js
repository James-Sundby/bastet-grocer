"use client";

import { useId, useMemo, useState } from "react";

import ItemCard from "../molecules/itemCard.js";

export default function ItemList({
	items,
	onDelete,
	onStatusChange,
	onAdd,
	onIncrement,
	onDecrement,
	onUpdate,
	variant = "list",
}) {
	const [sortBy, setSortBy] = useState("category");
	const sortGroupId = useId();

	const isQuickAdd = variant === "quick-add";

	const itemsData = useMemo(() => {
		return [...items].sort((a, b) => {
			if (!isQuickAdd && Boolean(a.completed) !== Boolean(b.completed)) {
				return Number(a.completed) - Number(b.completed);
			}

			if (sortBy === "name") {
				return a.name.localeCompare(b.name, undefined, {
					sensitivity: "base",
				});
			}

			if (sortBy === "category") {
				const categoryComparison = a.category.localeCompare(
					b.category,
					undefined,
					{ sensitivity: "base" },
				);

				if (categoryComparison !== 0) return categoryComparison;

				return a.name.localeCompare(b.name, undefined, {
					sensitivity: "base",
				});
			}

			return 0;
		});
	}, [items, sortBy, isQuickAdd]);

	const emptyTitle = isQuickAdd ? "No quick adds yet" : "No items yet";
	const emptyMessage = isQuickAdd
		? "Add a few common groceries to speed up future lists."
		: "Add your first grocery item above.";

	return (
		<section className="w-full space-y-4">
			<div
				role="tablist"
				className="tabs tabs-box flex w-full flex-nowrap rounded-md bg-base-300 p-1"
			>
				<input
					type="radio"
					name={`${sortGroupId}-sort-options`}
					role="tab"
					className="tab h-auto w-1/2 px-4 py-2 font-bold checked:bg-primary checked:text-primary-content"
					aria-label="Sort by Category"
					checked={sortBy === "category"}
					onChange={() => setSortBy("category")}
				/>

				<input
					type="radio"
					name={`${sortGroupId}-sort-options`}
					role="tab"
					className="tab h-auto w-1/2 px-4 py-2 font-bold checked:bg-primary checked:text-primary-content"
					aria-label="Sort by Name"
					checked={sortBy === "name"}
					onChange={() => setSortBy("name")}
				/>
			</div>

			{itemsData.length === 0 ? (
				<div className="rounded-box border border-dashed border-base-300 bg-base-100 p-6 text-center text-base-content/70">
					<p className="font-semibold">{emptyTitle}</p>
					<p className="text-sm">{emptyMessage}</p>
				</div>
			) : (
				<ul className="flex flex-col gap-3">
					{itemsData.map((item) => (
						<ItemCard
							key={item.id}
							{...item}
							note={item.note ?? ""}
							variant={variant}
							onDelete={onDelete}
							onStatusChange={onStatusChange}
							onAdd={onAdd}
							onIncrement={onIncrement}
							onDecrement={onDecrement}
							onUpdate={onUpdate}
						/>
					))}
				</ul>
			)}
		</section>
	);
}
