import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

// Componentes Globales
import { ToastContainer } from 'react-toastify';
import SidebarLayout from 'layouts/SidebarLayout';

// UIS AUTH & ERRORS
import ErrorPage404 from 'components/ErrorPage404';
import ErrorPage401 from 'components/ErrorPage401';
import Login from 'pages/auth/Login/Login';

// UI HOME
import Home from 'pages/home/Home';

//UI EMPLEADOS
import AgregarEmpleado from 'pages/Empleado/Store';
import EditarEmpleado from 'pages/Empleado/Update';
import ListarEmpleados from 'pages/Empleado/Index';

//UI CLIENTES
import AgregarCliente from 'pages/Cliente/Store';
import EditarCliente from 'pages/Cliente/Update';
import ListarClientes from 'pages/Cliente/Index';

// UI ENTIDADES BANCARIAS
import AgregarEntidadBancaria from 'pages/EntidadBancaria/Store';
import EditarEntidadBancaria from 'pages/EntidadBancaria/Update';
import ListarEntidadBancarias from 'pages/EntidadBancaria/Index';

// UI CARGO MORA
import AgregarCargoMora from 'pages/CargoMora/Store';
import EditarCargoMora from 'pages/CargoMora/Update';
import ListarCargoMora from 'pages/CargoMora/Index';

// UI PRODUCTO
import AgregarProducto from 'pages/Producto/Store';
import EditarProducto from 'pages/Producto/Update';
import ListarProducto from 'pages/Producto/Index';

// UI SOLICITUD PRESTAMO
import AgregarSolicitud from 'pages/SolicitudPrestamo/Store';
import EditarSolicitud from 'pages/SolicitudPrestamo/Update';
import ListarSolicitudes from 'pages/SolicitudPrestamo/Index';

// UI PRESTAMO
import ListarPrestamos from 'pages/Prestamo/Index';

// UI CAJAS
import ListarCajas from 'pages/Caja/Index';
import AgregarCaja from 'pages/Caja/Store';
import EditarCaja from 'pages/Caja/Update';

// UI SESIONES DE CAJA (TURNOS)
import ListarSesiones from 'pages/CajaSesion/Index';

// UI OPERACIONES
import RegistrarOperacion from 'pages/Operacion/Store';
import ListarOperaciones from 'pages/Operacion/Index';

// UI PAGOS
import RegistrarPago from 'pages/Pago/Store';
import ListarPagos from 'pages/Pago/Index';

// UI GRUPOS
import ListarGrupos from 'pages/Grupo/Index';
import AgregarGrupo from 'pages/Grupo/Store';
import EditarGrupo from 'pages/Grupo/Update';


// SETTINGS ROL AND PERMISSIONS
import ListarRoles from 'pages/Rol/Index';

// Utilities
import ProtectedRouteHome from 'utilities/ProtectedRoutes/ProtectedRouteHome';
import ProtectedRoute from 'utilities/ProtectedRoutes/ProtectedRoute';
import { AuthProvider } from 'context/AuthContext';


