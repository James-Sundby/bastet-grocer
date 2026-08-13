// app/constants/categories.js

export const CATEGORIES = [
	{
		value: "bakery",
		label: "Bakery",
		badgeClass: "border-amber-300 bg-amber-100 text-amber-900",
	},
	{
		value: "bath and body",
		label: "Bath and Body",
		badgeClass: "border-pink-300 bg-pink-100 text-pink-900",
	},
	{
		value: "beverages",
		label: "Beverages",
		badgeClass: "border-sky-300 bg-sky-100 text-sky-900",
	},
	{
		value: "canned goods",
		label: "Canned Goods",
		badgeClass: "border-slate-300 bg-slate-100 text-slate-800",
	},
	{
		value: "dairy",
		label: "Dairy",
		badgeClass: "border-blue-300 bg-blue-100 text-blue-900",
	},
	{
		value: "deli",
		label: "Deli",
		badgeClass: "border-rose-300 bg-rose-100 text-rose-900",
	},
	{
		value: "dry goods",
		label: "Dry Goods",
		badgeClass: "border-orange-300 bg-orange-100 text-orange-900",
	},
	{
		value: "frozen foods",
		label: "Frozen Foods",
		badgeClass: "border-cyan-300 bg-cyan-100 text-cyan-900",
	},
	{
		value: "household",
		label: "Household",
		badgeClass: "border-violet-300 bg-violet-100 text-violet-900",
	},
	{
		value: "meat",
		label: "Meat",
		badgeClass: "border-red-300 bg-red-100 text-red-900",
	},
	{
		value: "pharmacy",
		label: "Pharmacy",
		badgeClass: "border-fuchsia-300 bg-fuchsia-100 text-fuchsia-900",
	},
	{
		value: "produce",
		label: "Produce",
		badgeClass: "border-emerald-300 bg-emerald-100 text-emerald-900",
	},
	{
		value: "snacks",
		label: "Snacks",
		badgeClass: "border-yellow-300 bg-yellow-100 text-yellow-900",
	},
	{
		value: "other",
		label: "Other",
		badgeClass: "border-base-300 bg-base-200 text-base-content",
	},
];

export const CATEGORY_MAP = new Map(
	CATEGORIES.map((category) => [category.value, category]),
);

export function getCategory(categoryValue) {
	return CATEGORY_MAP.get(categoryValue) ?? CATEGORY_MAP.get("other");
}
