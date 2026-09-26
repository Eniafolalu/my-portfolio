import { getSiteSettings, getCareerEntries } from "@/lib/data";
import { AboutManager } from "@/components/admin/about-manager";

export const metadata = {
  title: "About & Journey CMS | Portfolio Admin",
};

export default async function AdminAboutPage() {
  const [settings, careerEntries] = await Promise.all([
    getSiteSettings(),
    getCareerEntries(),
  ]);

  return (
    <AboutManager
      initialSettings={settings}
      initialEntries={careerEntries}
    />
  );
}
