'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Cliente {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  categoria: string;
  industria: string;
  tags: string[];
  año: string;
}

// Data structure for categories and their related industries
const categoriasIndustrias = {
  'Desarrollo Web': ['E-commerce', 'Plataformas Educativas', 'Fintech', 'SaaS'],
  'Diseño UX/UI': ['Apps Móviles', 'Dashboards', 'E-commerce', 'Productos Digitales'],
  'Marketing Digital': ['Retail', 'B2B', 'Startups', 'Servicios Profesionales'],
  'Consultoría IT': ['Tecnología', 'Salud', 'Finanzas', 'Educación'],
};

// Sample clients data
const clientesData: Cliente[] = [
  {
    id: 1,
    nombre: "TechFlow Solutions",
    descripcion: "Plataforma de gestión empresarial con integración IoT",
    imagen: "/images/tech-flow.jpg",
    categoria: "Desarrollo Web",
    industria: "SaaS",
    tags: ["React", "Node.js", "AWS", "IoT"],
    año: "2023"
  },
  {
    id: 2,
    nombre: "EduLearn Platform",
    descripcion: "Sistema de aprendizaje en línea adaptativo",
    imagen: "/images/edu-learn.jpg",
    categoria: "Desarrollo Web",
    industria: "Plataformas Educativas",
    tags: ["Next.js", "Machine Learning", "EdTech"],
    año: "2023"
  },
  // Add more clients here...
];

export default function ClientesPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [filteredClients, setFilteredClients] = useState(clientesData);
  const [searchTerm, setSearchTerm] = useState('');

  // Get available industries based on selected category
  const availableIndustries = selectedCategory 
    ? categoriasIndustrias[selectedCategory as keyof typeof categoriasIndustrias] 
    : [];

  useEffect(() => {
    const filtered = clientesData.filter(client => {
      const matchesCategory = !selectedCategory || client.categoria === selectedCategory;
      const matchesIndustry = !selectedIndustry || client.industria === selectedIndustry;
      const matchesSearch = !searchTerm || 
        client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesCategory && matchesIndustry && matchesSearch;
    });

    setFilteredClients(filtered);
  }, [selectedCategory, selectedIndustry, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Nuestro Portfolio
          </h1>
          <p className="text-xl text-gray-600">
            Descubre algunos de nuestros proyectos más destacados
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Buscar Proyecto
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nombre o tecnología..."
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute right-3 top-2.5 text-gray-400">
                  🔍
                </span>
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Categoría
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedIndustry(''); // Reset industry when category changes
                }}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">Todas las categorías</option>
                {Object.keys(categoriasIndustrias).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Industry Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Industria
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                disabled={!selectedCategory}
              >
                <option value="">Todas las industrias</option>
                {availableIndustries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClients.map(client => (
              <motion.div
                key={client.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={client.imagen}
                    alt={client.nombre}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {client.nombre}
                    </h3>
                    <span className="text-sm text-gray-500">{client.año}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {client.descripcion}
                  </p>

                  <div className="space-y-3">
                    {client.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {client.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{client.categoria}</span>
                      <span className="text-gray-500">{client.industria}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No se encontraron proyectos
            </h3>
            <p className="text-gray-500">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        )}           
      </div>
    </div>
  );
}