'use client';

import { useState, useRef } from 'react';
import BlogCard from '../../molecules/cards/blogcard';
import { FaChevronLeft, FaChevronRight, FaBookReader } from 'react-icons/fa';
import BlogCarousel from 'app/components/molecules/carousels/blogcarousel';

interface Blog {
  title: string;
  description: string;
  image: string;
  date: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  slug: string;
  readTime: string;
}

export default function BlogList(): JSX.Element {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
  const [showRightArrow, setShowRightArrow] = useState<boolean>(true);

  const blogs: Blog[] = [
    {
      title: "Cómo Formar tu LLC en Estados Unidos",
      description: "Una guía completa para emprendedores latinos que desean establecer su negocio en EE.UU. Aprende los pasos necesarios, requisitos y beneficios de formar una LLC.",
      image: "https://placehold.co/600x400/png",
      date: "2024-01-15",
      author: {name:"Fabiel Ramirez",
        avatar:'/'},
      category: "Negocios",
      slug: "formar-llc-eeuu",
      readTime: "7 min"
    },
    {
      title: "Estrategias de Marketing Digital para Empresas Latinas",
      description: "Descubre las mejores prácticas de marketing digital para alcanzar a tu audiencia hispana en Estados Unidos. Incluye SEO, redes sociales y email marketing.",
      image: "https://placehold.co/600x400/png",
      date: "2024-01-20",
      author: {name:"Fabiel Ramirez",
        avatar:'/'},
      category: "Marketing",
      slug: "marketing-digital-latinos",
      readTime: "5 min"
    },
    {
      title: "Cumplimiento Fiscal para Negocios Hispanos",
      description: "Todo lo que necesitas saber sobre impuestos, reportes financieros y cumplimiento legal para tu negocio en EE.UU. Mantén tu empresa al día con las regulaciones.",
      image: "https://placehold.co/600x400/png",
      date: "2024-01-25",
      author: {name:"Fabiel Ramirez",
        avatar:'/'},
      category: "Legal",
      slug: "cumplimiento-fiscal",
      readTime: "6 min"
    },
    {
      title: "Expansión de Negocios: De Local a Nacional",
      description: "Guía paso a paso para escalar tu negocio local a nivel nacional. Estrategias de crecimiento, logística y gestión de operaciones multiestado.",
      image: "https://placehold.co/600x400/png",
      date: "2024-01-30",
      author: {name:"Fabiel Ramirez",
        avatar:'/'},
      category: "Crecimiento",
      slug: "expansion-nacional",
      readTime: "8 min"
    }
  ];

  const handleScroll = (direction: 'left' | 'right'): void => {
    const container = scrollRef.current;
    const scrollAmount = 300;

    if (!container) return;

    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }

    setTimeout(() => {
      if (!container) return;
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < (container.scrollWidth - container.clientWidth)
      );
    }, 100);
  };

  const handleScrollCheck = (): void => {
    const container = scrollRef.current;
    if (!container) return;
    
    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < (container.scrollWidth - container.clientWidth)
    );
  };

  return (
    <>
    <div className="flex flex-col items-center py-12 bg-gradient-to-t from-amber-100 to-white">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">
          Explora Nuestro Blog
        </h2>
        <p className="text-slate-600 text-lg">
          Recursos y guías para emprendedores latinos
        </p>
      </div>

      {/* Blog Cards Carousel */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-10" />
        
        <div className="relative px-8">
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto whitespace-nowrap gap-6 py-4 scrollbar-hide items-center "
            onScroll={handleScrollCheck}
          >
            {blogs.map((blog, index) => (
              <div key={index} className="w-[300px] flex-none">
                <BlogCard {...blog} />
              </div>
            ))}
          </div>

          {showLeftArrow && (
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg z-20 hover:bg-white transition-all duration-300"
              aria-label="Scroll left"
            >
              <FaChevronLeft className="text-gray-800 w-5 h-5" />
            </button>
          )}
          {showRightArrow && (
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg z-20 hover:bg-white transition-all duration-300"
              aria-label="Scroll right"
            >
              <FaChevronRight className="text-gray-800 w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="text-center mt-2">
        <a 
          href="/blog"
          className="inline-flex items-center gap-2 bg-amber-200 text-slate-900 px-2 py-3 rounded-lg hover:bg-amber-200 transition-colors duration-300 font-semibold"
        >
          <FaBookReader className="w-5 h-5" />
          Ver Biblioteca Completa
        </a>
      </div>
    </div>
    
    <BlogCarousel
      blogs={blogs}
      title="Latest from Our Blog"
      description="Stay updated with our latest insights"
      variant="default"
    />


    <div className="space-y-12">
      {/* Featured Posts */}
      <BlogCarousel
        blogs={blogs}
        title="Featured Posts"
        variant="featured"
        showCTA={false}
      />

      {/* Latest Posts */}
      <BlogCarousel
        blogs={blogs}
        title="Latest Posts"
        variant="default"
        showCTA={false}
      />

      {/* Category-specific Posts */}
      <BlogCarousel
        blogs={blogs}
        title="Technology"
        variant="minimal"
        showHeader={false}
        showCTA={false}
      />
    </div>

    </>
  );
}