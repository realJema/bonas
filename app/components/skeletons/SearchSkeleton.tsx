export const SearchSkeleton = () => {
  return (
    <div className="space-y-2 p-1">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
          <div className="h-12 w-12 bg-gray-200 rounded-md" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
};
