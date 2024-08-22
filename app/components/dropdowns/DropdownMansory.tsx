import { PropsWithChildren } from "react";
import Masonry from "react-masonry-css";


const DropdownMasonry = ({ children }: PropsWithChildren) => {
  return (
    <Masonry
      breakpointCols={{
        default: 5,
        1100: 4,
        700: 3,
        500: 2,
      }}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {children}
    </Masonry>
  );
};

export default DropdownMasonry;
