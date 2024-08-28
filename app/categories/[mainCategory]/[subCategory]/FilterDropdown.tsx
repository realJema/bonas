'use client'
interface FilterItem {
  name: string;
  value: string;
}

interface Props {
  label: string;
  items: FilterItem[];
  id: string;
  className?: string;
}

const FilterDropdown = ({ label, items, id, className = "" }: Props) => {
  return (
    <div className={`hs-dropdown relative inline-flex ${className}`}>
      <button
        id={`hs-dropdown-${id}`}
        type="button"
        className="hs-dropdown-toggle py-3.5 px-4 inline-flex justify-between items-center gap-x-2 text-base font-medium rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 w-full"
        aria-haspopup="menu"
        aria-expanded="false"
        aria-label={`Dropdown ${label}`}
      >
        {label}
        <svg
          className="hs-dropdown-open:rotate-180 size-4"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div
        className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-[15rem] bg-white shadow-md rounded-lg p-1 space-y-0.5 mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full absolute z-10"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby={`hs-dropdown-${id}`}
      >
        {items.map((item, index) => (
          <button
            key={index}
            className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 w-full text-left"
            onClick={() => {
              
              console.log(`Selected ${item.name} (${item.value}) for ${label}`);
            }}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterDropdown;
