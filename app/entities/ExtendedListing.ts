export interface ExtendedListing {
  id: string;
  title: string | null;
  description: string | null;
  subcategory_id: string | null;
  price: string | null;
  currency: string | null;
  timeline: string | null;
  town: string | null;
  address: string | null;
  user_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  expiry_date: string | null;
  status: string | null;
  views: string | null;
  cover_image: string | null;
  images: Array<{ imageUrl: string }> | null;
  is_boosted: string | null;
  is_boosted_type: string | null;
  is_boosted_expiry_date: string | null;
  tags: string[] | null;
  condition: string | null;
  negotiable: string | null;
  delivery_available: string | null;
  rating: string | null;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    profilePicture: string | null;
    profilImage: string | null;
    image: string | null;
  } | null;
}
