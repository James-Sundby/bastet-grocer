"use client";

import { useMemo, useState } from "react";
import CategoryBadge from "@/app/components/atoms/categoryBadge";
import {
	CloseIcon,
	EditIcon,
	MinusIcon,
	PlusIcon,
	SortAscIcon,
	SortDescIcon,
	SortIcon,
} from "@/app/components/atoms/icons";
import { CATEGORIES } from "@/app/constants/categories";

const categoryOrder = new Map(
	CATEGORIES.map((category, index) => [category.value, index]),
);

function compareText(a = "", b = "") {
	return a.localeCompare(b, undefined, {
		sensitivity: "base",
	});
}

function SortButton({ children, sortKey, currentSort, onSort }) {
	const isActive = currentSort.key === sortKey;
	const indicator = isActive ? (
		currentSort.direction === "asc" ? (
			<SortAscIcon size="size-3" />
		) : (
			<SortDescIcon size="size-3" />
		)
	) : (
		<SortIcon size="size-3" />
	);

	return (
		<button
			type="button"
			className={`inline-flex items-center gap-1 font-bold transition-colors hover:text-primary ${
				isActive ? "text-primary" : ""
			}`}
			onClick={() => onSort(sortKey)}
		>
			<span>{children}</span>

			<span
				className={`inline-block w-4 text-center ${
					isActive ? "text-primary" : "text-base-content/40"
				}`}
				aria-hidden="true"
			>
				{indicator}
			</span>
		</button>
	);
}

function QuantityControl({ item, onChange }) {
	return (
		<div className="flex items-center justify-center gap-1">
			<button
				type="button"
				className="btn btn-ghost btn-sm btn-square"
				onClick={() =>
					onChange(
						{
							id: item.id,
							name: item.name,
						},
						-1,
					)
				}
				disabled={item.quantity <= 1}
				aria-label={`Decrease ${item.name} quantity`}
			>
				<MinusIcon size="size-3" />
			</button>

			<span className="min-w-8 text-center font-semibold">{item.quantity}</span>

			<button
				type="button"
				className="btn btn-ghost btn-sm btn-square"
				onClick={() =>
					onChange(
						{
							id: item.id,
							name: item.name,
						},
						1,
					)
				}
				disabled={item.quantity >= 99}
				aria-label={`Increase ${item.name} quantity`}
			>
				<PlusIcon size="size-3" />
			</button>
		</div>
	);
}

