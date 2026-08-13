"use client";

import NewItemForm from "@/app/components/molecules/newItemForm";
import ItemList from "@/app/components/organisms/itemList";
import QuickAddHeader from "@/app/components/organisms/quickAddHeader";

export default function MobileQuickAddView({
	activeList,
	activeListId,
	quickAdds,
	suggestCategory,
	rememberCategoryPreference,
}) {
	return (
		<>
			<QuickAddHeader activeListId={activeListId} activeList={activeList} />

			<NewItemForm
				onAddItem={quickAdds.handleAddItem}
				isQuickAdd
				suggestCategory={suggestCategory}
				rememberCategoryPreference={rememberCategoryPreference}
			/>

			<ItemList
				items={quickAdds.items}
				variant="quick-add"
				onDelete={quickAdds.handleRemoveItem}
				onAdd={quickAdds.handleAddToShoppingList}
				onIncrement={quickAdds.handleChangeQuantity}
				onDecrement={quickAdds.handleChangeQuantity}
				onUpdate={quickAdds.handleUpdateQuickAddItem}
			/>
		</>
	);
}
