/* eslint-disable @stylistic/quotes */
'use client';

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  GlobeAltIcon,
  MapPinIcon,
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

export default function AlliesShowcasePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("Todas");
  const [mode, setMode] = useState<(typeof modes)[number]>("Todas");
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tech.some((t) => t.toLowerCase().includes(q));
      const matchCategory = category === "Todas" || p.category === category;
      const matchMode = mode === "Todas" || p.mode === mode;
      const matchTechs =
        selectedTechs.length === 0 || selectedTechs.every((t) => p.tech.includes(t));
      return matchSearch && matchCategory && matchMode && matchTechs;
    });
  }, [search, category, mode, selectedTechs]);

  const clearAll = () => {
    setSearch("");
    setCategory("Todas");
    setMode("Todas");
    setSelectedTechs([]);
  };

  const toggleTech = (t: string) => {
    setSelectedTechs((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 text-white">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Portafolio y aliados
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Explora proyectos destacados. Filtra por categoría, modalidad o tecnologías.
          </p>
        </div>
      </section>

      {/* Filters bar */}
      <div className="sticky top-0 z-30 border-b border-gray-200/70 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <div className="relative w-full sm:max-w-md">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar proyectos, tecnologías..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={() => setShowFilters((s) => !s)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
          >
            <FunnelIcon className="h-5 w-5" />
            {showFilters ? "Ocultar filtros" : "Ver filtros"}
          </button>

          {(search || category !== "Todas" || mode !== "Todas" || selectedTechs.length) && (
            <button
              onClick={clearAll}
              className="ml-auto inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <XMarkIcon className="h-4 w-4" /> Limpiar
            </button>
          )}
        </div>

        {showFilters && (
          <div className="border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Modalidad</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as any)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  {modes.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Tecnologías</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {techs.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleTech(t)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition ${
                        selectedTechs.includes(t)
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="group rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition"
            >
              <div className="relative h-48">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs bg-white/90 dark:bg-gray-900/70 border border-gray-200/60 dark:border-gray-700/60 text-gray-800 dark:text-gray-200">
                  {p.mode}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{p.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between text-sm">
                  <div className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <MapPinIcon className="h-4 w-4" /> {p.location}
                  </div>
                  {p.website && (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <GlobeAltIcon className="h-4 w-4" /> Web
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