export default function ItemTable({
	title,
	description,
	items,
	selectedItemId,
	onSelectItem,
	onChangeQuantity,

	statusColumn = null,
	actionColumn = null,
	headerActions = null,

	emptyTitle = "No items yet",
	emptyMessage = "Add your first item using the panel on the left.",

	defaultSort = {
		key: "category",
		direction: "asc",
	},
}) {
	const [sort, setSort] = useState(defaultSort);

	const sortedItems = useMemo(() => {
		const nextItems = [...items];

		nextItems.sort((a, b) => {
			let comparison = 0;

			switch (sort.key) {
				case "status":
					comparison = statusColumn
						? Number(statusColumn.getChecked(a)) -
							Number(statusColumn.getChecked(b))
						: 0;
					break;

				case "name":
					comparison = compareText(a.name, b.name);
					break;

				case "category":
					comparison =
						(categoryOrder.get(a.category) ?? 999) -
						(categoryOrder.get(b.category) ?? 999);
					break;

				case "quantity":
					comparison = a.quantity - b.quantity;
					break;

				default:
					comparison = 0;
			}

			if (comparison === 0 && sort.key !== "name") {
				comparison = compareText(a.name, b.name);
			}

			return sort.direction === "asc" ? comparison : -comparison;
		});

		return nextItems;
	}, [items, sort, statusColumn]);

	const handleSort = (key) => {
		setSort((current) => {
			if (current.key === key) {
				return {
					key,
					direction: current.direction === "asc" ? "desc" : "asc",
				};
			}

			return {
				key,
				direction: "asc",
			};
		});
	};

	const ariaSortFor = (key) => {
		if (sort.key !== key) {
			return "none";
		}

		return sort.direction === "asc" ? "ascending" : "descending";
	};

	return (
		<section className="flex min-h-0 min-w-0 flex-col bg-base-100">
			<header className="flex shrink-0 items-center justify-between gap-6 border-b border-base-300 px-6 py-5">
				<div className="min-w-0">
					<h1 className="truncate text-2xl font-bold">{title}</h1>

					{description && (
						<div className="mt-1 text-sm text-base-content/60">
							{description}
						</div>
					)}
				</div>

				{headerActions && <div className="shrink-0">{headerActions}</div>}
			</header>

			{sortedItems.length === 0 ? (
				<div className="flex flex-1 items-center justify-center p-12 text-center text-base-content/60">
					<div>
						<p className="font-semibold">{emptyTitle}</p>

						<p className="mt-1 text-sm">{emptyMessage}</p>
					</div>
				</div>
			) : (
				<div className="min-h-0 flex-1 overflow-auto bg-base-100">
					<table className="table table-zebra w-full">
						<thead>
							<tr className="border-b border-base-300">
								{statusColumn && (
									<th
										className="sticky top-0 z-10 w-24 bg-base-100"
										aria-sort={ariaSortFor("status")}
									>
										<SortButton
											sortKey="status"
											currentSort={sort}
											onSort={handleSort}
										>
											{statusColumn.label ?? "Status"}
										</SortButton>
									</th>
								)}

								<th
									className="sticky top-0 z-10 bg-base-100"
									aria-sort={ariaSortFor("name")}
								>
									<SortButton
										sortKey="name"
										currentSort={sort}
										onSort={handleSort}
									>
										Item
									</SortButton>
								</th>

								<th
									className="sticky top-0 z-10 w-40 bg-base-100 xl:w-44"
									aria-sort={ariaSortFor("category")}
								>
									<SortButton
										sortKey="category"
										currentSort={sort}
										onSort={handleSort}
									>
										Category
									</SortButton>
								</th>

								<th
									className="sticky top-0 z-10 w-32 bg-base-100 text-center xl:w-40"
									aria-sort={ariaSortFor("quantity")}
								>
									<SortButton
										sortKey="quantity"
										currentSort={sort}
										onSort={handleSort}
									>
										Qty
									</SortButton>
								</th>

								{actionColumn && (
									<th
										className={`sticky top-0 z-10 bg-base-100 text-center ${actionColumn.widthClass ?? ""}`}
									>
										{actionColumn.label}
									</th>
								)}

								<th className="sticky top-0 z-10 w-24 min-w-24 bg-base-100">
									<span className="sr-only">Edit</span>
								</th>
							</tr>
						</thead>

						<tbody className="[&>tr:last-child>td]:border-b [&>tr:last-child>td]:border-base-300">
							{sortedItems.map((item) => {
								const isSelected = item.id === selectedItemId;

								const isChecked = statusColumn
									? statusColumn.getChecked(item)
									: false;

								return (
									<tr
										key={item.id}
										className={isChecked ? "text-base-content/50" : ""}
									>
										{statusColumn && (
											<td>
												<input
													type="checkbox"
													className="checkbox checkbox-primary checkbox-sm"
													checked={isChecked}
													onChange={(event) =>
														statusColumn.onChange(item.id, event.target.checked)
													}
													aria-label={
														statusColumn.getAriaLabel?.(item) ??
														`Toggle ${item.name}`
													}
												/>
											</td>
										)}

										<td>
											<button
												type="button"
												className="block w-full text-left"
												onClick={() => onSelectItem(item.id)}
											>
												<span
													className={`block font-semibold ${
														isChecked ? "line-through" : ""
													} ${isSelected ? "text-primary" : ""}`}
												>
													{item.name}
												</span>

												{item.note && (
													<span className="mt-1 block max-w-xl text-sm text-base-content/60">
														{item.note}
													</span>
												)}
											</button>
										</td>

										<td>
											<CategoryBadge category={item.category} />
										</td>

										<td>
											<QuantityControl
												item={item}
												onChange={onChangeQuantity}
											/>
										</td>

										{actionColumn && (
											<td className={actionColumn.widthClass ?? ""}>
												{actionColumn.render(item)}
											</td>
										)}

										<td className="w-28 min-w-28">
											<button
												type="button"
												className={`btn btn-ghost btn-sm w-full ${
													isSelected ? "text-primary" : ""
												}`}
												onClick={() => onSelectItem(item.id)}
												aria-label={
													isSelected
														? `Close editor for ${item.name}`
														: `Edit ${item.name}`
												}
											>
												{isSelected ? (
													<>
														<CloseIcon size="size-3" />
														Close
													</>
												) : (
													<>
														<EditIcon size="size-3" />
														Edit
													</>
												)}
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
		</section>
	);
}
