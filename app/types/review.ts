// types/review.ts
export interface User {
  name: string; // Changed from string | null
  image: string; // Changed from string | null
}

export interface Review {
  id: number;
  listingId: bigint;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  parentId?: number | undefined; 
  user: User;
  _count?: {
    replies: number;
  };
  replies?: Review[];
}

export interface ReviewFormData {
  listingId: bigint;
  rating: number;
  comment: string;
  parentId?: number;
}
