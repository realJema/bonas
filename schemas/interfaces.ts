export interface ListingFormData {
  title: string;
  description: string;
  profileImage?: string;
  price: number;
  currency?: string;
  town: string;
  address: string;
  timeline?: string;
  subcategory_id: number;
  condition?: string;
  negotiable?: boolean;
  delivery_available?: boolean;
  tags?: string[];
  status?: string;
  listingImages?: string[];
}
