import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingScreen from 'components/Shared/LoadingScreen';
import LoginForm from './components/LoginForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import authService from 'services/authService';
import { useAuth } from 'context/AuthContext';
import background from 'assets/img/background.jpg';
import logo from 'assets/img/logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await authService.login(username, password, rememberMe);
      const { access_token } = result;
      
      document.cookie = `access_token=${access_token}; path=/; Secure; SameSite=Strict`;

      login(); 
      navigate('/home'); 
      toast.success(`Bienvenido al sistema`);
      
    } catch (error) {
      const msg = error.response?.data?.message || 'Credenciales inválidas';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => { 
    e.preventDefault();
    toast.info("Enlace de recuperación enviado.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-900">
      
      {/* Capa de fondo moderna: Oscura con destellos rojos */}
      <div className="absolute inset-0 z-0">
        <img 
          src={background}
          alt="Fondo corporativo Talara"
          className="w-full h-full object-cover opacity-70"
        />
        {/* Gradiente radial para un efecto de luz central */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/40 via-slate-900/90 to-black"></div>
      </div>

      {/* Contenedor Principal: Tarjeta moderna con bordes muy redondeados y sombra flotante */}
      <div className="w-full max-w-[420px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(220,_38,_38,_0.15)] p-8 sm:p-10 relative z-10 border border-white/20">
        
        {/* Header - Identidad FinTech */}
        <div className="flex flex-col items-center mb-10">
          {/* Logo flotante */}
          <div className="h-20 w-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-5 relative overflow-hidden border border-gray-100 p-2 transform rotate-3 hover:rotate-0 transition-transform duration-300">
             <img 
               src={logo} 
               alt="Logo Talara Créditos"
               className="h-full w-full object-contain"
             />
          </div>

          <h2 className="text-[10px] font-black text-yellow-500 tracking-[0.3em] uppercase mb-1">
             Préstamos e Inversiones
          </h2>
          <h1 className="text-2xl font-extrabold text-slate-800 text-center tracking-tight">
            Talara <span className="text-red-600">Créditos</span>
          </h1>
        </div>

        <div>
          {loading ? (
             <div className="flex justify-center items-center h-64">
              <LoadingScreen />
            </div>
          ) : showForgotPassword ? (
            <ForgotPasswordForm
              dni={dni}
              setDni={setDni}
              handleForgotPassword={handleForgotPassword}
              setShowForgotPassword={setShowForgotPassword}
            />
          ) : (
            <LoginForm
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              handleLogin={handleLogin}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
              setShowForgotPassword={setShowForgotPassword}
            />
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-10 text-center">
            <p className="text-[10px] text-slate-400 font-medium tracking-wider">
                © {new Date().getFullYear()} TALARA CRÉDITOS. VERSIÓN 2.0
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;