import { ComponentType } from "react";

// Define SlideItem type
export interface SlideItem {
  type: "image" | "video";
  url: string;
  thumbnail?: string;
}

export default interface premiumContent {
  title: string;
  slides: SlideItem[];
  name: string;
  profileImgUrl: string;
  price: number;
  rating: number;
  Badge: ComponentType;
  offersVideo: boolean;
}