import { Category, Image, Listing, User } from "@prisma/client";

type SerializableListing = Omit<Listing, "price"> & { price: string };

export type ExtendedListing = SerializableListing & {
  category: Category;
  user: User;
  images: Image[];
};
