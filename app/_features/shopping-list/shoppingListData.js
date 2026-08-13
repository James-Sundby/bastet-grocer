import { auth } from "@clerk/nextjs/server";

import { createServerSupabaseClient } from "@/app/_lib/supabaseServer";
import { getShoppingList } from "@/app/_services/item-service";
import { getLists } from "@/app/_services/list-service";
import HouseholdRequired from "@/app/components/molecules/householdRequired";
import PageLoadAlert from "@/app/components/molecules/pageLoadAlert";
import GroceryPageShell from "@/app/components/templates/groceryPageShell";

import ShoppingListClient from "./shoppingListClient.js";

function getRequestedListId(value) {
	if (Array.isArray(value)) {
		return value[0] ?? null;
	}

	return value ?? null;
}

export default async function ShoppingListData({ searchParams }) {
	const { isAuthenticated, orgId, getToken, redirectToSignIn } = await auth();

	if (!isAuthenticated) {
		return redirectToSignIn();
	}

	const resolvedSearchParams = await searchParams;

	const requestedListId = getRequestedListId(resolvedSearchParams.list);

	if (!orgId) {
		return (
			<HouseholdRequired
				toasts={[]}
				afterCreateOrganizationUrl="/shopping-list"
				afterSelectOrganizationUrl="/shopping-list"
			/>
		);
	}

	const token = await getToken();

	if (!token) {
		return redirectToSignIn();
	}

	const supabase = createServerSupabaseClient(token);

	try {
		const lists = await getLists(supabase);

		const requestedList = lists.find((list) => list.id === requestedListId);

		const activeList = requestedList ?? lists[0] ?? null;

		const items = activeList
			? await getShoppingList(supabase, activeList.id)
			: [];

		return (
			<ShoppingListClient
				key={orgId}
				orgId={orgId}
				requestedListId={requestedListId}
				initialLists={lists}
				initialActiveListId={activeList?.id ?? null}
				initialItems={items}
			/>
		);
	} catch {
		return (
			<GroceryPageShell>
				<PageLoadAlert
					title="Couldn't load your shopping list"
					message="Refresh the page and try again."
				/>
			</GroceryPageShell>
		);
	}
}
