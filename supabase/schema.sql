-- ==============================================================================
-- PERSONAL PRODUCT DESIGN PORTFOLIO + CMS: DATABASE SCHEMA
-- Author: Enioluwa Afolalu Portfolio
-- Target: PostgreSQL / Supabase
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. SITE SETTINGS (Singleton configuration table)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_name TEXT NOT NULL DEFAULT 'Enioluwa Afolalu',
    professional_title TEXT NOT NULL DEFAULT 'Product Designer · UI/UX Designer',
    profile_image_url TEXT,
    about_headline TEXT NOT NULL DEFAULT 'I design digital experiences at the intersection of strategy, usability and visual design.',
    about_description TEXT NOT NULL DEFAULT 'Product Designer focused on creating intuitive, scalable and visually refined experiences across mobile apps, websites and dashboards. Over 6+ years designing user-centered products from early concept to production.',
    calendly_url TEXT NOT NULL DEFAULT 'https://calendly.com/enioluwa-afolalu',
    behance_url TEXT NOT NULL DEFAULT 'https://www.behance.net/enioluwa-afolalu',
    contact_email TEXT NOT NULL DEFAULT 'enioluwa.afolalu@gmail.com',
    linkedin_url TEXT DEFAULT 'https://www.linkedin.com/in/enioluwa-afolalu',
    skills_list TEXT[] DEFAULT ARRAY['Product Strategy', 'Design Systems', 'Mobile App Design (iOS/Android)', 'SaaS & Web Applications', 'User Research & Testing', 'Interactive Prototyping', 'Information Architecture', 'Design Handoff & Specs'],
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. PROJECTS & PROJECT IMAGES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Mobile Apps',
    project_type TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Lead Product Designer',
    timeline TEXT NOT NULL DEFAULT '2024',
    team TEXT,
    tools TEXT[] DEFAULT ARRAY['Figma', 'FigJam'],
    cover_image TEXT NOT NULL,
    behance_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON public.projects(sort_order);

CREATE TABLE IF NOT EXISTS public.project_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id);

-- ------------------------------------------------------------------------------
-- 3. DESIGN SERVICES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'Layers',
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_order ON public.services(sort_order);

-- ------------------------------------------------------------------------------
-- 4. TOOLS I USE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'Figma',
    url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tools_order ON public.tools(sort_order);

-- ------------------------------------------------------------------------------
-- 5. TESTIMONIALS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    avatar_url TEXT,
    testimonial TEXT NOT NULL,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_order ON public.testimonials(sort_order);

-- ------------------------------------------------------------------------------
-- 6. CAREER JOURNEY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.career_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    company TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_career_entries_order ON public.career_entries(sort_order);

-- ------------------------------------------------------------------------------
-- 7. SOCIAL LINKS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_links_order ON public.social_links(sort_order);

-- ------------------------------------------------------------------------------
-- 8. CONTACT MESSAGES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    project_description TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON public.contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- ------------------------------------------------------------------------------
-- AUTOMATIC UPDATED_AT TRIGGER
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_site_settings ON public.site_settings;
CREATE TRIGGER set_updated_at_site_settings
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_projects ON public.projects;
CREATE TRIGGER set_updated_at_projects
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- SITE SETTINGS
CREATE POLICY "Public can view site settings"
    ON public.site_settings FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Admins can manage site settings"
    ON public.site_settings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- PROJECTS
CREATE POLICY "Public can view published projects"
    ON public.projects FOR SELECT
    TO public
    USING (status = 'published');

CREATE POLICY "Admins can manage all projects"
    ON public.projects FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- PROJECT IMAGES
CREATE POLICY "Public can view images for published projects"
    ON public.project_images FOR SELECT
    TO public
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = project_images.project_id
            AND projects.status = 'published'
        )
    );

CREATE POLICY "Admins can manage all project images"
    ON public.project_images FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- SERVICES
CREATE POLICY "Public can view published services"
    ON public.services FOR SELECT
    TO public
    USING (is_published = true);

CREATE POLICY "Admins can manage services"
    ON public.services FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- TOOLS
CREATE POLICY "Public can view enabled tools"
    ON public.tools FOR SELECT
    TO public
    USING (is_enabled = true);

CREATE POLICY "Admins can manage tools"
    ON public.tools FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- TESTIMONIALS
