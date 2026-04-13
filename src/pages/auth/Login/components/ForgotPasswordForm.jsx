import React from 'react';

const ForgotPasswordForm = ({ dni, setDni, handleForgotPassword, setShowForgotPassword }) => {
  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-serif text-black mb-2">
          Restablecer
        </h2>
        <p className="text-sm text-gray-600">
          Ingresa tu DNI para validar tu identidad
        </p>
      </div>

      <form onSubmit={handleForgotPassword} className="space-y-5">
        <div>
          <input
            type="text"
            id="dni"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="block w-full px-4 py-3 bg-transparent border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 transition-colors sm:text-sm rounded-none text-center tracking-widest font-bold"
            placeholder="N° DE DNI"
            maxLength="8"
            pattern="\d*"
            required
          />
        </div>
        
        <div className="pt-2 space-y-3">
          <button
            type="submit"
            className="w-full flex justify-center py-4 px-4 border-2 border-black text-sm font-bold text-white bg-black hover:bg-white hover:text-black focus:outline-none transition-all duration-200 uppercase tracking-widest"
          >
            Validar
          </button>
          
          <button
            type="button"
            onClick={() => setShowForgotPassword(false)}
            className="w-full flex justify-center py-4 px-4 border-2 border-black text-sm font-bold text-black bg-white hover:bg-gray-100 focus:outline-none transition-all duration-200 uppercase tracking-widest"
          >
            Volver
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;