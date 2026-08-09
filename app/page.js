import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Landing from "./components/organisms/landing";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/shopping-list");
  }

  return <Landing />;
}