'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Negocio {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  categoria: string;
  industria: string;
  pais: string;
  estado: string;
  ciudad: string;
  modalidad: 'Presencial' | 'Online' | 'Híbrido';
  tags: string[];
  sitioWeb?: string;
  contacto?: string;
}

// Expanded data structure
const categoriasIndustrias = {
  'Tecnología': ['Software', 'Hardware', 'SaaS', 'Consultoría IT'],
  'Servicios': ['Consultoría', 'Marketing', 'Diseño', 'Educación'],
  'Comercio': ['Retail', 'E-commerce', 'Productos', 'Distribución'],
  'Alimentación': ['Restaurantes', 'Catering', 'Producción', 'Distribución'],
};

// Comprehensive location data
const locationData = {
  'México': {
    estados: ['Ciudad de México', 'Jalisco', 'Nuevo León', 'Monterrey'],
    ciudades: {
      'Ciudad de México': ['CDMX', 'Polanco', 'Condesa'],
      'Jalisco': ['Guadalajara', 'Puerto Vallarta'],
      'Nuevo León': ['Monterrey', 'San Pedro'],
    }
  },
  'Colombia': {
    estados: ['Antioquia', 'Bogotá', 'Valle del Cauca'],
    ciudades: {
      'Antioquia': ['Medellín', 'Envigado'],
      'Bogotá': ['Bogotá D.C.'],
      'Valle del Cauca': ['Cali', 'Palmira']
    }
  },
  'Estados Unidos': {
    estados: ['California', 'Texas', 'Nueva York', 'Florida'],
    ciudades: {
      'California': ['Los Angeles', 'San Francisco', 'San Diego'],
      'Texas': ['Houston', 'Dallas', 'Austin'],
      'Nueva York': ['Nueva York City', 'Buffalo'],
      'Florida': ['Miami', 'Orlando', 'Tampa']
    }
  },
  'Canadá': {
    estados: ['Ontario', 'Quebec', 'British Columbia'],
    ciudades: {
      'Ontario': ['Toronto', 'Ottawa'],
      'Quebec': ['Montreal', 'Quebec City'],
      'British Columbia': ['Vancouver', 'Victoria']
    }
  }
};

// Sample businesses data
const negociosData: Negocio[] = [
  {
    id: 1,
    nombre: "TechFlow Solutions",
    descripcion: "Soluciones tecnológicas para empresas latinoamericanas",
    imagen: "/images/tech-flow.jpg",
    categoria: "Tecnología",
    industria: "SaaS",
    pais: "México",
    estado: "Ciudad de México",
    ciudad: "CDMX",
    modalidad: "Online",
    tags: ["Startup", "Innovación", "Tech"],
    sitioWeb: "https://techflow.com",
  },
  {
    id: 2,
    nombre: "Sabor Latino Catering",
    descripcion: "Servicio de catering con auténticos sabores latinoamericanos",
    imagen: "/images/catering.jpg",
    categoria: "Alimentación",
    industria: "Catering",
    pais: "Colombia",
    estado: "Antioquia",
    ciudad: "Medellín",
    modalidad: "Presencial",
    tags: ["Gastronomía", "Eventos", "Catering"],
    sitioWeb: "https://saborlatino.com",
  },
  {
    id: 3,
    nombre: "Digital Marketing Pros",
    descripcion: "Agencia de marketing digital especializada en mercados latinos",
    imagen: "/images/marketing.jpg",
    categoria: "Servicios",
    industria: "Marketing",
    pais: "Estados Unidos",
    estado: "Florida",
    ciudad: "Miami",
    modalidad: "Híbrido",
    tags: ["Marketing Digital", "Estrategia", "Redes Sociales"],
    sitioWeb: "https://digitalmarketingpros.com",
  }
];

