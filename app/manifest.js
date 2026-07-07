export default function manifest() {
    return {
        name: "Bastet Grocer",
        short_name: "Grocer",
        description: "A simple grocery list app for quick trips to the store",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#e8e8e8",
        theme_color: "#66cc8a",
        icons: [
            {
                src: "/android-chrome-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
        shortcuts: [
            {
                name: "Shopping List",
                short_name: "List",
                description: "Open your shopping list",
                url: "/shopping-list",
                icons: [{ src: "/android-chrome-192x192.png", sizes: "192x192" }],
            },
            {
                name: "Quick Adds",
                short_name: "Quick",
                description: "Manage common grocery items",
                url: "/quick-add",
                icons: [{ src: "/android-chrome-192x192.png", sizes: "192x192" }],
            },
        ],
    };
}