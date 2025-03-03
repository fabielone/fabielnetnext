'use client';

import { useState } from 'react';
import { FaCheckCircle } from "react-icons/fa";

export default function HeroRight() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <section className="pt-4  flex ">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center h-full">
          <div className="bg-colors-background-dark overflow-hidden flex flex-col h-full w-full max-w-xl">
            {/* Video Section */}
            <div className="w-full aspect-video rounded-lg overflow-hidden">
              <video
                className="w-full h-full object-cover"
                controls
                preload="metadata"
                poster="https://img.youtube.com/vi/SABZN5JfGAQ/maxresdefault.jpg"
              >
                <source
                  src="https://www.youtube.com/watch?v=SABZN5JfGAQ"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="p-6 flex-grow">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
  Tu Aliado Empresarial
</h2>
<p className="text-slate-800 mt-4 text-lg">
  🌟 ¡Bienvenido a <span className="text-yellow-600 font-semibold">Fabiel.Net</span>! 
  Estamos aquí para ayudarte a establecer y crecer tu negocio en los Estados Unidos.
</p>

              {/* Newsletter Subscription Form */}
              <div className="mt-8">
                <h3 className="text-slate-900 text-lg mb-3 font-semibold">
                  Recibe consejos y actualizaciones empresariales
                </h3>
                <form onSubmit={handleSubmit} className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu correo electrónico"
                    className="w-full px-4 py-2 rounded-lg bg-white text-slate-900 placeholder-slate-500 border border-slate-300 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                    required
                  />
                  <button
                    type="submit"
                    className="mt-3 w-full bg-yellow-500 text-slate-900 px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-300 font-semibold"
                  >
                    Suscribirse
                  </button>

                  {/* Success Animation */}
                  {isSubmitted && (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white rounded-lg shadow-lg transition-all duration-300">
                      <div className="flex items-center text-green-600">
                        <FaCheckCircle className="text-2xl mr-2" />
                        <span className="font-semibold">¡Gracias por suscribirte!</span>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}