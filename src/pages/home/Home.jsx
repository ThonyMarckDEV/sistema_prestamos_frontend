import React, { useMemo } from "react";
import jwtUtils from "utilities/Token/jwtUtils";
import { 
  User, 
  ShieldCheck, 
  MessageSquare,
  UserCircle,
  NotepadText
} from "lucide-react"; 

const Home = () => {
  const token = jwtUtils.getAccessTokenFromCookie();
  
  const userData = useMemo(() => {
    if (!token) return null;
    return {
      name: jwtUtils.getName(token), 
      role: jwtUtils.getUserRole(token),
      username: jwtUtils.getUsername(token),
      createdAt: jwtUtils.getCreatedAt(token)
    };
  }, [token]);

  return (
    <div className="container mx-auto p-6 min-h-screen"> 
      <div className="max-w-5xl mx-auto">
        
        {/* 1. SECCIÓN DE BIENVENIDA */}
        <header className="flex flex-col md:flex-row items-center gap-6 mb-8 p-8 bg-gradient-to-r bg-black rounded-2xl text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="h-20 w-20 bg-red-900 rounded-xl flex items-center justify-center text-3xl font-black shadow-inner border border-slate-700 uppercase">
              {userData?.name?.charAt(0) || "U"}
            </div>
          </div>
          
          <div className="relative z-10 text-center md:text-left">
            <h1 className="text-3xl font-black tracking-tight mb-2">
              ¡Hola, {userData?.name || 'Usuario'}!
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded border border-white/10 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck size={14} className="text-yellow-300"/> {userData?.role || 'Personal'}
              </span>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        </header>

        {/* 2. GRID DE INFORMACIÓN Y SOPORTE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Detalles de la Cuenta */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-slate-500 text-[11px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <User size={16}/> Información de Sesión
            </h3>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-slate-400">
                  <User size={18}/>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">Nombre Completo</p>
                  <p className="font-bold text-slate-800 text-sm">{userData?.name || 'No disponible'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-slate-400">
                  <NotepadText size={18}/>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">Username</p>
                  <p className="font-bold text-slate-800 text-sm">{userData?.username || 'No disponible'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-slate-400">
                  <UserCircle size={18}/>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">Rol</p>
                  <p className="font-bold text-slate-800 text-sm">{userData?.role}</p>
                </div>
              </div>
              
            </div>
          </div>

          {/* Tarjeta de Soporte IT */}
          <div className="bg-red-900 p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                    <MessageSquare size={20} className="text-white"/>
                 </div>
                 <h3 className="text-lg font-black tracking-tight text-yellow-300">¿Necesitas Soporte Técnico?</h3>
              </div>
              <p className="text-white text-sm font-medium leading-relaxed mb-6">
                Si tienes problemas con el sistema, o necesitas ayuda con algún módulo, escríbenos un correo explicando tu problema.
              </p>
            </div>
            
            {/* CORREO ESCRITO DIRECTO SIN BOTÓN */}
            <div className="relative z-10 mt-auto bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm text-center">
              <p className="text-[10px] text-yellow-300 uppercase tracking-widest font-bold mb-1">Envía un mensaje a:</p>
              <a href="mailto:thonymarckdev@gmail.com" className="font-mono text-lg font-black text-white hover:underline">
                thonymarckdev@gmail.com
              </a>
            </div>

            {/* Icono de fondo decorativo */}
            <MessageSquare size={120} className="absolute -bottom-10 -right-6 text-white/5 rotate-12" />
          </div>

        </div>

        {/* 3. MENSAJE FINAL */}
        <div className="mt-8 p-8 border border-dashed border-slate-300 bg-slate-50/50 rounded-2xl text-center">
            <p className="text-slate-500 text-sm font-medium italic">
                "El verdadero valor de un sistema de préstamos no está en el dinero que entrega, sino en las oportunidades que crea."
            </p>
            <div className="mt-4 flex items-center justify-center gap-3 opacity-60">
              <span className="h-px w-6 bg-slate-400"></span>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">TALARA CREDITOS E INVERSIONES</p>
              <span className="h-px w-6 bg-slate-400"></span>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Home;