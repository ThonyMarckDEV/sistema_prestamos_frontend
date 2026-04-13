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
import AgregarEmpleado from 'pages/empleado/Store';
import EditarEmpleado from 'pages/empleado/Update';
import ListarEmpleados from 'pages/empleado/Index';

//UI CLIENTES
import AgregarCliente from 'pages/cliente/Store';
import EditarCliente from 'pages/cliente/Update';
import ListarClientes from 'pages/cliente/Index';

// // UI DIVISAS
// import AgregarDivisa from 'pages/divisa/Store';
// import EditarDivisa from 'pages/divisa/Update';
// import ListarDivisas from 'pages/divisa/Index';

// // UI ENTIDADES BANCARIAS
// import AgregarEntidadBancaria from 'pages/entidadBancaria/Store';
// import EditarEntidadBancaria from 'pages/entidadBancaria/Update';
// import ListarEntidadBancarias from 'pages/entidadBancaria/Index';



// SETTINGS ROL AND PERMISSIONS
import ListarRoles from 'pages/rol/Index';

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

        {/* DIVISAS */}
        {/* <Route path="/divisa/agregar" element={<ProtectedRoute requiredPermission="divisa.store" element={<AgregarDivisa />} />} />
        <Route path="/divisa/editar/:id" element={<ProtectedRoute requiredPermission="divisa.update" element={<EditarDivisa />} />} />
        <Route path="/divisa/listar" element={<ProtectedRoute requiredPermission="divisa.index" element={<ListarDivisas />} />} /> */}

        {/* ENTIDADES BANCARIAS */}
        {/* <Route path="/entidadBancaria/agregar" element={<ProtectedRoute requiredPermission="entidadBancaria.store" element={<AgregarEntidadBancaria />} />} />
        <Route path="/entidadBancaria/editar/:id" element={<ProtectedRoute requiredPermission="entidadBancaria.update" element={<EditarEntidadBancaria />} />} />
        <Route path="/entidadBancaria/listar" element={<ProtectedRoute requiredPermission="entidadBancaria.index" element={<ListarEntidadBancarias />} />} />

        */}

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