CREATE POLICY "Public can view testimonials"
    ON public.testimonials FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Admins can manage testimonials"
    ON public.testimonials FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- CAREER ENTRIES
CREATE POLICY "Public can view career entries"
    ON public.career_entries FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Admins can manage career entries"
    ON public.career_entries FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- SOCIAL LINKS
CREATE POLICY "Public can view enabled social links"
    ON public.social_links FOR SELECT
    TO public
    USING (is_enabled = true);

CREATE POLICY "Admins can manage social links"
    ON public.social_links FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- CONTACT MESSAGES
-- Public can ONLY insert new inquiries
CREATE POLICY "Public can submit contact messages"
    ON public.contact_messages FOR INSERT
    TO public
    WITH CHECK (true);

-- Only authenticated administrators can view and manage inquiries
CREATE POLICY "Admins can manage contact messages"
    ON public.contact_messages FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- SUPABASE STORAGE BUCKET CONFIGURATION
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access for portfolio media"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'portfolio-media');

CREATE POLICY "Authenticated admin upload for portfolio media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'portfolio-media');

CREATE POLICY "Authenticated admin update for portfolio media"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'portfolio-media');

CREATE POLICY "Authenticated admin delete for portfolio media"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'portfolio-media');

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- 1. Site Settings Seed
INSERT INTO public.site_settings (
    owner_name,
    professional_title,
    profile_image_url,
    about_headline,
    about_description,
    calendly_url,
    behance_url,
    contact_email,
    linkedin_url,
    skills_list
)
VALUES (
    'Enioluwa Afolalu',
    'Product Designer · UI/UX Designer',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'I design digital experiences at the intersection of strategy, usability and visual design.',
    'Product Designer focused on creating intuitive, scalable and visually refined experiences across mobile apps, websites and dashboards. Over 6+ years designing user-centered products from early concept to production.',
    'https://calendly.com',
    'https://behance.net',
    'enioluwa.afolalu@example.com',
    'https://linkedin.com',
    ARRAY['Product Strategy', 'Design Systems', 'Mobile App Design', 'SaaS Architecture', 'User Research', 'Interactive Prototyping', 'Design Operations']
)
ON CONFLICT DO NOTHING;

-- 2. Initial Services
INSERT INTO public.services (title, description, icon, sort_order, is_published)
VALUES
    ('Product Design', 'End-to-end product thinking from problem discovery and user validation to high-fidelity interface design and execution.', 'Layers', 1, true),
    ('UI/UX Design', 'Crafting intuitive, accessible user journeys and pixel-perfect aesthetic interfaces for modern multi-platform applications.', 'Compass', 2, true),
    ('Design Systems', 'Architecting modular, tokenized Figma libraries and component guidelines that scale seamlessly across multi-disciplinary engineering teams.', 'Grid', 3, true),
    ('SaaS Design', 'Translating complex data models and operational workflows into clear, frictionless dashboards and productivity tools.', 'Activity', 4, true),
    ('Mobile App Design', 'Native iOS and Android mobile interfaces engineered with ergonomic touch targets, gestures, and platform conventions.', 'Smartphone', 5, true),
    ('Web Design', 'Editorial, responsive marketing websites that communicate distinctive brand stories with high conversion velocity.', 'Globe', 6, true)
ON CONFLICT DO NOTHING;

-- 3. Initial Tools
INSERT INTO public.tools (name, icon, url, sort_order, is_enabled)
VALUES
    ('Figma', 'figma', 'https://figma.com', 1, true),
    ('FigJam', 'figjam', 'https://figjam.new', 2, true),
    ('Framer', 'framer', 'https://framer.com', 3, true),
    ('Notion', 'notion', 'https://notion.so', 4, true),
    ('Adobe Photoshop', 'photoshop', 'https://adobe.com/photoshop', 5, true),
    ('Adobe Illustrator', 'illustrator', 'https://adobe.com/illustrator', 6, true)
ON CONFLICT DO NOTHING;

-- 4. Initial Social Links
INSERT INTO public.social_links (platform, label, url, sort_order, is_enabled)
VALUES
    ('LinkedIn', 'LinkedIn', 'https://linkedin.com', 1, true),
    ('Behance', 'Behance', 'https://behance.net', 2, true),
    ('Instagram', 'Instagram', 'https://instagram.com', 3, true),
    ('Dribbble', 'Dribbble', 'https://dribbble.com', 4, true),
    ('X', 'X / Twitter', 'https://x.com', 5, true)
