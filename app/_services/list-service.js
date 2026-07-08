function normalizeListTitle(title) {
    const cleanTitle = title?.trim();

    if (!cleanTitle) {
        throw new Error("List title is required.");
    }

    return cleanTitle;
}

export async function getLists(supabase) {
    const { data, error } = await supabase
        .from("lists")
        .select("id, title, created_at, updated_at")
        .order("created_at", { ascending: true });

    if (error) {
        throw error;
    }

    return data.map((list) => ({
        id: list.id,
        title: list.title,
        createdAt: list.created_at,
        updatedAt: list.updated_at,
    }));
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

    return {
        id: data.id,
        title: data.title,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    };
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

    return {
        id: data.id,
        title: data.title,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    };
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

    return true;
}