import React from "react";
import DropdownWrapper from "./DropdownWrapper";
import DropdownMasonry from "./DropdownMansory";
import DropdownLink from "./DropdownLink";
import { Category } from "@prisma/client";
import { getCategoryUrl } from "@/utils/categoryUtils";

type CategoryWithChildren = Category & {
  children: (Category & {
    children: Category[];
  })[];
};

interface HeaderDropdownProps {
  mainCategory: CategoryWithChildren;
  onItemClick: (url: string) => void;
}

const HeaderDropdown = ({ mainCategory, onItemClick }: HeaderDropdownProps) => {
  return (
    <DropdownWrapper>
      <DropdownMasonry>
        {mainCategory.children.map((subcategory) => {
          const subcategoryUrl = getCategoryUrl(
            mainCategory.name,
            subcategory.name
          );

          return (
            <div key={subcategory.id} className="mb-6">
              <h3 className="font-bold text-gray-900 mb-1">
                <DropdownLink
                  href={subcategoryUrl}
                  onClick={(e) => {
                    e.preventDefault();
                    onItemClick(subcategoryUrl);
                  }}
                >
                  {subcategory.name}
                </DropdownLink>
              </h3>
              <div>
                {subcategory.children && subcategory.children.length > 0 ? (
                  subcategory.children.map((subSubcategory) => {
                    const subSubcategoryUrl = getCategoryUrl(
                      mainCategory.name,
                      subcategory.name,
                      subSubcategory.name
                    );

                    return (
                      <DropdownLink
                        key={subSubcategory.id}
                        href={subSubcategoryUrl}
                        onClick={(e) => {
                          e.preventDefault();
                          onItemClick(subSubcategoryUrl);
                        }}
                      >
                        {subSubcategory.name}
                      </DropdownLink>
                    );
                  })
                ) : (
                  <span className="text-gray-500">No subcategories</span>
                )}
              </div>
            </div>
          );
        })}
      </DropdownMasonry>
    </DropdownWrapper>
  );
};

export default HeaderDropdown;

// import React from "react";
// import DropdownWrapper from "./DropdownWrapper";
// import DropdownMasonry from "./DropdownMansory";
// import DropdownLink from "./DropdownLink";
// import { Category } from "@prisma/client";

// type CategoryWithChildren = Category & {
//   children: (Category & {
//     children: Category[];
//   })[];
// };

// interface HeaderDropdownProps {
//   mainCategory: CategoryWithChildren;
//   onItemClick: (url: string) => void;
// }

// const HeaderDropdown = ({ mainCategory, onItemClick }: HeaderDropdownProps) => {
//   return (
//     <DropdownWrapper>
//       <DropdownMasonry>
//         {mainCategory.children.map((subcategory) => (
//           <div key={subcategory.id} className="mb-6">
//             <h3 className="font-bold text-gray-900 mb-1">
//               <DropdownLink
//                 href={`/categories/${encodeURIComponent(
//                   mainCategory.name.toLowerCase()
//                 )}/${encodeURIComponent(subcategory.name.toLowerCase())}`}
//                 onClick={(e) => {
//                   e.preventDefault();
//                   onItemClick(
//                     `/categories/${encodeURIComponent(
//                       mainCategory.name.toLowerCase()
//                     )}/${encodeURIComponent(subcategory.name.toLowerCase())}`
//                   );
//                 }}
//               >
//                 {subcategory.name}
//               </DropdownLink>
//             </h3>
//             <div>
//               {subcategory.children && subcategory.children.length > 0 ? (
//                 subcategory.children.map((subSubcategory) => (
//                   <DropdownLink
//                     key={subSubcategory.id}
//                     href={`/categories/${encodeURIComponent(
//                       mainCategory.name.toLowerCase()
//                     )}/${encodeURIComponent(
//                       subcategory.name.toLowerCase()
//                     )}/${encodeURIComponent(
//                       subSubcategory.name.toLowerCase()
//                     )}`}
//                     onClick={(e) => {
//                       e.preventDefault();
//                       onItemClick(
//                         `/categories/${encodeURIComponent(
//                           mainCategory.name.toLowerCase()
//                         )}/${encodeURIComponent(
//                           subcategory.name.toLowerCase()
//                         )}/${encodeURIComponent(
//                           subSubcategory.name.toLowerCase()
//                         )}`
//                       );
//                     }}
//                   >
//                     {subSubcategory.name}
//                   </DropdownLink>
//                 ))
//               ) : (
//                 <span className="text-gray-500">No subcategories</span>
//               )}
//             </div>
//           </div>
//         ))}
//       </DropdownMasonry>
//     </DropdownWrapper>
//   );
// };

// export default HeaderDropdown;