ON CONFLICT DO NOTHING;

-- 5. Initial Projects
INSERT INTO public.projects (
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
    sort_order
)
VALUES
    (
        'Finsync',
        'finsync',
        'Cross-border fintech experience designed for seamless currency conversion, multi-currency wallets, and instant payouts.',
        'Mobile Apps',
        'Fintech Mobile App',
        'Lead Product Designer',
        '4 Months (2024)',
        '1 PM, 3 Mobile Engineers',
        ARRAY['Figma', 'FigJam', 'Protopie'],
        'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
        'https://behance.net',
        true,
        'published',
        1
    ),
    (
        'Aura Mobility',
        'aura-mobility',
        'Next-generation electric vehicle fleet management dashboard and driver companion application with real-time telematics.',
        'Dashboards',
        'Enterprise SaaS & Telematics',
        'Senior UX Designer',
        '6 Months (2023)',
        '2 PMs, 5 Full-stack Engineers',
        ARRAY['Figma', 'Design Tokens', 'Notion'],
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        'https://behance.net',
        true,
        'published',
        2
    ),
    (
        'Kinex Studio',
        'kinex-studio',
        'Editorial e-commerce platform and visual design system for an avant-garde apparel atelier with 3D product previews.',
        'Websites',
        'Editorial E-Commerce',
        'Product & Visual Designer',
        '3 Months (2023)',
        'Brand Director, 2 Web Developers',
        ARRAY['Figma', 'Framer', 'Illustrator'],
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
        'https://behance.net',
        true,
        'published',
        3
    ),
    (
        'Verve Health',
        'verve-health',
        'Preventative health intelligence app with personalized biomarker tracking, micro-habit coaching, and clinic scheduling.',
        'Mobile Apps',
        'Healthtech Mobile Application',
        'Staff Product Designer',
        '5 Months (2024)',
        '1 Clinical Lead, 4 Engineers',
        ARRAY['Figma', 'UserTesting'],
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
        'https://behance.net',
        true,
        'published',
        4
    )
ON CONFLICT DO NOTHING;

-- 6. Initial Testimonials
INSERT INTO public.testimonials (client_name, role, company, avatar_url, testimonial, is_featured, sort_order)
VALUES
    (
        'Alexandre Mercier',
        'VP of Product',
        'Finsync Global',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        'Enioluwa has a rare balance of strategic product clarity and immaculate aesthetic taste. He transformed an intricate banking workflow into an experience our users rave about every single day.',
        true,
        1
    ),
    (
        'Sarah Jenkins',
        'Head of Design',
        'Aura Mobility',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        'Working with Enioluwa elevated our entire design culture. His systems thinking, attention to micro-details, and clear rationale made cross-functional collaboration effortless.',
        true,
        2
    ),
    (
        'David Okonjo',
        'Founder & CEO',
        'Kinex Studio',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        'The editorial sensibility Enioluwa brought to our brand was nothing short of world-class. He doesn''t just design screens — he designs memorable digital feelings.',
        true,
        3
    )
ON CONFLICT DO NOTHING;

-- 7. Initial Career Journey
INSERT INTO public.career_entries (year, title, description, company, sort_order)
VALUES
    (
        '2024 – Present',
        'Lead Product Designer',
        'Leading product design for multi-region fintech and SaaS initiatives. Establishing design system foundations, mentoring designers, and driving user research.',
        'Independent / Design Consultancy',
        1
    ),
    (
        '2022 – 2024',
        'Senior Product Designer',
        'Spearheaded the complete redesign of core mobile and web applications, scaling user engagement and streamlining cross-border financial transactions.',
        'Fintech Ventures',
        2
    ),
    (
        '2020 – 2022',
        'UI/UX & Systems Designer',
        'Designed component libraries, multi-platform design tokens, and user onboarding funnels across high-growth mobility and enterprise SaaS platforms.',
        'Digital Product Lab',
        3
    ),
    (
        '2018 – 2020',
        'Visual & Digital Designer',
        'Crafted brand identities, editorial marketing experiences, and web applications for global creative agencies and consumer brands.',
        'Creative Atelier',
        4
    )
ON CONFLICT DO NOTHING;
