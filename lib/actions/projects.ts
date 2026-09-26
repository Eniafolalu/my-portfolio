"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ─── AUTH GUARD ─────────────────────────────────────────────────────────────

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/admin/login");
  }
  return { supabase: supabase as any, user };
}

// ─── CREATE PROJECT ──────────────────────────────────────────────────────────

export async function createProject(formData: FormData) {
  const { supabase } = await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  const slugRaw = (formData.get("slug") as string)?.trim();
  const slug = slugRaw ? slugify(slugRaw) : slugify(title);
  const short_description = (formData.get("short_description") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const project_type = (formData.get("project_type") as string)?.trim();
  const role = (formData.get("role") as string)?.trim();
  const timeline = (formData.get("timeline") as string)?.trim();
  const team = (formData.get("team") as string)?.trim() || null;
  const toolsRaw = (formData.get("tools") as string)?.trim();
  const tools = toolsRaw
    ? toolsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];
  const behance_url = (formData.get("behance_url") as string)?.trim() || null;
  const is_featured = formData.get("is_featured") === "true";
  const status = (formData.get("status") as string) || "draft";

  if (!title || !slug || !short_description || !category || !project_type || !role || !timeline) {
    return { error: "Please fill in all required fields." };
  }

  // Handle cover image upload
  let cover_image = "";
  const coverFile = formData.get("cover_image") as File | null;
  if (coverFile && coverFile.size > 0) {
    const ext = coverFile.name.split(".").pop();
    const fileName = `${slug}-cover-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(fileName, coverFile, { upsert: true });

    if (uploadError) {
      return { error: `Cover image upload failed: ${uploadError.message}` };
    }

    const { data: urlData } = supabase.storage
      .from("project-images")
      .getPublicUrl(fileName);
    cover_image = urlData.publicUrl;
  }

  // Get current max sort_order
  const { data: existing } = await supabase
    .from("projects")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort_order = (existing?.sort_order ?? 0) + 1;

  const insertData = {
    title,
    slug,
    short_description,
    category,
    project_type,
    role,
    timeline,
    team,
    tools,
    cover_image,
    behance_url,
    is_featured,
    status,
    sort_order,
  };

  const { data: project, error } = await supabase
    .from("projects")
    .insert(insertData)
    .select()
    .single();

  if (error || !project) {
    return { error: `Failed to create project: ${error?.message || "Unknown error"}` };
  }

  // Handle gallery images
  const galleryFiles = formData.getAll("gallery_images") as File[];
  for (let i = 0; i < galleryFiles.length; i++) {
    const file = galleryFiles[i];
    if (!file || file.size === 0) continue;
    const ext = file.name.split(".").pop();
    const fileName = `${slug}-gallery-${Date.now()}-${i}.${ext}`;
    const { error: gUploadError } = await supabase.storage
      .from("project-images")
      .upload(fileName, file, { upsert: true });

    if (gUploadError) continue;

    const { data: gUrlData } = supabase.storage
      .from("project-images")
      .getPublicUrl(fileName);

    await supabase.from("project_images").insert({
      project_id: project.id,
      image_url: gUrlData.publicUrl,
      sort_order: i + 1,
    });
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

// ─── UPDATE PROJECT ──────────────────────────────────────────────────────────

export async function updateProject(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  const slugRaw = (formData.get("slug") as string)?.trim();
  const slug = slugRaw ? slugify(slugRaw) : slugify(title);
  const short_description = (formData.get("short_description") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const project_type = (formData.get("project_type") as string)?.trim();
  const role = (formData.get("role") as string)?.trim();
  const timeline = (formData.get("timeline") as string)?.trim();
  const team = (formData.get("team") as string)?.trim() || null;
  const toolsRaw = (formData.get("tools") as string)?.trim();
  const tools = toolsRaw
    ? toolsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];
  const behance_url = (formData.get("behance_url") as string)?.trim() || null;
  const is_featured = formData.get("is_featured") === "true";
  const status = (formData.get("status") as string) || "draft";

  if (!title || !short_description || !category || !project_type || !role || !timeline) {
    return { error: "Please fill in all required fields." };
  }

  const updateData: Record<string, any> = {
    title,
    slug,
    short_description,
    category,
    project_type,
    role,
    timeline,
    team,
    tools,
    behance_url,
    is_featured,
    status,
    updated_at: new Date().toISOString(),
  };

  // Handle new cover image upload
  const coverFile = formData.get("cover_image") as File | null;
  if (coverFile && coverFile.size > 0) {
    const ext = coverFile.name.split(".").pop();
    const fileName = `${slug}-cover-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(fileName, coverFile, { upsert: true });

    if (uploadError) {
      return { error: `Cover image upload failed: ${uploadError.message}` };
    }

    const { data: urlData } = supabase.storage
      .from("project-images")
      .getPublicUrl(fileName);
    updateData.cover_image = urlData.publicUrl;
  }

  const { error } = await supabase
    .from("projects")
    .update(updateData)
    .eq("id", id);

  if (error) {
    return { error: `Failed to update project: ${error.message}` };
  }

  // Handle new gallery images
  const galleryFiles = formData.getAll("gallery_images") as File[];
  const { data: existingImages } = await supabase
    .from("project_images")
    .select("sort_order")
    .eq("project_id", id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  let nextOrder = (existingImages?.sort_order ?? 0) + 1;

  for (const file of galleryFiles) {
    if (!file || file.size === 0) continue;
    const ext = file.name.split(".").pop();
    const fileName = `${id}-gallery-${Date.now()}.${ext}`;
    const { error: gUploadError } = await supabase.storage
      .from("project-images")
      .upload(fileName, file, { upsert: true });

    if (gUploadError) continue;

    const { data: gUrlData } = supabase.storage
      .from("project-images")
      .getPublicUrl(fileName);

    await supabase.from("project_images").insert({
      project_id: id,
      image_url: gUrlData.publicUrl,
      sort_order: nextOrder++,
    });
  }

  revalidatePath(`/admin/projects/${id}/edit`);
  revalidatePath("/admin/projects");
  revalidatePath("/");
  return { success: true };
}

// ─── DELETE PROJECT ──────────────────────────────────────────────────────────

export async function deleteProject(id: string) {
  const { supabase } = await requireAdmin();

  // Delete gallery images from storage + DB
  const { data: images } = await supabase
    .from("project_images")
    .select("image_url")
    .eq("project_id", id);

  if (images?.length) {
    const paths = (images as Array<{ image_url: string }>).map((img) => {
      const parts = img.image_url.split("/project-images/");
      return parts[1] || "";
    }).filter(Boolean);
    if (paths.length) {
      await supabase.storage.from("project-images").remove(paths);
    }
    await supabase.from("project_images").delete().eq("project_id", id);
  }

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
  return { success: true };
}

// ─── TOGGLE STATUS ───────────────────────────────────────────────────────────

export async function toggleProjectStatus(id: string, currentStatus: string) {
  const { supabase } = await requireAdmin();
  const newStatus = currentStatus === "published" ? "draft" : "published";

  const { error } = await supabase
    .from("projects")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/projects");
  revalidatePath("/");
  return { success: true, newStatus };
}

// ─── TOGGLE FEATURED ─────────────────────────────────────────────────────────

export async function toggleProjectFeatured(id: string, currentFeatured: boolean) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("projects")
    .update({ is_featured: !currentFeatured, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/projects");
  revalidatePath("/");
  return { success: true };
}

// ─── DELETE GALLERY IMAGE ────────────────────────────────────────────────────

export async function deleteGalleryImage(imageId: string, imageUrl: string) {
  const { supabase } = await requireAdmin();

  const parts = imageUrl.split("/project-images/");
  if (parts[1]) {
    await supabase.storage.from("project-images").remove([parts[1]]);
  }

  const { error } = await supabase
    .from("project_images")
    .delete()
    .eq("id", imageId);

  if (error) return { error: error.message };

  revalidatePath("/admin/projects");
  return { success: true };
}

// ─── REORDER GALLERY IMAGES ──────────────────────────────────────────────────

export async function reorderGalleryImages(
  updates: { id: string; sort_order: number }[]
) {
  const { supabase } = await requireAdmin();

  for (const update of updates) {
    await supabase
      .from("project_images")
      .update({ sort_order: update.sort_order })
      .eq("id", update.id);
  }

  revalidatePath("/admin/projects");
  return { success: true };
}
