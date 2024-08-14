import React from "react";
import BreadCrumbs from "./BreadCrumbs";

interface Props {
  params: { mainCategory: string; subCategory: string };
}

const page = ({ params: { mainCategory, subCategory } }: Props) => {
  return (
    <div>
      <BreadCrumbs title={mainCategory}/>
        <h3 className="font-extrabold text-2xl capitalize">{subCategory}</h3>

        
    </div>
  );
};

export default page;
