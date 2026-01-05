/* eslint-disable @stylistic/quotes */
'use client';

import React, { Fragment, useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  MapPinIcon,
  ChevronDownIcon,
  CheckIcon,
  ArrowTopRightOnSquareIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

type Business = {
  id: string;
  name: string;
  publicDescription: string | null;
  publicImageUrl: string | null;
  publicCategory: string | null;
  publicTags: string[];
  publicLocation: string | null;
  publicLink: string | null;
};

// Fallback static projects for when there are no DB entries
const fallbackProjects: Business[] = [
  {
    id: "fallback-1",
    name: "TechFlow Solutions",
    publicDescription: "Custom technology and SaaS solutions.",
    publicImageUrl: "/marketing.jpeg",
    publicCategory: "Technology",
    publicTags: ["React", "Next.js", "SaaS"],
    publicLocation: "USA - New York",
    publicLink: "https://techflow.com",
  },
  {
    id: "fallback-2",
    name: "Flavor Kitchen Catering",
    publicDescription: "Premium catering with authentic flavors.",
    publicImageUrl: "/formacion.jpeg",
    publicCategory: "Food & Beverage",
    publicTags: ["Branding", "Events"],
    publicLocation: "USA - Miami",
    publicLink: "https://flavorkitchen.com",
  }
];

// Searchable Dropdown Component
interface SearchableDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
}

function SearchableDropdown({ options, value, onChange, placeholder, icon }: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-left bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-gray-400">{icon}</span>}
          <span className={value === "All" ? "text-gray-500" : "text-gray-900 dark:text-gray-100 font-medium"}>
            {value === "All" ? placeholder : value}
          </span>
        </div>
        <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 border-b border-gray-100 dark:border-gray-700">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100 placeholder-gray-500"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">No results</div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={`flex items-center justify-between w-full px-4 py-2.5 text-sm text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors ${
                    value === opt ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span>{opt}</span>
                  {value === opt && <CheckIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Expandable Description Component
function ExpandableDescription({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        // Check if the text is actually truncated by comparing scrollHeight with clientHeight
        setIsTruncated(textRef.current.scrollHeight > textRef.current.clientHeight);
      }
    };
    
    checkTruncation();
    // Recheck on window resize
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [text]);

  return (
    <div className="mt-2">
      <p 
        ref={textRef}
        className={`text-sm text-gray-600 dark:text-gray-300 leading-relaxed ${!isExpanded ? 'line-clamp-3 min-h-[3.75rem]' : ''}`}
        style={!isExpanded ? { minHeight: '4.5em', maxHeight: '4.5em' } : undefined}
      >
        {text}
      </p>
      {(isTruncated || isExpanded) && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          {isExpanded ? '← Read less' : 'Read more →'}
        </button>
      )}
    </div>
  );
}

