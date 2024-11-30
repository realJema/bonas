// schemas/interfaces.ts

interface Category {
  id: number;
  name: string;
  description: string | null;
  parentId: number | null;
}
export interface ListingFormData {
  title: string;
  description: string;
  cover_image: string;
  price: number;
  currency?: string;
  town: string;
  address: string;
  deadline?: Date;
  subcategory_id: number;
  mainCategory?: Category;
  subCategory?: Category;
  condition?: string;
  negotiable?: boolean;
  delivery_available?: boolean;
  tags?: string[];
  status?: string;
  listingImages?: string[];
  categoryPath?: string[];
  listingId?: string;
}

// This is how you can extend the schema to also describe the API response
export interface ListingResponse extends ListingFormData {
  id: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    username: string | null;
    profilImage: string | null;
  };
}
