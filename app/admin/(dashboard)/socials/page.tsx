import { createClient } from "@/lib/supabase/server";
import { SocialLink } from "@/types/portfolio";
import { SocialsManager } from "@/components/admin/socials-manager";

export const metadata = {
  title: "Social Links CMS | Portfolio Admin",
};

export default async function AdminSocialsPage() {
  let socials: SocialLink[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("social_links")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) socials = data;
  } catch (err) {
    console.warn("Failed to fetch socials:", err);
  }

  return <SocialsManager initialSocials={socials} />;
}