export default function AlliesShowcasePage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [locations, setLocations] = useState<string[]>(["All"]);
  
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [location, setLocation] = useState<string>("All");
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 12;
  
  // Pending filter states (applied only when clicking "Apply")
  const [pendingCategory, setPendingCategory] = useState<string>("All");
  const [pendingLocation, setPendingLocation] = useState<string>("All");

  // Fetch businesses from API
  const fetchBusinesses = async (page: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', itemsPerPage.toString());
      if (category !== 'All') params.set('category', category);
      if (location !== 'All') params.set('location', location);
      if (search) params.set('search', search);
      
      const res = await fetch(`/api/public/businesses?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.businesses.length > 0 || data.pagination.totalCount > 0) {
          setBusinesses(data.businesses);
          setCategories(["All", ...data.filters.categories]);
          setLocations(["All", ...data.filters.locations]);
          setTotalPages(data.pagination.totalPages);
          setTotalCount(data.pagination.totalCount);
          setCurrentPage(data.pagination.page);
        } else {
          // Use fallback if no businesses in DB
          setBusinesses(fallbackProjects);
          setTotalPages(1);
          setTotalCount(fallbackProjects.length);
        }
      } else {
          // Use fallback on error
          setBusinesses(fallbackProjects);
          setTotalPages(1);
          setTotalCount(fallbackProjects.length);
        }
      } catch (err) {
        console.error('Failed to fetch businesses:', err);
        setBusinesses(fallbackProjects);
        setTotalPages(1);
        setTotalCount(fallbackProjects.length);
      } finally {
        setLoading(false);
      }
    };

  // Initial fetch
  useEffect(() => {
    fetchBusinesses(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch when filters change
  useEffect(() => {
    fetchBusinesses(1);
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, location, search]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchBusinesses(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearAll = () => {
    setSearch("");
    setCategory("All");
    setLocation("All");
    setSelectedTechs([]);
    setPendingCategory("All");
    setPendingLocation("All");
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setCategory(pendingCategory);
    setLocation(pendingLocation);
  };

  const hasActiveFilters = search || category !== "All" || location !== "All" || selectedTechs.length > 0;
  const hasPendingChanges = pendingCategory !== category || pendingLocation !== location;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero - Compact */}
      <section className="relative bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
          <div className="text-center">
            {/* Title with inline gradient */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Portfolio
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"> & Allies</span>
            </h1>
            
            {/* Subtitle */}
            <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Explore featured projects. Filter by category, location, or technologies.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section - Centered & Stylish */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Line 1: Search Bar + Search Button + Filter Toggle - Always in one line */}
          <div className="flex items-center justify-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 sm:pl-11 pr-3 py-2.5 sm:py-3 text-sm sm:text-base bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
              />
            </div>

            {/* Search Button */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 flex-shrink-0"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
              <span className="hidden sm:inline sm:ml-2">Search</span>
            </button>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters((s) => !s)}
              className={`inline-flex items-center justify-center p-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0 ${
                showFilters
                  ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-2 border-indigo-300 dark:border-indigo-700"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
              }`}
            >
              <FunnelIcon className="h-5 w-5" />
              <span className="hidden sm:inline sm:ml-2">{showFilters ? "Hide" : "Filters"}</span>
              {hasActiveFilters && (
                <span className="ml-1 flex items-center justify-center w-5 h-5 text-xs font-bold bg-indigo-600 text-white rounded-full">
                  {[category !== "All", location !== "All", selectedTechs.length > 0].filter(Boolean).length}
                </span>
              )}
            </button>

            {/* Clear Button */}
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="inline-flex items-center justify-center p-2.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex-shrink-0"
                title="Limpiar"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Line 2: Filter Bar (Collapsible) */}
          {showFilters && (
            <div className="mt-5 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/80 rounded-2xl p-5 border border-gray-200/80 dark:border-gray-700/80">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4">
                {/* Location Dropdown */}
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    <MapPinIcon className="inline h-4 w-4 mr-1" />
                    Location
                  </label>
                  <SearchableDropdown
                    options={locations}
                    value={pendingLocation}
                    onChange={setPendingLocation}
                    placeholder="Select location"
                    icon={<MapPinIcon className="h-4 w-4" />}
                  />
                </div>

                {/* Category Dropdown */}
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    <FunnelIcon className="inline h-4 w-4 mr-1" />
                    Category
                  </label>
                  <SearchableDropdown
                    options={categories}
                    value={pendingCategory}
                    onChange={setPendingCategory}
                    placeholder="Select category"
                    icon={<FunnelIcon className="h-4 w-4" />}
                  />
                </div>

                {/* Apply Button */}
                <div className="flex-shrink-0">
                  <button
                    onClick={applyFilters}
                    disabled={!hasPendingChanges}
                    className={`w-full lg:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      hasPendingChanges
                        ? "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <CheckIcon className="h-5 w-5" />
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((p) => (
            <article
              key={p.id}
              className="group rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Image container with 3:2 aspect ratio (600x400) */}
              <div className="relative aspect-[3/2] overflow-hidden bg-gray-100 dark:bg-gray-700">
                {p.publicImageUrl ? (
                  <Image
                    src={p.publicImageUrl}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-300 dark:text-gray-500">
                      {p.name.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Category badge */}
                {p.publicCategory && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 text-gray-800 dark:text-gray-200">
                    {p.publicCategory}
                  </div>
                )}
              </div>
              
              <div className="p-5">
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                  {p.name}
                </h3>
                
                {/* Description with 3 lines max and read more */}
                {p.publicDescription && (
                  <ExpandableDescription text={p.publicDescription} />
                )}

                {/* Tags */}
                {p.publicTags && p.publicTags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.publicTags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                      >
                        <TagIcon className="h-3 w-3" />
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer: Location & Link */}
                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between text-sm">
                  {p.publicLocation && (
                    <div className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{p.publicLocation}</span>
                    </div>
                  )}
                  {p.publicLink && (
                    <a
                      href={p.publicLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors font-medium text-xs"
                    >
                      Visitar
                      <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {businesses.length} of {totalCount} businesses
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, idx, arr) => (
                    <Fragment key={page}>
                      {idx > 0 && arr[idx - 1] !== page - 1 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        disabled={loading}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          page === currentPage
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {page}
                      </button>
                    </Fragment>
                  ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
          </>
        )}

        {businesses.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <FunnelIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h4 className="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
              No results
            </h4>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Adjust filters to see more projects.</p>
            <button
              onClick={clearAll}
              className="mt-6 px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/join"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold hover:from-indigo-700 hover:to-blue-700 shadow"
          >
            Want to join the network?
          </Link>
        </div>
      </main>
    </div>
  );
}