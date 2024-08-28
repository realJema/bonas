import { PropsWithChildren } from "react";
import Masonry from "react-masonry-css";


const DropdownMasonry = ({ children }: PropsWithChildren) => {
  return (
    <Masonry
      breakpointCols={{
        default: 4,
        1100: 3,
        700: 2,
        500: 1,
      }}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {children}
    </Masonry>
  );
};

export default DropdownMasonry;
