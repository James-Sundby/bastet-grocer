"use client";

import { useState } from "react";

import { useSupabaseClient } from "@/app/_hooks/useSupabaseClient";
import { useActiveGroceryList } from "@/app/_hooks/useActiveGroceryList";
import { useQuickAddPage } from "@/app/_hooks/useQuickAddPage";
import { useItemCategoryPreferences } from "@/app/_hooks/useItemCategoryPreferences";

import GroceryPageShell from "@/app/components/templates/groceryPageShell";
import PageLoadAlert from "@/app/components/molecules/pageLoadAlert";
import QuickAddHeader from "@/app/components/organisms/quickAddHeader";
import ItemList from "@/app/components/organisms/itemList";
import NewItemForm from "@/app/components/molecules/newItemForm";
import Toast from "@/app/components/atoms/toast";
import { GroceryPageSkeleton } from "@/app/components/atoms/skeletons";

export default function QuickAddClient({
    orgId,
    userId,
    requestedListId,
    initialLists,
    initialActiveListId,
    initialQuickAdds,
    activeListTitle,
}) {
    const supabase = useSupabaseClient();

    const [toasts, setToasts] = useState([]);

    const {
        isReady: isListReady,
        hasError: hasListError,
        errorMessage: listErrorMessage,
        activeListId,
        activeList,
    } = useActiveGroceryList({
        supabase,
        orgId,
        requestedListId,
        initialLists,
        initialActiveListId,
        listPath: "/quick-add",
        setToasts,
    });

    const {
        suggestCategory,
        rememberCategory:
        rememberCategoryPreference,
    } = useItemCategoryPreferences({
        supabase,
        orgId,
    });

    const quickAdds = useQuickAddPage({
        supabase,
        orgId,
        userId,
        activeListId,
        initialUserId: userId,
        initialItems: initialQuickAdds,
        setToasts,
        rememberCategoryPreference,
        activeListTitle,
    });

    if (hasListError || quickAdds.hasError) {
        return (
            <>
                <GroceryPageShell>
                    <PageLoadAlert
                        title="Couldn’t load your quick adds"
                        message={
                            listErrorMessage ??
                            quickAdds.errorMessage ??
                            "Refresh the page and try again."
                        }
                    />
                </GroceryPageShell>

                <Toast toasts={toasts} />
            </>
        );
    }

    if (!isListReady || !quickAdds.isReady) {
        return <GroceryPageSkeleton />;
    }

    return (
        <>
            <GroceryPageShell>
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
                    onDelete={
                        quickAdds.handleRemoveItem
                    }
                    onAdd={
                        quickAdds.handleAddToShoppingList
                    }
                    isQuickAdd
                    onIncrement={
                        quickAdds.handleChangeQuantity
                    }
                    onDecrement={
                        quickAdds.handleChangeQuantity
                    }
                    onUpdate={
                        quickAdds.handleUpdateQuickAddItem
                    }
                />
            </GroceryPageShell>

            <Toast toasts={toasts} />
        </>
    );
}