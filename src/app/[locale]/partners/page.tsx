'use client';

import React, { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  CheckIcon,
  ArrowTopRightOnSquareIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

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
    name: "Ionos",
    description: "Professional web hosting with enterprise-grade security and performance for your business website. Reliable uptime, fast servers, and excellent customer support.",
    url: "https://acn.ionos.com/aff_c?offer_id=1&aff_id=10824",
    tags: ["Web Hosting", "Domains", "SSL Certificates", "Cloud"],
    image: "/marketing.jpeg",
    icon: "🌐",
    location: "Global",
  },
  {
    id: 2,
    name: "iPostal1",
    description: "Virtual mailbox service that gives your business a professional US address with mail scanning and forwarding. Perfect for remote businesses and entrepreneurs.",
    url: "https://ipostal1.com/?ref=7070",
    tags: ["Virtual Mailbox", "Mail Forwarding", "Business Address"],
    image: "/formacion.jpeg",
    icon: "📮",
    location: "United States",
  },
  {
    id: 3,
    name: "CorpNet",
    description: "Professional business formation services with expert guidance to handle all your incorporation paperwork. LLC, Corporation, and more.",
    url: "http://www.corpnet.com/?PID=26466",
    tags: ["LLC Formation", "Incorporation", "Registered Agent", "Compliance"],
    image: "/marketing.jpeg",
    icon: "🏢",
    location: "United States",
  }
];

// Get all unique tags
const allTags = ["Todas", ...Array.from(new Set(partners.flatMap((p) => p.tags)))];

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
          <span className={value === "Todas" ? "text-gray-500" : "text-gray-900 dark:text-gray-100 font-medium"}>
            {value === "Todas" ? placeholder : value}
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
                placeholder="Buscar..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100 placeholder-gray-500"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">No hay resultados</div>
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
        setIsTruncated(textRef.current.scrollHeight > textRef.current.clientHeight);
      }
    };
    
    checkTruncation();
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
          {isExpanded ? '← Leer menos' : 'Leer más →'}
        </button>
      )}
    </div>
  );
}

export default function PartnersPage() {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("Todas");
  const [showFilters, setShowFilters] = useState(false);
  
  const [pendingTag, setPendingTag] = useState<string>("Todas");

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
      const matchTag = selectedTag === "Todas" || p.tags.includes(selectedTag);
      return matchSearch && matchTag;
    });
  }, [search, selectedTag]);

  const clearAll = () => {
    setSearch("");
    setSelectedTag("Todas");
    setPendingTag("Todas");
  };

  const applyFilters = () => {
    setSelectedTag(pendingTag);
  };

  const hasActiveFilters = search || selectedTag !== "Todas";
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
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="relative w-full sm:flex-1 sm:max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search partners, services..."
                className="w-full pl-12 pr-4 py-3.5 text-base bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
              />
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Search</span>
            </button>

            <button
              onClick={() => setShowFilters((s) => !s)}
              className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] ${
                showFilters
                  ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-2 border-indigo-300 dark:border-indigo-700"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
              }`}
            >
              <FunnelIcon className="h-5 w-5" />
              <span className="hidden sm:inline">{showFilters ? "Hide" : "Filters"}</span>
              {selectedTag !== "Todas" && (
                <span className="flex items-center justify-center w-5 h-5 text-xs font-bold bg-indigo-600 text-white rounded-full">
                  1
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Clear</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="group rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Image container with 3:2 aspect ratio */}
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              
              <div className="p-5">
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                  {p.name}
                </h3>
                
                {/* Description */}
                <ExpandableDescription text={p.description} />

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                    >
                      <TagIcon className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer: Visit Link */}
                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-end">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Visit Partner
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  </a>
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
