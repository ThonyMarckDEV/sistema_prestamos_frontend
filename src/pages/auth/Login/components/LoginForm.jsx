import React from 'react';

const LoginForm = ({
  username,
  setUsername,
  password,
  setPassword,
  handleLogin,
  rememberMe,
  setRememberMe,
  setShowForgotPassword
}) => {
  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        {/* Fuente Serif para darle el toque formal/clásico */}
        <h2 className="text-3xl font-serif text-black mb-2">
          Bienvenido de Nuevo
        </h2>
        <p className="text-sm text-gray-600">
          Por favor, ingresa tus credenciales
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-1">
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full px-4 py-3 bg-transparent border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 transition-colors sm:text-sm rounded-none"
            placeholder="Usuario"
            required
          />
        </div>

        <div className="space-y-1">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-4 py-3 bg-transparent border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 transition-colors sm:text-sm rounded-none"
            placeholder="Contraseña"
            required
          />
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-black border-2 border-black rounded-none focus:ring-black cursor-pointer"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-black font-medium cursor-pointer select-none">
              Recordar dispositivo
            </label>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full flex justify-center py-4 px-4 border-2 border-black text-sm font-bold text-white bg-black hover:bg-white hover:text-black focus:outline-none transition-all duration-200 uppercase tracking-widest"
          >
            Ingresar al Sistema
          </button>
        </div>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm font-semibold text-black hover:underline underline-offset-4 transition-all"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;