function AppContent() {
  return (
    <Routes>
      {/* 1. LOGIN */}
      <Route path="/" element={<ProtectedRouteHome element={<Login />} />} />

      {/* 2. LAYOUT GLOBAL */}
      <Route element={<ProtectedRoute element={<SidebarLayout />} />}>

        {/* HOME */}
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        
        {/* CLIENTES */}
        <Route path="/cliente/agregar" element={<ProtectedRoute requiredPermission="cliente.store" element={<AgregarCliente />} />} />
        <Route path="/cliente/editar/:id" element={<ProtectedRoute requiredPermission="cliente.update" element={<EditarCliente />} />} />
        <Route path="/cliente/listar" element={<ProtectedRoute requiredPermission="cliente.index" element={<ListarClientes />} />} />

        {/* EMPLEADOS */}
        <Route path="/empleado/agregar" element={<ProtectedRoute requiredPermission="empleado.store" element={<AgregarEmpleado />} />} />
        <Route path="/empleado/editar/:id" element={<ProtectedRoute requiredPermission="empleado.update" element={<EditarEmpleado />} />} />
        <Route path="/empleado/listar" element={<ProtectedRoute requiredPermission="empleado.index" element={<ListarEmpleados />} />} />


        {/* ENTIDADES BANCARIAS */}
        <Route path="/entidadBancaria/agregar" element={<ProtectedRoute requiredPermission="entidadBancaria.store" element={<AgregarEntidadBancaria />} />} />
        <Route path="/entidadBancaria/editar/:id" element={<ProtectedRoute requiredPermission="entidadBancaria.update" element={<EditarEntidadBancaria />} />} />
        <Route path="/entidadBancaria/listar" element={<ProtectedRoute requiredPermission="entidadBancaria.index" element={<ListarEntidadBancarias />} />} />

        {/* CARGO MORA */}
        <Route path="/cargoMora/agregar" element={<ProtectedRoute requiredPermission="cargoMora.store" element={<AgregarCargoMora />} />} />
        <Route path="/cargoMora/editar/:id" element={<ProtectedRoute requiredPermission="cargoMora.update" element={<EditarCargoMora />} />} />
        <Route path="/cargoMora/listar" element={<ProtectedRoute requiredPermission="cargoMora.index" element={<ListarCargoMora />} />} />

        {/* CARGO MORA */}
        <Route path="/producto/agregar" element={<ProtectedRoute requiredPermission="producto.store" element={<AgregarProducto />} />} />
        <Route path="/producto/editar/:id" element={<ProtectedRoute requiredPermission="producto.update" element={<EditarProducto />} />} />
        <Route path="/producto/listar" element={<ProtectedRoute requiredPermission="producto.index" element={<ListarProducto />} />} />

        {/* SOLICITUD PRESTAMO */}
        <Route path="/solicitudPrestamo/agregar" element={<ProtectedRoute requiredPermission="solicitudPrestamo.store" element={<AgregarSolicitud />} />} />
        <Route path="/solicitudPrestamo/editar/:id" element={<ProtectedRoute requiredPermission="solicitudPrestamo.update" element={<EditarSolicitud />} />} />
        <Route path="/solicitudPrestamo/listar" element={<ProtectedRoute requiredPermission="solicitudPrestamo.index" element={<ListarSolicitudes />} />} />

        {/* PRESTAMO */}
        <Route path="/prestamo/listar" element={<ProtectedRoute requiredPermission="prestamo.index" element={<ListarPrestamos />} />} />

        {/* CAJAS  */}
        <Route path="/caja/listar" element={<ProtectedRoute requiredPermission="caja.index" element={<ListarCajas />} />} />
        <Route path="/caja/agregar" element={<ProtectedRoute requiredPermission="caja.store" element={<AgregarCaja />} />} />
        <Route path="/caja/editar/:id" element={<ProtectedRoute requiredPermission="caja.update" element={<EditarCaja />} />} />

        {/* CAJAS SESIONES (TURNOS) */}
        <Route path="/caja/sesiones" element={<ProtectedRoute requiredPermission="cajaSesion.index" element={<ListarSesiones />} />} />

        {/* OPERACIONES */}
        <Route path="/operacion/caja" element={<ProtectedRoute requiredPermission="operacion.store" element={<RegistrarOperacion />} />} />
        <Route path="/operacion/listar" element={<ProtectedRoute requiredPermission="operacion.store" element={<ListarOperaciones />} />} />

        {/* PAGOS */}
        <Route path="/pago/registrar" element={<ProtectedRoute requiredPermission="pago.store" element={<RegistrarPago />} />} />
        <Route path="/pago/listar" element={<ProtectedRoute requiredPermission="pago.store" element={<ListarPagos />} />} />

        {/* GRUPOS */}
        <Route path="/grupo/listar" element={<ProtectedRoute requiredPermission="grupo.index" element={<ListarGrupos />} />} />
        <Route path="/grupo/agregar" element={<ProtectedRoute requiredPermission="grupo.store" element={<AgregarGrupo />} />} />
        <Route path="/grupo/editar/:id" element={<ProtectedRoute requiredPermission="grupo.update" element={<EditarGrupo />} />} />

        {/* SETTINGS */}
        <Route path="/rol/listar" element={<ProtectedRoute requiredPermission="rol.index" element={<ListarRoles />} />} />

      </Route>

      {/* 3. ERRORES */}
      <Route path="/401" element={<ErrorPage401 />} />
      <Route path="*" element={<ErrorPage404 />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white text-primary">
          <AppContent />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;