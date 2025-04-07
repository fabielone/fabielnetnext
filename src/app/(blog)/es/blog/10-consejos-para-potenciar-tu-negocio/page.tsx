//simple blog nextjs page tailwindcss
import { Metadata } from "next";




export default function Page() {
    
    return (
       <div>spanishh blog post 10 concejos para </div>
);
    
    }
export const metadata: Metadata = {
    title: "10 Tips to Boost Your Business",
    description: "Discover effective strategies to enhance your business performance and achieve your goals.",
    openGraph: {
        title: "10 Tips to Boost Your Business",
        description: "Discover effective strategies to enhance your business performance and achieve your goals.",
        url: "https://fabiel.net/es/blog/10-consejos-para-potenciar-tu-negocio",
        siteName: "Fabiel",
        images: [
            {
                url: "https://fabiel.net/images/og-image.png",
                width: 1200,
                height: 630,
            },
        ],
    },
};
