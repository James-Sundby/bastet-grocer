import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Landing from "./components/organisms/landing";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/shopping-list");
  }

  return <Landing />;
}