import React from 'react';

const reviews1 = [
  {
    text: "¡Fabiel.Net nos cambió la vida! Lanzamos nuestra tienda en línea en solo 2 semanas y ya estamos vendiendo como nunca antes.",
    author: "María G., Fundadora de Tienda Latina",
  },
  {
    text: "La experiencia con Fabiel.Net fue increíble. Nos guiaron paso a paso y nos ayudaron a evitar errores costosos. ¡Son los mejores!",
    author: "Juan P., Emprendedor de Tecnología",
  },
  {
    text: "Me encanta cómo Fabiel.Net se toma el tiempo para entender tus necesidades y objetivos. Son verdaderos socios en el éxito de tu negocio.",
    author: "Sofía R., Dueña de un negocio de servicios",
  },
  {
    text: "El equipo de marketing digital de Fabiel.Net es excepcional. Nuestras ventas han aumentado un 50% en solo 3 meses y nuestra presencia en línea es más fuerte que nunca.",
    author: "Carlos M., Gerente de Marketing de una empresa de retail",
  },
  {
    text: "Muy profesionales y atentos. Nos ayudaron a crear una página web moderna y funcional que refleja perfectamente nuestra marca y valores.",
    author: "Ana L., Diseñadora Gráfica y Emprendedora",
  },
  {
    text: "Lo que más me gusta de Fabiel.Net es su capacidad para explicar conceptos complejos de manera sencilla y accesible. Son verdaderos expertos en su campo.",
    author: "Luis G., Emprendedor de una startup de tecnología",
  },
  {
    text: "Después de trabajar con varios proveedores de servicios digitales, puedo decir que Fabiel.Net es el mejor. Su dedicación, profesionalismo y resultados son incomparables.",
    author: "Elena T., Dueña de un negocio de consultoría",
  },
];



const ReviewsScroller = () => {
  return (
    <div className="mb-2 bg-green-50 space-y-6 px-6">
      {/* First row - scrolling left */}
      <div className="overflow-hidden whitespace-nowrap">
        <div className="animate-scroll-left inline-block" style={{ animationDuration: '60s' }}>
          {[...reviews1, ...reviews1].map((review, index) => (
            <div key={index} className="inline-block mx-8 p-6">
              <p className="text-gray-600 text-lg italic">"{review.text}"</p>
              <p className="text-gray-800 text-sm mt-2 font-semibold">— {review.author}</p>
            </div>
          ))}
        </div>
      </div>

    
    </div>
  );
};

export default ReviewsScroller;