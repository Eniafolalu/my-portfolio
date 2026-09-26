import { ProjectForm } from "@/components/admin/project-form";

export const metadata = {
  title: "Create Project | Portfolio CMS",
};

export default function NewProjectPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <ProjectForm />
    </div>
  );
}
