function normalizeListTitle(title) {
    const cleanTitle = title?.trim();

    if (!cleanTitle) {
        throw new Error("List title is required.");
    }

    if (cleanTitle.length > 50) {
        throw new Error("List title must be 50 characters or less.");
    }

    return cleanTitle;
}

function mapListRow(row) {
    return {
        id: row.id,
        title: row.title,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export async function getLists(supabase) {
    const { data, error } = await supabase
        .from("lists")
        .select("id, title, created_at, updated_at")
        .order("created_at", { ascending: true });

    if (error) {
        throw error;
    }

    return data.map(mapListRow);
}

export async function createList(supabase, orgId, title = "Shopping List") {
    if (!orgId) {
        throw new Error("Organization ID is required.");
    }

    const cleanTitle = normalizeListTitle(title);

    const { data, error } = await supabase
        .from("lists")
        .insert({
            org_id: orgId,
            title: cleanTitle,
        })
        .select("id, title, created_at, updated_at")
        .single();

    if (error) {
        throw error;
    }

    return mapListRow(data);
}

export async function renameList(supabase, listId, title) {
    if (!listId) {
        throw new Error("List ID is required.");
    }

    const cleanTitle = normalizeListTitle(title);

    const { data, error } = await supabase
        .from("lists")
        .update({
            title: cleanTitle,
            updated_at: new Date().toISOString(),
        })
        .eq("id", listId)
        .select("id, title, created_at, updated_at")
        .single();

    if (error) {
        throw error;
    }

    return mapListRow(data);
}

export async function deleteList(supabase, listId) {
    if (!listId) {
        throw new Error("List ID is required.");
    }

    const { error } = await supabase
        .from("lists")
        .delete()
        .eq("id", listId);

    if (error) {
        throw error;
    }

    return listId;
}