import { auth } from "@clerk/nextjs/server";

import { createServerSupabaseClient } from "@/app/_lib/supabaseServer";
import { getLists } from "@/app/_services/list-service";
import { getQuickAddItems } from "@/app/_services/quick-add-service";

import GroceryPageShell from "@/app/components/templates/groceryPageShell";
import HouseholdRequired from "@/app/components/molecules/householdRequired";
import PageLoadAlert from "@/app/components/molecules/pageLoadAlert";

import QuickAddClient from "./quickAddClient";

function getRequestedListId(value) {
    if (Array.isArray(value)) {
        return value[0] ?? null;
    }

    return value ?? null;
}

export default async function QuickAddData({
    searchParams,
}) {
    const {
        isAuthenticated,
        orgId,
        userId,
        getToken,
        redirectToSignIn,
    } = await auth();

    if (!isAuthenticated || !userId) {
        return redirectToSignIn();
    }

    const resolvedSearchParams = await searchParams;

    const requestedListId = getRequestedListId(
        resolvedSearchParams.list
    );

    if (!orgId) {
        return (
            <HouseholdRequired
                toasts={[]}
                afterCreateOrganizationUrl="/quick-add"
                afterSelectOrganizationUrl="/quick-add"
            />
        );
    }

    const token = await getToken();

    if (!token) {
        return redirectToSignIn();
    }

    const supabase =
        createServerSupabaseClient(token);

    try {
        const [lists, quickAdds] = await Promise.all([
            getLists(supabase),
            getQuickAddItems(supabase),
        ]);

        const requestedList = lists.find(
            (list) => list.id === requestedListId
        );

        const activeList =
            requestedList ??
            lists[0] ??
            null;

        return (
            <QuickAddClient
                orgId={orgId}
                userId={userId}
                requestedListId={requestedListId}
                initialLists={lists}
                initialActiveListId={
                    activeList?.id ?? null
                }
                initialQuickAdds={quickAdds}
            />
        );
    } catch {
        return (
            <GroceryPageShell>
                <PageLoadAlert
                    title="Couldn't load your quick adds"
                    message="Refresh the page and try again."
                />
            </GroceryPageShell>
        );
    }
}