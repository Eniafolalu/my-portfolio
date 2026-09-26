import { createClient } from "@/lib/supabase/server";
import { ContactMessage } from "@/types/portfolio";
import { MessagesManager } from "@/components/admin/messages-manager";

export const metadata = {
  title: "Inquiries & Messages | Portfolio Admin",
};

export default async function AdminMessagesPage() {
  let messages: ContactMessage[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) messages = data;
  } catch (err) {
    console.warn("Failed to fetch contact messages:", err);
  }

  return <MessagesManager initialMessages={messages} />;
}
