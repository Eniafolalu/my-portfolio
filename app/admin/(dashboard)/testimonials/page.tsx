import { createClient } from "@/lib/supabase/server";
import { Testimonial } from "@/types/portfolio";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";

export const metadata = {
  title: "Testimonials CMS | Portfolio Admin",
};

export default async function AdminTestimonialsPage() {
  let testimonials: Testimonial[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) testimonials = data;
  } catch (err) {
    console.warn("Failed to fetch testimonials:", err);
  }

  return <TestimonialsManager initialTestimonials={testimonials} />;
}
