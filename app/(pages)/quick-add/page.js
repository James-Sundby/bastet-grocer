"use client";

import { Suspense, useState } from "react";
import { RedirectToSignIn, useAuth } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

import { useSupabaseClient } from "@/app/_utils/useSupabaseClient";
import { useActiveGroceryList } from "@/app/_hooks/useActiveGroceryList";
import { useQuickAddPage } from "@/app/_hooks/useQuickAddPage";

import GroceryPageShell from "@/app/components/templates/groceryPageShell";
import HouseholdRequired from "@/app/components/molecules/householdRequired";
import PageLoadAlert from "@/app/components/molecules/pageLoadAlert";
import QuickAddHeader from "@/app/components/organisms/quickAddHeader";

import ItemList from "@/app/components/organisms/itemList";
import NewItemForm from "@/app/components/molecules/newItemForm";
import Toast from "@/app/components/atoms/toast";
import { GroceryPageSkeleton } from "@/app/components/atoms/skeletons";

export default function QuickAddPage() {
    return (
        <Suspense fallback={<GroceryPageSkeleton />}>
            <QuickAddPageContent />
        </Suspense>
    );
}

function QuickAddPageContent() {
    const supabase = useSupabaseClient();
    const searchParams = useSearchParams();
    const { isLoaded, isSignedIn, orgId, userId } = useAuth();

    const requestedListId = searchParams.get("list");

    const [toasts, setToasts] = useState([]);

    const {
        isReady: isListReady,
        hasError: hasListError,
        errorMessage: listErrorMessage,
        activeListId,
    } = useActiveGroceryList({
        supabase,
        isLoaded,
        isSignedIn,
        orgId,
        requestedListId,
    });

    const quickAdds = useQuickAddPage({
        supabase,
        orgId,
        userId,
        isLoaded,
        isSignedIn,
        activeListId,
        setToasts,
    });

    if (!isLoaded) {
        return <GroceryPageSkeleton />;
    }

    if (!isSignedIn) {
        return <RedirectToSignIn />;
    }

    if (!orgId) {
        return (
            <HouseholdRequired
                toasts={toasts}
                afterCreateOrganizationUrl="/quick-add"
                afterSelectOrganizationUrl="/quick-add"
            />
        );
    }

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
        <GroceryPageShell>
            <QuickAddHeader activeListId={activeListId} />

            <NewItemForm onAddItem={quickAdds.handleAddItem} isQuickAdd />

            <ItemList
                items={quickAdds.items}
                onDelete={quickAdds.handleRemoveItem}
                onAdd={quickAdds.handleAddToShoppingList}
                isQuickAdd
                onIncrement={quickAdds.handleIncrementDecrement}
                onDecrement={quickAdds.handleIncrementDecrement}
                onUpdate={quickAdds.handleUpdateQuickAddItem}
            />

            <Toast toasts={toasts} />
        </GroceryPageShell>
    );
}