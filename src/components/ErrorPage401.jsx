import React, { useEffect } from 'react';
import { HiOutlineArrowLongLeft } from 'react-icons/hi2';
import { ShieldExclamationIcon, LockClosedIcon } from '@heroicons/react/24/outline'; // 🔥 Usamos LockClosedIcon de Heroicons

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black font-sans p-4 relative">
        <div className="relative z-10 text-center max-w-md">
          
          {/* Icono de Seguridad Financiera */}
          <div className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out mb-8">
            <div className="relative inline-block border-2 border-red-600 p-8 rounded-3xl shadow-sm">
                <ShieldExclamationIcon className="w-16 h-16 text-red-600" />
                {/* 🔥 Cambiado a LockClosedIcon que es más estándar */}
                <LockClosedIcon className="w-8 h-8 text-white bg-red-600 rounded-lg p-1.5 absolute -bottom-2 -right-2 border-2 border-white" />
            </div>
          </div>
          
          <h1 className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out text-7xl font-black text-slate-900 mb-2">
            401
          </h1>
          
          <h2 className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out text-sm font-black uppercase tracking-[0.3em] text-red-600 mb-6">
            Acceso Restringido
          </h2>
          
          <p className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out mb-10 leading-relaxed font-medium text-slate-500">
             "Su perfil de usuario no cuenta con las credenciales necesarias para acceder a este módulo financiero. Si cree que esto es un error, contacte al administrador del sistema."
          </p>
          
          <div className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out">
            <a
              href="/home"
              className="group inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all duration-300 shadow-xl shadow-slate-200"
            >
              <HiOutlineArrowLongLeft className="text-xl group-hover:-translate-x-2 transition-transform duration-300" />
              Regresar al Panel
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