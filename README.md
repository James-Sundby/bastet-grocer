# Bastet Grocer

Bastet Grocer is a shared grocery list application built for everyday household shopping.

It combines real-time shared lists, reusable Quick Adds, automatic item categorization, and a focused shopping mode in a responsive interface designed for both phones and desktop browsers.

The project also serves as a portfolio application for exploring authentication, multi-user data, real-time updates, responsive UI design, and secure access to Supabase from a Next.js application.

## Features

- **Shared household lists** - Grocery lists are shared between members of a household.
- **Multiple shopping lists** - Create, rename, switch between, and manage separate lists.
- **Real-time updates** - Changes are synchronized between household members and devices.
- **Quick Adds** - Save frequently purchased items and add them to a shopping list with one action.
- **Automatic categories** - Item categories can be suggested from the item name and remembered from previous choices.
- **Quantity tracking** - Increase or decrease quantities without recreating an item.
- **Shopping Mode** - A simplified mobile interface for checking items off while shopping.
- **Responsive desktop workspace** - Desktop views use sortable tables and persistent add/edit panels for faster list management.
- **Household authentication** - Clerk handles user authentication and household organization membership.
- **Row-level security** - Supabase RLS policies restrict household and personal data at the database level.

## Tech Stack

- **Next.js** - Main framework
- **Clerk** - Authentication
- **Supabase** - PostgreSQL database, RPC functions, Row Level Security, and real-time updates
- **Tailwind CSS** - Utility-first styling
- **DaisyUI** - UI components and application theme
- **Vercel** - Application hosting

## Contributing

If you have suggestions or improvements, feel free to open an issue or submit a pull request.

## License

This project is open source and available under the [MIT License](LICENSE).
