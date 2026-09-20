import { Database } from "./database";

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export type ProjectImage = Database["public"]["Tables"]["project_images"]["Row"];
export type Service = Database["public"]["Tables"]["services"]["Row"];
export type Tool = Database["public"]["Tables"]["tools"]["Row"];
export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];
export type CareerEntry = Database["public"]["Tables"]["career_entries"]["Row"];
export type SocialLink = Database["public"]["Tables"]["social_links"]["Row"];
export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
export type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];

export interface ProjectWithImages extends Project {
  images?: ProjectImage[];
}

export type ProjectCategory = "All" | "Mobile Apps" | "Websites" | "Dashboards";
