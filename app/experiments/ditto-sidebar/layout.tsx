import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ditto Sidebar Experiment",
  robots: { index: false, follow: false },
};

export default function DittoSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
