import type { Metadata } from "next";
import { isUnlockedHost } from "@/lib/host";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About · Vishal Maurya",
  description:
    "Product designer in Mumbai. 2+ years shipping consumer products in quick-commerce and healthtech.",
};

export default async function AboutPage() {
  const unlocked = await isUnlockedHost();
  return <AboutContent unlocked={unlocked} />;
}
