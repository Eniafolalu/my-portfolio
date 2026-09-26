import { createClient } from "@/lib/supabase/server";
import { Service } from "@/types/portfolio";
import { ServicesManager } from "@/components/admin/services-manager";

export const metadata = {
  title: "Services CMS | Portfolio Admin",
};

export default async function AdminServicesPage() {
  let services: Service[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) services = data;
  } catch (err) {
    console.warn("Failed to fetch services:", err);
  }

  return <ServicesManager initialServices={services} />;
}
