import { createClient } from "@/lib/supabase/server";
import { Project } from "@/types/portfolio";
import { ProjectsList } from "@/components/admin/projects-list";

export const metadata = {
  title: "Projects CMS | Portfolio Admin",
};

export default async function AdminProjectsPage() {
  let projects: Project[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) projects = data;
  } catch (err) {
    console.warn("Failed to fetch projects in admin:", err);
  }

  return <ProjectsList initialProjects={projects} />;
}