export default function DirectorioNegocios() {
  const [filtros, setFiltros] = useState({
    categoria: '',
    industria: '',
    pais: '',
    estado: '',
    ciudad: '',
    modalidad: '',
    searchTerm: ''
  });

  const [filteredBusinesses, setFilteredBusinesses] = useState(negociosData);

  // Unique lists for filtering
  const paises = Object.keys(locationData);
  const [estadosFiltrados, setEstadosFiltrados] = useState<string[]>([]);
  const [ciudadesFiltradas, setCiudadesFiltradas] = useState<string[]>([]);

  // Handle country change with cascading clear
  const handlePaisChange = (pais: string) => {
    if (pais === '') {
      // If "Todos los Países" is selected, clear all location-related filters
      setFiltros(prev => ({
        ...prev,
        pais: '',
        estado: '',
        ciudad: ''
      }));
      setEstadosFiltrados([]);
      setCiudadesFiltradas([]);
    } else {
      // Normal country selection
      setFiltros(prev => ({
        ...prev, 
        pais, 
        estado: '', 
        ciudad: ''
      }));
      
      // Update estados based on selected country
      setEstadosFiltrados(locationData[pais as keyof typeof locationData].estados);
    }
  };

  // Handle state change with cascading clear
  const handleEstadoChange = (estado: string) => {
    if (estado === '') {
      // If "Todos los Estados" is selected, clear city
      setFiltros(prev => ({
        ...prev,
        estado: '',
        ciudad: ''
      }));
      setCiudadesFiltradas([]);
    } else {
      // Normal state selection
      setFiltros(prev => ({
        ...prev, 
        estado, 
        ciudad: ''
      }));
      
      // Update ciudades based on selected state and country
      if (filtros.pais && estado) {
        setCiudadesFiltradas(
          locationData[filtros.pais as keyof typeof locationData].ciudades[estado] || []
        );
      }
    }
  };

  // Handle category change with cascading clear
  const handleCategoriaChange = (categoria: string) => {
    if (categoria === '') {
      // If "Todas las Categorías" is selected, clear industry
      setFiltros(prev => ({
        ...prev,
        categoria: '',
        industria: ''
      }));
    } else {
      // Normal category selection
      setFiltros(prev => ({
        ...prev,
        categoria,
        industria: '' // Reset industry when category changes
      }));
    }
  };

  useEffect(() => {
    const filtered = negociosData.filter(negocio => {
      const matchCategoria = !filtros.categoria || negocio.categoria === filtros.categoria;
      const matchIndustria = !filtros.industria || negocio.industria === filtros.industria;
      const matchPais = !filtros.pais || negocio.pais === filtros.pais;
      const matchEstado = !filtros.estado || negocio.estado === filtros.estado;
      const matchCiudad = !filtros.ciudad || negocio.ciudad === filtros.ciudad;
      const matchModalidad = !filtros.modalidad || negocio.modalidad === filtros.modalidad;
      const matchSearch = !filtros.searchTerm || 
        negocio.nombre.toLowerCase().includes(filtros.searchTerm.toLowerCase()) ||
        negocio.tags.some(tag => tag.toLowerCase().includes(filtros.searchTerm.toLowerCase()));

      return matchCategoria && matchIndustria && matchPais && 
             matchEstado && matchCiudad && matchModalidad && matchSearch;
    });

    setFilteredBusinesses(filtered);
  }, [filtros]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Nuestros Aliados
          </h1>
          <p className="text-xl text-gray-600">
          Descubre negocios y organizaciones que apoyan y fortalecen nuestra comunidad
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <input 
              type="text" 
              placeholder="Buscar negocio..."
              className="w-full px-4 py-2 border rounded"
              value={filtros.searchTerm}
              onChange={(e) => setFiltros(prev => ({...prev, searchTerm: e.target.value}))}
            />
            
            <select 
              value={filtros.pais}
              onChange={(e) => handlePaisChange(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Todos los Países</option>
              {paises.map(pais => (
                <option key={pais} value={pais}>{pais}</option>
              ))}
            </select>

            <select 
              value={filtros.estado}
              onChange={(e) => handleEstadoChange(e.target.value)}
              disabled={!filtros.pais}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Todos los Estados</option>
              {estadosFiltrados.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>

            <select 
              value={filtros.ciudad}
              onChange={(e) => setFiltros(prev => ({...prev, ciudad: e.target.value}))}
              disabled={!filtros.estado}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Todas las Ciudades</option>
              {ciudadesFiltradas.map(ciudad => (
                <option key={ciudad} value={ciudad}>{ciudad}</option>
              ))}
            </select>
          </div>

          {/* Additional Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <select 
              value={filtros.categoria}
              onChange={(e) => handleCategoriaChange(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Todas las Categorías</option>
              {Object.keys(categoriasIndustrias).map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>

            <select 
              value={filtros.industria}
              onChange={(e) => setFiltros(prev => ({...prev, industria: e.target.value}))}
              disabled={!filtros.categoria}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Todas las Industrias</option>
              {filtros.categoria 
                ? categoriasIndustrias[filtros.categoria as keyof typeof categoriasIndustrias].map(industria => (
                    <option key={industria} value={industria}>{industria}</option>
                  ))
                : []
              }
            </select>

            <select 
              value={filtros.modalidad}
              onChange={(e) => setFiltros(prev => ({...prev, modalidad: e.target.value}))}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Todas las Modalidades</option>
              <option value="Online">Online</option>
              <option value="Presencial">Presencial</option>
              <option value="Híbrido">Híbrido</option>
            </select>
          </div>
        </div>

        {/* Botón para Unirse */}
        <div className="text-center mb-8">
          <Link 
            href="/registro" 
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
          >
            Únete a la Red de Negocios
          </Link>
        </div>

        {/* Grid de Negocios */}
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredBusinesses.map(negocio => (
              <motion.div 
                key={negocio.id} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image 
                    src={negocio.imagen} 
                    alt={negocio.nombre} 
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl">{negocio.nombre}</h3>
                    <span className="text-sm text-gray-500">{negocio.modalidad}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {negocio.descripcion}
                  </p>

                  <div className="space-y-3">
                    {negocio.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {negocio.tags.map(tag => (
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
                      <span className="text-gray-500">{negocio.pais} - {negocio.ciudad}</span>
                      {negocio.sitioWeb && (
                        <a 
                          href={negocio.sitioWeb} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Sitio Web
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {filteredBusinesses.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No se encontraron negocios
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