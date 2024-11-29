"use client";

import { useEffect } from "react";
import HomeClient from "./homeClient";

export default function HomeWrapper() {
    useEffect(() => {
        const placeholder = document.getElementById("server-placeholder");
        if (placeholder) {
            placeholder.style.display = "none";
        }
    }, []);

    return <HomeClient />;
}