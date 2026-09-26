import { getSiteSettings } from "@/lib/data";
import { SettingsManager } from "@/components/admin/settings-manager";

export const metadata = {
  title: "Site Settings | Portfolio Admin",
};

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return <SettingsManager initialSettings={settings} />;
}
