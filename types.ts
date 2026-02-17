
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
  seo: {
    meta_title: string;
    meta_description: string;
    keywords: string;
  };
  schema_json_ld: any;
}

// Normalized Database Types
export type Doctor = {
  id: string; // UUID
  external_id: string | null;
  slug: string;
  full_name: string;
  
  // These are now populated via JOINs or transformation in the UI layer
  specialties: string[];
  cities: string[];
  
  license_numbers: string[];
  
  // Typed JSON objects
  contact_info: {
    phones: string[];
    locations: Array<{
      clinic_name: string;
      address: string;
      map_url?: string; // Optional in some records
    }>;
  };
  
  medical_profile: {
    sub_specialties: string[];
    diseases_treated: string[];
  };
  
  seo_metadata: {
    meta_title: string;
    meta_description: string;
    keywords: string;
  };
  
  schema_data: Record<string, any>;
  
  created_at: string;
  updated_at: string;
  
  // Optional relations for initial fetch
  doctor_cities?: { cities: { name: string } }[];
  doctor_specialties?: { specialties: { name: string } }[];
};

// The payload sent to Supabase (omitting generated fields like id and created_at)
export type DoctorUpsertPayload = Omit<Doctor, 'id' | 'created_at' | 'doctor_cities' | 'doctor_specialties'>;

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
