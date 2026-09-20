import { createClient } from "@/lib/supabase/server";
import {
  Project,
  Service,
  Tool,
  Testimonial,
  CareerEntry,
  SocialLink,
  SiteSettings,
} from "@/types/portfolio";

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .maybeSingle();

    if (error) {
      console.warn("Could not fetch site_settings:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("Supabase connection error in getSiteSettings:", err);
    return null;
  }
}

export async function getPublishedProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    if (error) {
      console.warn("Could not fetch projects:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn("Supabase connection error in getPublishedProjects:", err);
    return [];
  }
}

export async function getPublishedServices(): Promise<Service[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) return [];
    return data || [];
  } catch (err) {
    console.warn("Supabase connection error in getPublishedServices:", err);
    return [];
  }
}

export async function getEnabledTools(): Promise<Tool[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .eq("is_enabled", true)
      .order("sort_order", { ascending: true });

    if (error) return [];
    return data || [];
  } catch (err) {
    console.warn("Supabase connection error in getEnabledTools:", err);
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) return [];
    return data || [];
  } catch (err) {
    console.warn("Supabase connection error in getTestimonials:", err);
    return [];
  }
}

export async function getCareerEntries(): Promise<CareerEntry[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("career_entries")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) return [];
    return data || [];
  } catch (err) {
    console.warn("Supabase connection error in getCareerEntries:", err);
    return [];
  }
}

export async function getEnabledSocialLinks(): Promise<SocialLink[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .eq("is_enabled", true)
      .order("sort_order", { ascending: true });

    if (error) return [];
    return data || [];
  } catch (err) {
    console.warn("Supabase connection error in getEnabledSocialLinks:", err);
    return [];
  }
}
