export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProjectStatus = "published" | "draft" | "archived";

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          short_description: string;
          category: string;
          project_type: string;
          role: string;
          timeline: string;
          team: string | null;
          tools: string[];
          cover_image: string;
          behance_url: string | null;
          is_featured: boolean;
          status: ProjectStatus;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          short_description: string;
          category: string;
          project_type: string;
          role: string;
          timeline: string;
          team?: string | null;
          tools?: string[];
          cover_image: string;
          behance_url?: string | null;
          is_featured?: boolean;
          status?: ProjectStatus;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          short_description?: string;
          category?: string;
          project_type?: string;
          role?: string;
          timeline?: string;
          team?: string | null;
          tools?: string[];
          cover_image?: string;
          behance_url?: string | null;
          is_featured?: boolean;
          status?: ProjectStatus;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_images: {
        Row: {
          id: string;
          project_id: string;
          image_url: string;
          caption: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          image_url: string;
          caption?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          image_url?: string;
          caption?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      services: {
        Row: {
          id: string;
          title: string;
          description: string;
          icon: string;
          sort_order: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          icon?: string;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          icon?: string;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      tools: {
        Row: {
          id: string;
          name: string;
          icon: string;
          url: string | null;
          sort_order: number;
          is_enabled: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon?: string;
          url?: string | null;
          sort_order?: number;
          is_enabled?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          url?: string | null;
          sort_order?: number;
          is_enabled?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          client_name: string;
          role: string;
          company: string;
          avatar_url: string | null;
          testimonial: string;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_name: string;
          role: string;
          company: string;
          avatar_url?: string | null;
          testimonial: string;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_name?: string;
          role?: string;
          company?: string;
          avatar_url?: string | null;
          testimonial?: string;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      career_entries: {
        Row: {
          id: string;
          year: string;
          title: string;
          description: string;
          image_url: string | null;
          company: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          year: string;
          title: string;
          description: string;
          image_url?: string | null;
          company?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          year?: string;
          title?: string;
          description?: string;
          image_url?: string | null;
          company?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      social_links: {
        Row: {
          id: string;
          platform: string;
          label: string;
          url: string;
          sort_order: number;
          is_enabled: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          platform: string;
          label: string;
          url: string;
          sort_order?: number;
          is_enabled?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          platform?: string;
          label?: string;
          url?: string;
          sort_order?: number;
          is_enabled?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: string;
          owner_name: string;
          professional_title: string;
          profile_image_url: string | null;
          about_headline: string;
          about_description: string;
          calendly_url: string;
          behance_url: string;
          contact_email: string;
          linkedin_url: string | null;
          skills_list: string[];
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_name?: string;
          professional_title?: string;
          profile_image_url?: string | null;
          about_headline?: string;
          about_description?: string;
          calendly_url?: string;
          behance_url?: string;
          contact_email?: string;
          linkedin_url?: string | null;
          skills_list?: string[];
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_name?: string;
          professional_title?: string;
          profile_image_url?: string | null;
          about_headline?: string;
          about_description?: string;
          calendly_url?: string;
          behance_url?: string;
          contact_email?: string;
          linkedin_url?: string | null;
          skills_list?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          project_description: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          project_description: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          project_description?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      project_status: ProjectStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
