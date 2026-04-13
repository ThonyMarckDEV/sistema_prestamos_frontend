import React from 'react';

const ForgotPasswordForm = ({ dni, setDni, handleForgotPassword, setShowForgotPassword }) => {
  return (
    <div className="w-full animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-1">
          Recuperación
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Ingresa tu documento para validar
        </p>
      </div>

      <form onSubmit={handleForgotPassword} className="space-y-4">
        <div>
          <input
            type="text"
            id="dni"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="block w-full px-5 py-4 bg-slate-50 border border-transparent text-slate-900 rounded-2xl placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 text-lg text-center tracking-[0.25em] font-bold"
            placeholder="N° DE DNI"
            maxLength="8"
            pattern="\d*"
            required
          />
        </div>
        
        <div className="pt-6 space-y-3">
          <button
            type="submit"
            className="w-full flex justify-center py-4 px-4 rounded-2xl shadow-lg shadow-red-600/30 text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transform transition-all duration-300 hover:-translate-y-1 tracking-wide"
          >
            VALIDAR IDENTIDAD
          </button>
          
          <button
            type="button"
            onClick={() => setShowForgotPassword(false)}
            className="w-full flex justify-center py-4 px-4 rounded-2xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 focus:outline-none transition-colors duration-300 tracking-wide"
          >
            VOLVER AL LOGIN
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;