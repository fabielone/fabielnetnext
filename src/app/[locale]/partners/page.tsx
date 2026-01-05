'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  CheckIcon,
  ArrowTopRightOnSquareIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

interface Partner {
  id: number;
  name: string;
  description: string;
  url: string;
  tags: string[]; // Products/services they offer
  image: string;
  icon: string;
  location?: string;
}

const partners: Partner[] = [
  {
    id: 1,
    name: 'Ionos',
    description: 'Professional web hosting with enterprise-grade security and performance for your business website. Reliable uptime, fast servers, and excellent customer support.',
    url: 'https://acn.ionos.com/aff_c?offer_id=1&aff_id=10824',
    tags: ['Web Hosting', 'Domains', 'SSL Certificates', 'Cloud'],
    image: '/marketing.jpeg',
    icon: '🌐',
    location: 'Global',
  },
  {
    id: 2,
    name: 'iPostal1',
    description: 'Virtual mailbox service that gives your business a professional US address with mail scanning and forwarding. Perfect for remote businesses and entrepreneurs.',
    url: 'https://ipostal1.com/?ref=7070',
    tags: ['Virtual Mailbox', 'Mail Forwarding', 'Business Address'],
    image: '/formacion.jpeg',
    icon: '📮',
    location: 'United States',
  },
  {
    id: 3,
    name: 'CorpNet',
    description: 'Professional business formation services with expert guidance to handle all your incorporation paperwork. LLC, Corporation, and more.',
    url: 'http://www.corpnet.com/?PID=26466',
    tags: ['LLC Formation', 'Incorporation', 'Registered Agent', 'Compliance'],
    image: '/marketing.jpeg',
    icon: '🏢',
    location: 'United States',
  }
];

// Get all unique tags
const allTags = ['All', ...Array.from(new Set(partners.flatMap((p) => p.tags)))];

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
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
          <span className={value === 'All' ? 'text-gray-500' : 'text-gray-900 dark:text-gray-100 font-medium'}>
            {value === 'All' ? placeholder : value}
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
                    setSearchQuery('');
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

export default function PartnersPage() {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  
  const [pendingTag, setPendingTag] = useState<string>('All');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return partners.filter((p) => {
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q)) ||
        p.url.toLowerCase().includes(q);
      const matchTag = selectedTag === 'All' || p.tags.includes(selectedTag);
      return matchSearch && matchTag;
    });
  }, [search, selectedTag]);

  const clearAll = () => {
    setSearch('');
    setSelectedTag('All');
    setPendingTag('All');
  };

  const applyFilters = () => {
    setSelectedTag(pendingTag);
  };

  const hasActiveFilters = search || selectedTag !== 'All';
  const hasPendingChanges = pendingTag !== selectedTag;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero - Compact */}
      <section className="relative bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Trusted
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"> Partners</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Carefully selected services to help grow your business.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Search Bar + Search Button + Filter Toggle - Always in one line */}
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
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-2 border-indigo-300 dark:border-indigo-700'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
              }`}
            >
              <FunnelIcon className="h-5 w-5" />
              <span className="hidden sm:inline sm:ml-2">{showFilters ? 'Hide' : 'Filters'}</span>
              {selectedTag !== 'All' && (
                <span className="ml-1 flex items-center justify-center w-5 h-5 text-xs font-bold bg-indigo-600 text-white rounded-full">
                  1
                </span>
              )}
            </button>

            {/* Clear Button */}
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="inline-flex items-center justify-center p-2.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex-shrink-0"
                title="Clear"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mt-5 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/80 rounded-2xl p-5 border border-gray-200/80 dark:border-gray-700/80">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                      <TagIcon className="inline h-4 w-4 mr-1" />
                      Service
                    </label>
                    <SearchableDropdown
                      options={allTags}
                      value={pendingTag}
                      onChange={setPendingTag}
                      placeholder="Select service"
                      icon={<TagIcon className="h-4 w-4" />}
                    />
                  </div>

                  <div className="flex-shrink-0">
                    <button
                      onClick={applyFilters}
                      disabled={!hasPendingChanges}
                      className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        hasPendingChanges
                          ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02]'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="group flex flex-row gap-4 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300"
            >
              {/* Small Icon/Image */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 border border-indigo-200/50 dark:border-indigo-700/30 flex items-center justify-center text-3xl shadow-sm group-hover:scale-105 transition-transform duration-300">
                  {p.icon}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Header with title and link */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                      {p.name}
                    </h3>
                    {p.location && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">{p.location}</span>
                    )}
                  </div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                    aria-label={`Visit ${p.name}`}
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  </a>
                </div>
                
                {/* Description */}
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                  {p.description}
                </p>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50"
                    >
                      {tag}
                    </span>
                  ))}
                  {p.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      +{p.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <FunnelIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h4 className="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
              No results found
            </h4>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Try adjusting your filters to see more partners.</p>
            <button
              onClick={clearAll}
              className="mt-6 px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-16 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            We may receive compensation when you use services through our partner links. 
            This helps us continue providing free resources while recommending only services we trust and use ourselves.
          </p>
        </div>
      </main>
    </div>
  );
}
