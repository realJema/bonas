
export default function EditorSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Toolbar Skeleton */}
      <div className="h-10 border border-gray-200 rounded-t-md bg-gray-50 flex items-center px-2 space-x-1">
        {/* Toolbar buttons */}
        <div className="flex space-x-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-8 h-6 bg-gray-200 rounded" />
          ))}
        </div>
        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-2" />
        {/* More buttons */}
        <div className="flex space-x-1">
          {[...Array(4)].map((_, i) => (
            <div key={i + 8} className="w-8 h-6 bg-gray-200 rounded" />
          ))}
        </div>
      </div>

      {/* Editor Area Skeleton */}
      <div className="border border-t-0 border-gray-200 rounded-b-md p-4">
        {/* Text lines */}
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 rounded"
              style={{ width: `${Math.random() * 30 + 70}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}