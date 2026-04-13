import React, { useEffect } from 'react';
import { HiOutlineArrowLongLeft } from 'react-icons/hi2';
import { LuUtensilsCrossed } from 'react-icons/lu';
import { PiHandPalmBold } from 'react-icons/pi';

const UnauthorizedPage = () => {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black font-sans p-4 relative">
      
        <div className="relative z-10 text-center">
          
          {/* Icono Principal Ghost (Blanco sobre Blanco) */}
          <div className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out mb-8">
            <div className="relative inline-block border-2 border-black p-6 rounded-full shadow-[inset_0_0_10px_rgba(0,0,0,0.02)]">
                <LuUtensilsCrossed className="text-5xl text-black drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.1)]" />
                <PiHandPalmBold className="text-3xl text-black bg-black rounded-full p-1 absolute -bottom-1 -right-1 border-2 border-black-100" />
            </div>
          </div>
          
          {/* Título GHOST (Blanco sobre Blanco con sombra sutil) */}
          <h1 className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out text-6xl font-serif font-extralight text-black mb-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.08)]">
            401
          </h1>
          
          {/* Subtítulo GHOST */}
          <h2 className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out text-xs font-black uppercase tracking-[0.3em] text-black/90 mb-6 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
            Área Reservada
          </h2>
          
          {/* Texto explicativo GHOST */}
          <p className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out mb-10 leading-relaxed font-serif italic text-lg text-black/90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
             "Lo sentimos, su mesa no tiene acceso a esta sección del restaurante. Por favor, consulte con nuestro personal de servicio."
          </p>
          
          {/* Botones de acción GHOST (Bordes blancos finos) */}
          <div className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out">
            <a
              href="/"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-transparent text-black border border-black font-black uppercase text-xs tracking-[0.2em] hover:bg-black-50 transition-all duration-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
            >
              <HiOutlineArrowLongLeft className="text-xl text-black group-hover:-translate-x-2 transition-transform duration-300" />
              Regresar
            </a>
          </div>
      </div>

      <style jsx>{`
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

export default UnauthorizedPage;