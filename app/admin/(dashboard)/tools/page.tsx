import { createClient } from "@/lib/supabase/server";
import { Tool } from "@/types/portfolio";
import { ToolsManager } from "@/components/admin/tools-manager";

export const metadata = {
  title: "Tools CMS | Portfolio Admin",
};

export default async function AdminToolsPage() {
  let tools: Tool[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("tools")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) tools = data;
  } catch (err) {
    console.warn("Failed to fetch tools:", err);
  }

  return <ToolsManager initialTools={tools} />;
}
