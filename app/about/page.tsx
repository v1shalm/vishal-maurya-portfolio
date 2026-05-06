import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About · Vishal Maurya",
  description:
    "Product designer in Mumbai. Most recently at Pineapple Design Studio, shipping consumer products in quick-commerce and healthtech.",
};

export default function AboutPage() {
  return <AboutContent />;
}
