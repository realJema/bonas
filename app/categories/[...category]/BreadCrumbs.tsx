import React from "react";

interface Props {
  mainCategory: string;
  subCategory?: string;
  subSubCategory?: string;
}

const BreadCrumbs = ({ mainCategory, subCategory, subSubCategory }: Props) => {
  return (
    <div className="py-5 font-medium text-xl mb-2 flex items-center">
      {!subCategory && (
        <svg
          width="13"
          height="12"
          viewBox="0 0 13 12"
          fill="none"
          className="inline-block opacity-85 size-4 mr-2"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5521 11.7794H2.38575C2.23111 11.7794 2.0828 11.718 1.97337 11.6088C1.86395 11.4995 1.80236 11.3513 1.80212 11.1966V5.94663H0.052124L6.07737 0.46826C6.18479 0.370682 6.3247 0.31662 6.46981 0.31662C6.61493 0.31662 6.75484 0.370682 6.86225 0.46826L12.8866 5.94576H11.1366V11.1958C11.1364 11.3504 11.0748 11.4986 10.9654 11.6079C10.8559 11.7171 10.7076 11.7785 10.553 11.7785L10.5521 11.7794ZM7.05212 10.613H9.96937V4.87126L6.46937 1.68976L2.96937 4.87126V10.613H5.88575V7.11301H7.05212V10.613Z"
            fill="#404145"
          />
        </svg>
      )}
      <span className="capitalize">
        {mainCategory}
        {subCategory && (
          <>
            <span className="mx-2">/</span>
            {subCategory} / {subSubCategory}
          </>
        )}
      </span>
    </div>
  );
};

export default BreadCrumbs;
