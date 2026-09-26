export const dynamic = "force-dynamic";

import { getSiteSettings, getEnabledSocialLinks } from "@/lib/data";
import { PublicNav } from "@/components/navigation/public-nav";
import { PublicFooter } from "@/components/footer/public-footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const socials = await getEnabledSocialLinks();

  const ownerName = settings?.owner_name || "Enioluwa Afolalu";
  const professionalTitle =
    settings?.professional_title || "Product Designer · UI/UX Designer";
  const profileImageUrl = settings?.profile_image_url || null;
  const calendlyUrl = settings?.calendly_url || "https://calendly.com";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-white selection:text-black">
      <PublicNav
        ownerName={ownerName}
        professionalTitle={professionalTitle}
        profileImageUrl={profileImageUrl}
        calendlyUrl={calendlyUrl}
      />
      <main className="flex-1">{children}</main>
      <PublicFooter
        calendlyUrl={calendlyUrl}
        socialLinks={socials}
        ownerName={ownerName}
      />
    </div>
  );
}
