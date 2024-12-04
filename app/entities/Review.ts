interface Review {
  id: number;
  userId: string;
  listingId: number;
  rating: number;
  comment: string;
  parentId?: number;
  createdAt: Date;
  user: {
    name: string;
    image: string;
  };
  replies?: Review[];
  _count?: {
    replies: number;
  };
}
