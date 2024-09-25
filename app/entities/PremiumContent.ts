import { ComponentType } from "react";
import { SlideItem } from "../components/ItemCard";


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