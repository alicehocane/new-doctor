
export interface RawDoctorRecord {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  license: string;
  cities: string[];
  contact: {
    phones: string[];
    locations: Array<{
      clinic_name: string;
      address: string;
      map_url: string;
    }>;
  };
  medical_info: {
    sub_specialties: string[];
    diseases_treated: string[];
  };
  // Raw JSON might still have SEO, but we won't store it
  seo?: {
    meta_title: string;
    meta_description: string;
    keywords: string;
  };
  schema_json_ld?: any;
}

// Matching the provided "Hybrid Model" TypeScript definition
export type Doctor = {
  id: string; // UUID
  // external_id removed
  slug: string;
  full_name: string;
  
  // Searchable Arrays
  specialties: string[];
  cities: string[];
  license_numbers: string[];
  
  // Typed JSON objects
  contact_info: {
    phones: string[];
    locations: Array<{
      clinic_name: string;
      address: string;
      map_url: string;
    }>;
  };
  
  medical_profile: {
    sub_specialties: string[];
    diseases_treated: string[];
  };
  
  // Removed redundant JSONB columns (seo_metadata, schema_data)
  
  created_at: string;
  updated_at: string;
};

export interface City {
  id: number;
  name: string;
  slug: string;
  is_featured: boolean;
  health_data: {
    overview: string;
    hospitals: string[];
    transport: string;
  } | string; // Handle potential stringified JSON from certain RPCs or raw queries
}

export interface Disease {
  id: number;
  name: string;
  slug: string;
  symptoms: string | string[]; // Can be JSON string or parsed array
  causes: string | string[];   // Can be JSON string or parsed array
  category: string; // e.g. "common"
  created_at: string;
}

export interface Specialty {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_popular: boolean;
  first_visit_guide?: string;
  procedures?: string | string[]; // JSON string or parsed array
  comparison_guide?: string | { title: string; text: string }; // JSON string or parsed object
  created_at: string;
}

// The payload sent to Supabase (omitting generated fields like id and created_at)
export type DoctorUpsertPayload = Omit<Doctor, 'id' | 'created_at'>;

export type UploadStatus = 'idle' | 'uploading' | 'completed' | 'error';

export interface LogEntry {
  slug: string;
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  author_role: string;
  image_url?: string;
  read_time: string;
  published_at: string;
  created_at?: string;
}
