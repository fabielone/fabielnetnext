/* eslint-disable @stylistic/quotes */
'use client';

import React, { useMemo, useState, useRef, useEffect } from "react";
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

type Mode = "Online" | "Presencial" | "Híbrido";

type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  tech: string[];
  location: string; // Country/City
  mode: Mode;
  website?: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: "TechFlow Solutions",
    description: "Soluciones tecnológicas y SaaS a medida.",
    image: "/marketing.jpeg",
    category: "Tecnología",
    tech: ["React", "Next.js", "SaaS"],
    location: "México · CDMX",
    mode: "Online",
    website: "https://techflow.com",
  },
  {
    id: 2,
    title: "Sabor Latino Catering",
    description: "Catering con auténticos sabores latinoamericanos.",
    image: "/formacion.jpeg",
    category: "Alimentación",
    tech: ["Branding", "Eventos"],
    location: "Colombia · Medellín",
    mode: "Presencial",
    website: "https://saborlatino.com",
  }
];

const categories = ["Todas", ...Array.from(new Set(projects.map((p) => p.category)))];
const locations = ["Todas", ...Array.from(new Set(projects.map((p) => p.location)))];
const modes: ("Todas" | Mode)[] = ["Todas", "Online", "Presencial", "Híbrido"];
const techs = [
  "React",
  "Next.js",
  "SaaS",
  "Branding",
  "Eventos",
  "SEO",
  "Ads",
  "Estrategia",
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
          {isExpanded ? '← Leer menos' : 'Leer más →'}
        </button>
      )}
    </div>
  );
}

export default function AlliesShowcasePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("Todas");
  const [location, setLocation] = useState<(typeof locations)[number]>("Todas");
  const [mode, setMode] = useState<(typeof modes)[number]>("Todas");
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pending filter states (applied only when clicking "Apply")
  const [pendingCategory, setPendingCategory] = useState<(typeof categories)[number]>("Todas");
  const [pendingLocation, setPendingLocation] = useState<(typeof locations)[number]>("Todas");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tech.some((t) => t.toLowerCase().includes(q)) ||
        p.location.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.website && p.website.toLowerCase().includes(q)) ||
        p.image.toLowerCase().includes(q);
      const matchCategory = category === "Todas" || p.category === category;
      const matchLocation = location === "Todas" || p.location === location;
      const matchMode = mode === "Todas" || p.mode === mode;
      const matchTechs =
        selectedTechs.length === 0 || selectedTechs.every((t) => p.tech.includes(t));
      return matchSearch && matchCategory && matchLocation && matchMode && matchTechs;
    });
  }, [search, category, location, mode, selectedTechs]);

  const clearAll = () => {
    setSearch("");
    setCategory("Todas");
    setLocation("Todas");
    setMode("Todas");
    setSelectedTechs([]);
    setPendingCategory("Todas");
    setPendingLocation("Todas");
  };

  const applyFilters = () => {
    setCategory(pendingCategory);
    setLocation(pendingLocation);
  };

  const hasActiveFilters = search || category !== "Todas" || location !== "Todas" || mode !== "Todas" || selectedTechs.length > 0;
  const hasPendingChanges = pendingCategory !== category || pendingLocation !== location;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero - Compact */}
      <section className="relative bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
          <div className="text-center">
            {/* Title with inline gradient */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Portafolio
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"> y Aliados</span>
            </h1>
            
            {/* Subtitle */}
            <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Explora proyectos destacados. Filtra por categoría, ubicación o tecnologías.
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
                placeholder="Buscar..."
                className="w-full pl-9 sm:pl-11 pr-3 py-2.5 sm:py-3 text-sm sm:text-base bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
              />
            </div>

            {/* Search Button */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 flex-shrink-0"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
              <span className="hidden sm:inline sm:ml-2">Buscar</span>
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
              <span className="hidden sm:inline sm:ml-2">{showFilters ? "Ocultar" : "Filtros"}</span>
              {hasActiveFilters && (
                <span className="ml-1 flex items-center justify-center w-5 h-5 text-xs font-bold bg-indigo-600 text-white rounded-full">
                  {[category !== "Todas", location !== "Todas", mode !== "Todas", selectedTechs.length > 0].filter(Boolean).length}
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
                    Ubicación
                  </label>
                  <SearchableDropdown
                    options={locations}
                    value={pendingLocation}
                    onChange={setPendingLocation}
                    placeholder="Seleccionar ubicación"
                    icon={<MapPinIcon className="h-4 w-4" />}
                  />
                </div>

                {/* Category Dropdown */}
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    <FunnelIcon className="inline h-4 w-4 mr-1" />
                    Categoría
                  </label>
                  <SearchableDropdown
                    options={categories}
                    value={pendingCategory}
                    onChange={setPendingCategory}
                    placeholder="Seleccionar categoría"
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
                    Aplicar
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
              {/* Image container with 3:2 aspect ratio (600x400) */}
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                {/* Category badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 text-gray-800 dark:text-gray-200">
                  {p.category}
                </div>
              </div>
              
              <div className="p-5">
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                  {p.title}
                </h3>
                
                {/* Description with 3 lines max and read more */}
                <ExpandableDescription text={p.description} />

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                    >
                      <TagIcon className="h-3 w-3" />
                      {t}
                    </span>
                  ))}
                </div>

                {/* Footer: Location & Link */}
                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between text-sm">
                  <div className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{p.location}</span>
                  </div>
                  {p.website && (
                    <a
                      href={p.website}
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

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <FunnelIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h4 className="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
              No hay resultados
            </h4>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Ajusta los filtros para ver más proyectos.</p>
            <button
              onClick={clearAll}
              className="mt-6 px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/join"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold hover:from-indigo-700 hover:to-blue-700 shadow"
          >
            ¿Quieres unirte a la red?
          </Link>
        </div>
      </main>
    </div>
  );
}