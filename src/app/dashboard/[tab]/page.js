import { redirect } from "next/navigation";

const VALID_TABS = [
  "dashboard",
  "profile",
  "payments",
  "orders",
  "wishlist",
  "notifications",
  "support",
  "settings",
  "membership",
];

export default async function DashboardTabRedirect({ params }) {
  const resolvedParams = await params;
  const rawTab = (resolvedParams?.tab || "dashboard").toLowerCase();
  const tab = rawTab === "membership" ? "dashboard" : rawTab;

  if (VALID_TABS.includes(tab)) {
    redirect(`/dashboard?tab=${encodeURIComponent(tab)}`);
  } else {
    redirect("/dashboard");
  }
}
