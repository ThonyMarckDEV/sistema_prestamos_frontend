import React, { useEffect } from 'react';
import { PiCookingPotLight } from 'react-icons/pi';
import { HiOutlineArrowLongLeft } from 'react-icons/hi2';

const NotFoundPage = () => {
  useEffect(() => {
    const elementsToAnimate = document.querySelectorAll('.animate-in');
    elementsToAnimate.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-show');
      }, 150 * index);
    });
  }, []);

  return (
    // FONDO BLANCO
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-white font-sans p-4 relative">
    
        {/* Icono animado (Plato/Olla vacía) */}
        <div className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out mb-10">
          <div className="inline-flex items-center justify-center w-32 h-32 border border-black rounded-full mb-4 animate-float relative shadow-[inset_0_0_15px_rgba(0,0,0,0.01)]">
            <div className="absolute inset-2 border border-dashed border-black rounded-full opacity-50"></div>
            <PiCookingPotLight className="text-6xl text-black drop-shadow-[0_1px_1px_rgba(0,0,0,0.08)]" />
          </div>
        </div>
        
        {/* Título GHOST */}
        <h1 className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out text-8xl font-serif font-extralight tracking-tighter text-black mb-2 drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.1)]">
          404
        </h1>
        
        {/* Subtítulo GHOST */}
        <h2 className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out text-sm font-bold uppercase tracking-[0.4em] text-black/95 mb-8 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
          Plato no disponible
        </h2>
        
        {/* Descripción GHOST */}
        <p className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out mb-12 px-6 leading-relaxed font-serif italic text-xl text-black/90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
           "La especialidad que busca no se encuentra en nuestra carta de hoy. Permítanos guiarle de vuelta al menú principal."
        </p>
        
        {/* Botón GHOST (Bordes blancos) */}
        <div className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out">
          <a
            href="/"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-transparent text-black border border-black font-black uppercase text-xs tracking-[0.2em] hover:bg-black-50 transition-all duration-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
          >
            <HiOutlineArrowLongLeft className="text-xl text-black group-hover:-translate-x-2 transition-transform duration-300" />
            Regresar
          </a>
        </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-in {
          opacity: 0;
          transform: translateY(20px);
        }
        .animate-show {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;