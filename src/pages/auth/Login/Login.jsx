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
    // Lógica genérica de recuperación
    toast.info("Enlace enviado si el DNI existe.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Capa de fondo con imagen y desenfoque (MODIFICADO) */}
      <div className="absolute inset-0 z-0">
        {/* Imagen de fondo del restaurante. Reemplaza con tu imagen real. */}
        <img 
          src= {background}// Imagen de activos (ruta ficticia para el usuario)
          alt="Fondo de restaurante de lujo en blanco y negro"
          className="w-full h-full object-cover"
        />
        {/* Superposición para desenfoque y oscurecimiento. Ajusta la opacidad/desenfoque aquí. */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div> {/* backdrop-blur-md aplica desenfoque a lo que está detrás */}
      </div>

      {/* Patrón de fondo sutil original (se mantiene sobre el fondo desenfocado) */}
      <div className="absolute inset-0 opacity-[0.03] z-5" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

      {/* Contenedor Principal (MODIFICADO: añadido z-10 y relative) */}
      <div className="w-full max-w-lg bg-white rounded-none shadow-2xl p-8 sm:p-12 border-2 border-black relative z-10">
        
        {/* Header - Identidad Formal Cholo */}
        <div className="flex flex-col items-center mb-8 border-b-2 border-black pb-6">
          <h2 className="text-sm font-bold text-black tracking-[0.2em] uppercase mb-4">
             SAAS Restaurante 
          </h2>
          
          {/* Isotipo: Reemplazado por imagen de activos (MODIFICADO) */}
          <div className="h-24 w-24 bg-black flex items-center justify-center mb-4 relative overflow-hidden">
             {/* Bordes geométricos tipo andino */}
             <div className="absolute inset-1 border border-white border-dashed opacity-50"></div>
             <div className="absolute inset-2 border border-white"></div>
             
             {/* Imagen de isotipo de activos. Reemplaza con tu logotipo real. */}
             <img 
               src={logo} // Imagen de activos (ruta ficticia para el usuario)
               alt="Logotipo de restaurante llama andino formal"
               className="h-16 w-16 relative z-10 object-contain"
             />
          </div>

          <h1 className="text-xs font-semibold text-gray-600 tracking-widest uppercase">
            Gestión Centralizada
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
        <div className="mt-10 text-center border-t border-gray-200 pt-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                © {new Date().getFullYear()} Restaurante. Todos los derechos reservados.
                {/* Puedes añadir la textura aquí si lo prefieres, o mantenerla en el fondo global */}
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;