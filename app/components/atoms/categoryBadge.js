import { getCategory } from "@/app/constants/categories";

export default function CategoryBadge({ category }) {
    const categoryInfo = getCategory(category);

    return (
        <span
            className={`badge badge-outline h-auto font-medium whitespace-normal ${categoryInfo.badgeClass}`}
        >
            {categoryInfo.label}
        </span>
    );
}