export interface ListingFormData {
  title: string;
  description: string;
  profileImage?: string;
  category: string;
  price: string;
  subcategory?: string;
  subSubcategory?: string;
  location?: string;
  timeline?: string;
  budget: string;
  address: string;
  town: string;
  listingImages?: string[];
}
