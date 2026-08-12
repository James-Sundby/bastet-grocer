"use client";

import QuickAddHeader from "@/app/components/organisms/quickAddHeader";
import NewItemForm from "@/app/components/molecules/newItemForm";
import ItemList from "@/app/components/organisms/itemList";

export default function MobileQuickAddView({
    activeList,
    activeListId,
    quickAdds,
    suggestCategory,
    rememberCategoryPreference,
}) {
    return (
        <>
            <QuickAddHeader
                activeListId={activeListId}
                activeList={activeList}
            />

            <NewItemForm
                onAddItem={quickAdds.handleAddItem}
                isQuickAdd
                suggestCategory={suggestCategory}
                rememberCategoryPreference={
                    rememberCategoryPreference
                }
            />

            <ItemList
                items={quickAdds.items}
                onDelete={quickAdds.handleRemoveItem}
                onAdd={quickAdds.handleAddToShoppingList}
                isQuickAdd
                onIncrement={quickAdds.handleChangeQuantity}
                onDecrement={quickAdds.handleChangeQuantity}
                onUpdate={quickAdds.handleUpdateQuickAddItem}
            />
        </>
    );
}