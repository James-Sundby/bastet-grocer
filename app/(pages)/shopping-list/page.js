import { Suspense } from "react";

import ShoppingListData from "@/app/_features/shopping-list/shoppingListData.js";
import { GroceryPageSkeleton } from "@/app/components/atoms/skeletons";

export default function ShoppingListPage({ searchParams }) {
  return (
    <Suspense fallback={<GroceryPageSkeleton />}>
      <ShoppingListData searchParams={searchParams} />
    </Suspense>
  );
}