"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

// ─── SERVICES ────────────────────────────────────────────────────────────────

export async function createService(formData: FormData) {
  const { supabase } = await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const is_published = formData.get("is_published") === "true";

  if (!title || !description) return { error: "Title and description required." };

  const { data: existing } = await supabase
    .from("services")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort_order = (existing?.sort_order ?? 0) + 1;

  const { error } = await supabase.from("services").insert({
    title,
    description,
    icon: "Layers",
    is_published,
    sort_order,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/services");
  revalidatePath("/");
  return { success: true };
}

export async function updateService(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const is_published = formData.get("is_published") === "true";

  if (!title || !description) return { error: "Title and description required." };

  const { error } = await supabase
    .from("services")
    .update({ title, description, is_published })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/services");
  revalidatePath("/");
  return { success: true };
}

export async function deleteService(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/services");
  revalidatePath("/");
  return { success: true };
}

export async function toggleService(id: string, currentValue: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("services")
    .update({ is_published: !currentValue })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/services");
  revalidatePath("/");
  return { success: true };
}

// ─── TOOLS ───────────────────────────────────────────────────────────────────

export async function createTool(formData: FormData) {
  const { supabase } = await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const is_enabled = formData.get("is_enabled") === "true";

  if (!name) return { error: "Tool name required." };

  const { data: existing } = await supabase
    .from("tools")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort_order = (existing?.sort_order ?? 0) + 1;

  const { error } = await supabase.from("tools").insert({
    name,
    icon: "Wrench",
    url: null,
    is_enabled,
    sort_order,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/tools");
  revalidatePath("/");
  return { success: true };
}

export async function updateTool(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const is_enabled = formData.get("is_enabled") === "true";

  if (!name) return { error: "Tool name required." };

  const { error } = await supabase
    .from("tools")
    .update({ name, is_enabled })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/tools");
  revalidatePath("/");
  return { success: true };
}

export async function deleteTool(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("tools").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/tools");
  revalidatePath("/");
  return { success: true };
}

export async function toggleTool(id: string, currentValue: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("tools")
    .update({ is_enabled: !currentValue })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/tools");
  revalidatePath("/");
  return { success: true };
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

export async function createTestimonial(formData: FormData) {
  const { supabase } = await requireAdmin();

  const client_name = (formData.get("client_name") as string)?.trim();
  const role = (formData.get("role") as string)?.trim();
  const company = (formData.get("company") as string)?.trim();
  const testimonial = (formData.get("testimonial") as string)?.trim();
  const is_featured = formData.get("is_featured") === "true";

  if (!client_name || !role || !company || !testimonial) {
    return { error: "All fields are required." };
  }

  const { data: existing } = await supabase
    .from("testimonials")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort_order = (existing?.sort_order ?? 0) + 1;

  const { error } = await supabase.from("testimonials").insert({
    client_name,
    role,
    company,
    testimonial,
    is_featured,
    sort_order,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true };
}

export async function updateTestimonial(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const client_name = (formData.get("client_name") as string)?.trim();
  const role = (formData.get("role") as string)?.trim();
  const company = (formData.get("company") as string)?.trim();
  const testimonial = (formData.get("testimonial") as string)?.trim();
  const is_featured = formData.get("is_featured") === "true";

  if (!client_name || !role || !company || !testimonial) {
    return { error: "All fields are required." };
  }

  const { error } = await supabase
    .from("testimonials")
    .update({ client_name, role, company, testimonial, is_featured })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true };
}

export async function toggleTestimonialFeatured(id: string, currentValue: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("testimonials")
    .update({ is_featured: !currentValue })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true };
}

// ─── SOCIAL LINKS ─────────────────────────────────────────────────────────────

export async function createSocialLink(formData: FormData) {
  const { supabase } = await requireAdmin();

  const platform = (formData.get("platform") as string)?.trim();
  const label = (formData.get("label") as string)?.trim();
  const url = (formData.get("url") as string)?.trim();
  const is_enabled = formData.get("is_enabled") === "true";

  if (!platform || !label || !url) return { error: "Platform, label, and URL required." };

  const { data: existing } = await supabase
    .from("social_links")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort_order = (existing?.sort_order ?? 0) + 1;

  const { error } = await supabase.from("social_links").insert({
    platform,
    label,
    url,
    is_enabled,
    sort_order,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/socials");
  revalidatePath("/");
  return { success: true };
}

export async function updateSocialLink(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const platform = (formData.get("platform") as string)?.trim();
  const label = (formData.get("label") as string)?.trim();
  const url = (formData.get("url") as string)?.trim();
  const is_enabled = formData.get("is_enabled") === "true";

  if (!platform || !label || !url) return { error: "Platform, label, and URL required." };

  const { error } = await supabase
    .from("social_links")
    .update({ platform, label, url, is_enabled })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/socials");
  revalidatePath("/");
  return { success: true };
}

export async function deleteSocialLink(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("social_links").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/socials");
  revalidatePath("/");
  return { success: true };
}

export async function toggleSocialLink(id: string, currentValue: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("social_links")
    .update({ is_enabled: !currentValue })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/socials");
  revalidatePath("/");
  return { success: true };
}

// ─── CAREER ENTRIES ───────────────────────────────────────────────────────────

export async function createCareerEntry(formData: FormData) {
  const { supabase } = await requireAdmin();

  const year = (formData.get("year") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const company = (formData.get("company") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim();

  if (!year || !title || !description) return { error: "Year, title, and description required." };

  const { data: existing } = await supabase
    .from("career_entries")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort_order = (existing?.sort_order ?? 0) + 1;

  const { error } = await supabase.from("career_entries").insert({
    year,
    title,
    company,
    description,
    sort_order,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/about");
  revalidatePath("/");
  return { success: true };
}

export async function updateCareerEntry(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const year = (formData.get("year") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const company = (formData.get("company") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim();

  if (!year || !title || !description) return { error: "Year, title, and description required." };

  const { error } = await supabase
    .from("career_entries")
    .update({ year, title, company, description })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/about");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCareerEntry(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("career_entries").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/about");
  revalidatePath("/about");
  return { success: true };
}

// ─── SITE SETTINGS ────────────────────────────────────────────────────────────

export async function updateSiteSettings(formData: FormData) {
  const { supabase } = await requireAdmin();

  const owner_name = (formData.get("owner_name") as string)?.trim();
  const professional_title = (formData.get("professional_title") as string)?.trim();
  const about_headline = (formData.get("about_headline") as string)?.trim();
  const about_description = (formData.get("about_description") as string)?.trim();
  const calendly_url = (formData.get("calendly_url") as string)?.trim();
  const behance_url = (formData.get("behance_url") as string)?.trim();
  const contact_email = (formData.get("contact_email") as string)?.trim();
  const linkedin_url = (formData.get("linkedin_url") as string)?.trim() || null;
  const skillsRaw = (formData.get("skills_list") as string)?.trim();
  const skills_list = skillsRaw
    ? skillsRaw.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];

  if (!owner_name || !professional_title) return { error: "Owner name and title required." };

  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .maybeSingle();

  let error;
  if (existing?.id) {
    ({ error } = await supabase
      .from("site_settings")
      .update({
        owner_name,
        professional_title,
        about_headline,
        about_description,
        calendly_url,
        behance_url,
        contact_email,
        linkedin_url,
        skills_list,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id));
  } else {
    ({ error } = await supabase
      .from("site_settings")
      .insert({
        owner_name,
        professional_title,
        about_headline,
        about_description,
        calendly_url,
        behance_url,
        contact_email,
        linkedin_url,
        skills_list,
      }));
  }

  if (error) return { error: error.message };
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/about");
  return { success: true };
}

// ─── MARK MESSAGE READ ────────────────────────────────────────────────────────

export async function toggleMessageRead(id: string, currentValue: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: !currentValue })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function deleteMessage(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/messages");
  return { success: true };
}
