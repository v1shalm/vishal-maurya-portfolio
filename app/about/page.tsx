import type { Metadata } from "next";
import { isUnlockedHost } from "@/lib/host";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About · Vishal Maurya",
  description:
    "Product designer in Mumbai. 2.5 years shipping consumer products across quick commerce, healthtech, SaaS, and fintech.",
};

export default async function AboutPage() {
  const unlocked = await isUnlockedHost();
  return <AboutContent unlocked={unlocked} />;
}
