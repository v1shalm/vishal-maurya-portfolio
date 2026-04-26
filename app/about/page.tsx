import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About · Vishal Maurya",
  description:
    "Product designer in Mumbai. Currently at Pineapple Design Studio, shipping consumer products in quick-commerce and healthtech with AI in the loop.",
};

export default function AboutPage() {
  return <AboutContent />;
}
