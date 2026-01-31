import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HeroSection } from "@/components/hero-section";

export default async function HomePage() {
  const { userId } = await auth();

  // Redirect to dashboard if already signed in
  if (userId) {
    redirect("/dashboard");
  }

  return <HeroSection />;
}
