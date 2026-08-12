"use client";

import { useState } from "react";

import { useSupabaseClient } from "@/app/_hooks/useSupabaseClient";
import { useActiveGroceryList } from "@/app/_hooks/useActiveGroceryList";
import { useQuickAddPage } from "@/app/_hooks/useQuickAddPage";
import { useItemCategoryPreferences } from "@/app/_hooks/useItemCategoryPreferences";

import GroceryPageShell from "@/app/components/templates/groceryPageShell";
import PageLoadAlert from "@/app/components/molecules/pageLoadAlert";
import Toast from "@/app/components/atoms/toast";
import { GroceryPageSkeleton } from "@/app/components/atoms/skeletons";

import MobileQuickAddView from "../../components/views/mobileQuickAddView";
import DesktopQuickAddView from "../../components/views/desktopQuickAddView";

export default function QuickAddClient({
    orgId,
    userId,
    requestedListId,
    initialLists,
    initialActiveListId,
    initialQuickAdds,
}) {
    const supabase =
        useSupabaseClient();

    const [toasts, setToasts] =
        useState([]);

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

        // Use the live active list rather than
        // the initial server list title.
        activeListTitle:
            activeList?.title ?? null,

        initialUserId: userId,
        initialItems: initialQuickAdds,
        setToasts,
        rememberCategoryPreference,
    });

    if (
        hasListError ||
        quickAdds.hasError
    ) {
        return (
            <>
                <GroceryPageShell>
                    <PageLoadAlert
                        title="Couldn't load your quick adds"
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

    if (
        !isListReady ||
        !quickAdds.isReady
    ) {
        return (
            <GroceryPageSkeleton />
        );
    }

    return (
        <>
            <GroceryPageShell
                width="shopping"
                desktopMode="workspace"
            >
                <div className="w-full lg:hidden">
                    <MobileQuickAddView
                        activeList={
                            activeList
                        }
                        activeListId={
                            activeListId
                        }
                        quickAdds={
                            quickAdds
                        }
                        suggestCategory={
                            suggestCategory
                        }
                        rememberCategoryPreference={
                            rememberCategoryPreference
                        }
                    />
                </div>

                <div className="hidden min-h-0 w-full flex-1 lg:block">
                    <DesktopQuickAddView
                        activeList={
                            activeList
                        }
                        activeListId={
                            activeListId
                        }
                        quickAdds={
                            quickAdds
                        }
                        suggestCategory={
                            suggestCategory
                        }
                        rememberCategoryPreference={
                            rememberCategoryPreference
                        }
                    />
                </div>
            </GroceryPageShell>

            <Toast toasts={toasts} />
        </>
    );
}