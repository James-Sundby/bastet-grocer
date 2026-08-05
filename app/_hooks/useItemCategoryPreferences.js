"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    getItemCategoryPreferences,
    upsertItemCategoryPreference,
} from "@/app/_services/item-category-preference-service";

import {
    getItemCategorySuggestion,
    isValidItemCategory,
} from "@/app/_utils/itemCategory";

export function useItemCategoryPreferences({
    supabase,
    isLoaded,
    isSignedIn,
    orgId,
}) {
    const [preferenceState, setPreferenceState] = useState({
        status: "idle",
        queryKey: null,
        preferences: [],
    });

    const queryKey =
        isLoaded && isSignedIn && orgId
            ? orgId
            : null;

    useEffect(() => {
        if (!queryKey || !orgId) {
            return undefined;
        }

        let isCurrent = true;

        getItemCategoryPreferences(supabase, orgId)
            .then((preferences) => {
                if (!isCurrent) {
                    return;
                }

                setPreferenceState({
                    status: "success",
                    queryKey,
                    preferences,
                });
            })
            .catch(() => {
                if (!isCurrent) {
                    return;
                }

                // Category suggestions are optional.
                // Continue using local rules if loading preferences fails.
                setPreferenceState({
                    status: "error",
                    queryKey,
                    preferences: [],
                });
            });

        return () => {
            isCurrent = false;
        };
    }, [supabase, queryKey, orgId]);

    const preferenceMap = useMemo(() => {
        const preferences =
            preferenceState.queryKey === queryKey
                ? preferenceState.preferences
                : [];

        return new Map(
            preferences.map((preference) => [
                preference.nameKey,
                preference.category,
            ])
        );
    }, [
        preferenceState.queryKey,
        preferenceState.preferences,
        queryKey,
    ]);

    const suggestCategory = useCallback(
        (name) => {
            return getItemCategorySuggestion(
                name,
                preferenceMap
            );
        },
        [preferenceMap]
    );

    const rememberCategory = useCallback(
        async ({
            name,
            category,
            wasManuallySelected = false,
            force = false,
        }) => {
            if (
                !orgId ||
                !name?.trim() ||
                !isValidItemCategory(category)
            ) {
                return false;
            }

            if (!wasManuallySelected && !force) {
                return false;
            }

            const existingSuggestion =
                getItemCategorySuggestion(
                    name,
                    preferenceMap
                );

            // Avoid storing a preference when the current rules
            // already produce the selected category.
            if (existingSuggestion.category === category) {
                return false;
            }

            try {
                const savedPreference =
                    await upsertItemCategoryPreference(
                        supabase,
                        orgId,
                        name,
                        category
                    );

                setPreferenceState((currentState) => {
                    if (currentState.queryKey !== queryKey) {
                        return currentState;
                    }

                    const remainingPreferences =
                        currentState.preferences.filter(
                            (preference) =>
                                preference.nameKey !==
                                savedPreference.nameKey
                        );

                    return {
                        ...currentState,
                        status: "success",
                        preferences: [
                            ...remainingPreferences,
                            savedPreference,
                        ],
                    };
                });

                return true;
            } catch {
                // The grocery item has already saved successfully.
                // A failed optional preference should not surface
                // as a failed item save.
                return false;
            }
        },
        [
            supabase,
            orgId,
            queryKey,
            preferenceMap,
        ]
    );

    const status = !queryKey
        ? "idle"
        : preferenceState.queryKey === queryKey
            ? preferenceState.status
            : "loading";

    return {
        status,
        suggestCategory,
        rememberCategory,
    };
}