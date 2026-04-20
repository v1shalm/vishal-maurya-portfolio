import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { NexusScrolly } from "./NexusScrolly";

export const metadata: Metadata = {
  title: "Nexus 247 · Scroll draft",
  description:
    "Storytelling draft for the Nexus 247 case study. Experimental format, not linked from the site.",
  robots: { index: false, follow: false },
};

export default function NexusScrollyDraftPage() {
  return (
    <>
      <Nav />
      <NexusScrolly />
    </>
  );
}
