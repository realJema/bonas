import { ComponentType } from "react";
import { SlideItem } from "../components/premiumContent/premiumCard";

export default interface RealEstate {
  title: string;
  slides: SlideItem[];
  name: string;
  profileImgUrl: string;
  price: number;
  rating: number;
  Badge: ComponentType;
  offersVideo: boolean;
}
