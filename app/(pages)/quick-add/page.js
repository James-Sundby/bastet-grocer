import { Suspense } from "react";

import QuickAddData from "@/app/_features/quick-add/quickAddData";
import { GroceryPageSkeleton } from "@/app/components/atoms/skeletons";

export default function QuickAddPage({ searchParams }) {
	return (
		<Suspense fallback={<GroceryPageSkeleton />}>
			<QuickAddData searchParams={searchParams} />
		</Suspense>
	);
}
