import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/admin/project-form";
import { Project, ProjectImage } from "@/types/portfolio";

export const metadata = {
  title: "Edit Project | Portfolio CMS",
};

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!project) {
    notFound();
  }

  const { data: images } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", params.id)
    .order("sort_order", { ascending: true });

  return (
    <div className="max-w-6xl mx-auto">
      <ProjectForm
        initialData={project as Project}
        initialImages={(images || []) as ProjectImage[]}
        isEdit={true}
      />
    </div>
  );
}
