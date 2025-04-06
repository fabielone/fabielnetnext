import BlogLayout from "src/app/components/layout/blog-layout";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog",
    description: "Blog page",
};


const categories = [
    "All",
    "Technology",
    "Design",
    "Business",
    "Development",
    "AI",
    "Culture"
  ];
  
  interface Author {
    name: string;
    avatar: string;
  }
  
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
  
  interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    category: string;
    image: string;
    author: Author;
    tags: string[];
  }



export default function BlogPage() {
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

      const blogPosts: BlogPost[] = [
        {
          id: 1,
          title: "Getting Started with Next.js 14",
          excerpt: "Learn how to set up a new Next.js project with the latest features",
          date: "2023-11-15",
          readTime: "5 min",
          category: "Development",
          image: "https://images.unsplash.com/photo-1626785774573-4b799315345d",
          author: {
            name: "Jane Developer",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg"
          },
          tags: ["nextjs", "react", "javascript"]
        },
        {
          id: 2,
          title: "The Complete Guide to CSS Grid",
          excerpt: "Master modern layout techniques with this comprehensive CSS Grid tutorial",
          date: "2023-10-22",
          readTime: "8 min",
          category: "CSS",
          image: "https://images.unsplash.com/photo-1546146830-2cca9512c68e",
          author: {
            name: "Alex Designer",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
          },
          tags: ["css", "web-design", "layout"]
        },
        {
          id: 3,
          title: "TypeScript Best Practices",
          excerpt: "Professional patterns for writing maintainable TypeScript code",
          date: "2023-09-05",
          readTime: "6 min",
          category: "TypeScript",
          image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a",
          author: {
            name: "Sam Types",
            avatar: "https://randomuser.me/api/portraits/men/75.jpg"
          },
          tags: ["typescript", "javascript", "web-development"]
        }
      ];
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <BlogLayout posts={blogPosts}/>
        </div>
    );
}