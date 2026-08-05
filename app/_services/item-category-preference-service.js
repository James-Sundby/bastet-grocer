import {
    isValidItemCategory,
    normalizeItemNameKey,
} from "@/app/_utils/itemCategory";

function mapPreferenceRow(row) {
    return {
        nameKey: row.name_key,
        category: row.category,
        updatedAt: row.updated_at,
    };
}

export async function getItemCategoryPreferences(
    supabase,
    orgId
) {
    if (!orgId) {
        throw new Error("Organization ID is required.");
    }

    const { data, error } = await supabase
        .from("item_category_preferences")
        .select("name_key, category, updated_at")
        .eq("org_id", orgId)
        .order("name_key", { ascending: true });

    if (error) {
        throw error;
    }

    return data.map(mapPreferenceRow);
}

export async function upsertItemCategoryPreference(
    supabase,
    orgId,
    name,
    category
) {
    if (!orgId) {
        throw new Error("Organization ID is required.");
    }

    const nameKey = normalizeItemNameKey(name);

    if (!nameKey) {
        throw new Error("Item name is required.");
    }

    if (!isValidItemCategory(category)) {
        throw new Error("Invalid category.");
    }

    const { data, error } = await supabase
        .from("item_category_preferences")
        .upsert(
            {
                org_id: orgId,
                name_key: nameKey,
                category,
                updated_at: new Date().toISOString(),
            },
            {
                onConflict: "org_id,name_key",
            }
        )
        .select("name_key, category, updated_at")
        .single();

    if (error) {
        throw error;
    }

    return mapPreferenceRow(data);
}