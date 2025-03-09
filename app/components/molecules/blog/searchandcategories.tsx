// components/blog/SearchAndCategories.tsx
interface SearchAndCategoriesProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    categories: string[];
  }
  
  export default function  SearchAndCategories({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories
  }: SearchAndCategoriesProps) {
    return (
      <div className="mb-8 sm:mb-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full lg:w-96">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full px-4 py-2.5 pl-10 pr-4 rounded-lg border border-gray-200 
                       focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none 
                       transition-colors text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
  
          {/* Categories */}
          <div className="relative">
            {/* Mobile Dropdown */}
            <div className="lg:hidden">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
                         focus:border-gray-500 focus:ring-1 focus:ring-gray-500 
                         focus:outline-none appearance-none bg-white text-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
  
            {/* Desktop Categories */}
            <div className="hidden lg:flex lg:items-center lg:gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${selectedCategory === category
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
  
        {/* Active Filters Display */}
        {(searchQuery || selectedCategory !== 'All') && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <span>Active filters:</span>
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100">
                  Search: {searchQuery}
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  