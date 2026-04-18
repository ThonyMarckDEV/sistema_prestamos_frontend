import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    HomeIcon, 
    ChartPieIcon, 
    UsersIcon, 
    BanknotesIcon, 
    CurrencyDollarIcon, 
    BuildingLibraryIcon, 
    UserGroupIcon, 
    Cog8ToothIcon,
    WalletIcon,
    DocumentChartBarIcon,
    Bars3Icon,
    ArrowRightOnRectangleIcon,
    CubeIcon
} from '@heroicons/react/24/outline';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { useAuth } from 'context/AuthContext';

// Importamos el logo
import logo from 'assets/img/logo.png'; 
import { ChevronDownIcon, ChevronLeftIcon, CreditCardIcon, MapIcon, ScaleIcon, ShoppingBagIcon } from 'lucide-react';

// =======================================================================
// CONFIGURACIÓN MAESTRA DEL MENÚ - SISTEMA DE PRÉSTAMOS
// =======================================================================
export const MENU_GROUPS = [
    {
        groupName: 'Principal',
        items: [
            {
                section: 'Home',
                link: '/home',
                icon: HomeIcon,
            }
        ]
    },
    {
        groupName: 'Portal del Cliente',
        items: [
            {
                section: 'Pagos',
                icon: CreditCardIcon,
                subs: [
                    { name: 'Ver Pagos', link: '/pago/listar', requiredPermission: 'pago.index' },
                ],
            }
        ]
    },
    {
        groupName: 'Métricas y Análisis',
        items: [
            {
                section: 'Dashboard',
                link: '/dashboard',
                icon: ChartPieIcon,
                requiredPermission: 'dashboard.index'
            }
        ]
    },
    {
        groupName: 'Gestión de Cartera',
        items: [
            { 
                section: 'Clientes', icon: UsersIcon,
                subs: [
                    { name: 'Listar Clientes', link: '/cliente/listar', requiredPermission: 'cliente.index' },
                    { name: 'Registrar Cliente', link: '/cliente/agregar', requiredPermission: 'cliente.store' },
                ],
            },
            { 
                section: 'Grupos', icon: UserGroupIcon, 
                subs: [
                    { name: 'Listar Grupos', link: '/grupo/listar', requiredPermission: 'grupo.index' },
                    { name: 'Registrar Grupo', link: '/grupo/agregar', requiredPermission: 'grupo.store' },
                ],
            },
            { 
                section: 'Préstamos', icon: BanknotesIcon,
                subs: [
                    { name: 'Listar Préstamos', link: '/prestamo/listar', requiredPermission: 'prestamo.index' },
                    { name: 'Nuevo Préstamo', link: '/prestamo/agregar', requiredPermission: 'prestamo.store' },
                    { name: 'Nueva Solicitud', link: '/solicitudPrestamo/agregar', requiredPermission: 'solicitudPrestamo.store' },
                    { name: 'Solicitudes', link: '/solicitudPrestamo/listar', requiredPermission: 'solicitudPrestamo.index' },
                ],
            }
        ]
    },
    {
        groupName: 'Caja y Recaudación',
        items: [
            { 
                section: 'Operaciones', icon: CurrencyDollarIcon, 
                subs: [
                    { name: 'Caja Operativa', link: '/operacion/caja', requiredPermission: 'operacion.store' },
                    { name: 'Historial de Movimientos', link: '/operacion/listar', requiredPermission: 'operacion.index' },
                ],
            },
            { 
                section: 'Cajas', icon: WalletIcon,
                subs: [
                    { name: 'Sesiones (Apertura/Cierre)', link: '/caja/sesiones', requiredPermission: 'cajaSesion.index' },
                    { name: 'Gestión de Cajas', link: '/caja/listar', requiredPermission: 'caja.index' },
                    { name: 'Nueva Caja', link: '/caja/agregar', requiredPermission: 'caja.store' },
                ],
            }
        ] 
    },
    {
        groupName: 'Reportes',
        items: [
            { 
                section: 'Informes', icon: DocumentChartBarIcon,
                subs: [
                    { name: 'Clientes Morosos', link: '/reporte/morosos', requiredPermission: 'reporte.morosidad' },
                    { name: 'Flujo de Caja', link: '/reporte/flujo-caja', requiredPermission: 'reporte.flujo' },
                ],
            }
        ]
    },
    {
        groupName: 'Administración y Ajustes',
        items: [
            { 
                section: 'Zonas Operativas', icon: MapIcon,
                subs: [
                    { name: 'Listar Zonas', link: '/zona/listar', requiredPermission: 'zona.index' },
                    { name: 'Nueva Zona', link: '/zona/agregar', requiredPermission: 'zona.store' },
                ],
            },
            { 
                section: 'Entidades Bancarias', icon: BuildingLibraryIcon,
                subs: [
                    { name: 'Listar Bancos', link: '/entidadBancaria/listar', requiredPermission: 'entidadBancaria.index' },
                    { name: 'Agregar Banco', link: '/entidadBancaria/agregar', requiredPermission: 'entidadBancaria.store' },
                ],
            },
            { 
                section: 'Cargos de Mora', icon: ScaleIcon,
                subs: [
                    { name: 'Configurar Tarifas', link: '/cargoMora/listar', requiredPermission: 'cargoMora.index' },
                    { name: 'Nuevo Rango de Mora', link: '/cargoMora/agregar', requiredPermission: 'cargoMora.store' },
                ],
            },
            { 
                section: 'Productos', icon: ShoppingBagIcon,
                subs: [
                    { name: 'Listar Productos', link: '/producto/listar', requiredPermission: 'producto.index' },
                    { name: 'Nuevo Producto', link: '/producto/agregar', requiredPermission: 'producto.store' },
                ],
            },
            { 
                section: 'Empleados', icon: UserGroupIcon,
                subs: [
                    { name: 'Listar Personal', link: '/empleado/listar', requiredPermission: 'empleado.index' },
                    { name: 'Agregar Empleado', link: '/empleado/agregar', requiredPermission: 'empleado.store' },
                ],
            },
            { 
                section: 'Roles y Permisos', icon: Cog8ToothIcon,
                link: '/rol/listar', requiredPermission: 'rol.index'
            }
        ]
    }
];

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const [isOpen, setIsOpen] = useState(false); // Modal state para móvil
    const [openSection, setOpenSection] = useState(null); 
    const [showConfirm, setShowConfirm] = useState(false);
    
    const location = useLocation();
    const { can, logout } = useAuth();

    const handleLogout = () => { logout(); setShowConfirm(false); };
    
    const userMenuGroups = useMemo(() => {
        return MENU_GROUPS.map(group => {
            const filteredItems = group.items.map(item => {
                // Evaluamos si el item tiene submenús
                if (item.subs) {
                    const visibleSubs = item.subs.filter(sub => can(sub.requiredPermission));
                    return { ...item, subs: visibleSubs };
                }
                return item;
            }).filter(item => {
                // Filtramos los items: Si tenía subs pero ya no quedó ninguno visible, lo ocultamos.
                if (item.subs) return item.subs.length > 0;

                if (!item.requiredPermission) return true;
                
                // Si era un link directo (como Kardex o Dashboard), validamos su propio permiso
                return can(item.requiredPermission);
            });

            return { ...group, items: filteredItems };
        }).filter(group => group.items.length > 0); // Filtramos grupos vacíos
    }, [can]);

    const handleSectionClick = (section) => { 
        if (isCollapsed && window.innerWidth >= 768) {
            setIsCollapsed(false); 
            setOpenSection(section);
        } else {
            setOpenSection(prev => prev === section ? null : section); 
        }
    };

    const isSectionActive = useCallback((item) => {
        if (item.subs) return item.subs.some(sub => location.pathname.startsWith(sub.link));
        if (item.link) return location.pathname === item.link; 
        return false;
    }, [location.pathname]);
    
    useEffect(() => {
        if (openSection === null) {
            for (const group of userMenuGroups) {
                const activeItem = group.items.find(item => isSectionActive(item));
                if (activeItem && activeItem.subs) {
                    setOpenSection(activeItem.section);
                    break;
                }
            }
        }
    }, [location.pathname, userMenuGroups, isSectionActive, openSection]); 

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const sidebarWidth = isCollapsed ? 'md:w-20' : 'md:w-72';

    return (
        <>
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* 1. Botón Móvil (Hamburguesa) */}
            <button className="md:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-md shadow-lg" onClick={() => setIsOpen(!isOpen)}>
                <Bars3Icon className="h-6 w-6" />
            </button>

            {/* 2. Overlay Móvil */}
            <div 
                className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden
                    ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            {/* 3. Sidebar Container */}
            <div
                className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-sm z-40 transition-all duration-300 ease-in-out flex flex-col
                    ${isOpen ? 'translate-x-0 w-72' : '-translate-x-full'} 
                    ${sidebarWidth} md:translate-x-0`}
                style={{ height: '100dvh' }}
            >
                {/* Botón Flotante para Retraer/Expandir (Solo visible en PC) */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute -right-3.5 top-8 bg-white border border-gray-200 rounded-full p-1.5 shadow-md z-50 hover:bg-gray-50 text-gray-600 transition-transform"
                >
                    <ChevronLeftIcon className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                </button>

                {/* HEADER */}
                <div className={`flex items-center justify-center flex-shrink-0 border-b border-gray-100 transition-all duration-300 relative ${isCollapsed ? 'h-24 md:h-20' : 'h-24'}`}>
                    
                    {/* Logo (SOLO en PC y SOLO cuando está colapsado) */}
                    <img 
                        src={logo} 
                        alt="Logo" 
                        className={`hidden md:block absolute w-14 h-14 object-contain transition-all duration-300 ${
                            isCollapsed ? 'opacity-100 scale-100 delay-100' : 'opacity-0 scale-50 pointer-events-none'
                        }`}
                    />

                    {/* Texto (SIEMPRE visible en móvil. En PC SOLO visible cuando está expandido) */}
                    <div className={`font-bold text-lg tracking-tight overflow-hidden transition-all duration-300 whitespace-nowrap 
                        ${isCollapsed ? 'md:w-0 md:opacity-0' : 'w-auto opacity-100'}`}>
                        SISTEMA - <span className="text-gray-400">PRESTAMOS</span>
                    </div>
                </div>

                {/* BODY (Mapeo por Grupos) */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-4 hide-scrollbar px-3 relative">
                    {userMenuGroups.map((group, gIndex) => (
                        <div key={gIndex} className="mb-2">
                            
                            {/* Título del Grupo / Separador */}
                            <div className={`px-4 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all duration-300
                                ${isCollapsed ? 'md:opacity-0 md:h-0 md:mb-0 overflow-hidden' : 'opacity-100'}`}>
                                {group.groupName}
                            </div>
                            
                            {/* Línea divisoria cuando está colapsado */}
                            {isCollapsed && gIndex !== 0 && (
                                <div className="hidden md:block border-t border-slate-100 my-3 mx-4" />
                            )}

                            {/* Items del Grupo */}
                            <div className="space-y-1">
                                {group.items.map((item, idx) => {
                                    const isActive = isSectionActive(item); 
                                    const isSubOpen = item.subs && openSection === item.section; 
                                    const IconComponent = item.icon || CubeIcon;
                                    
                                    const itemBaseClasses = "flex items-center flex-nowrap w-full p-3 rounded-lg transition-all duration-200 group relative overflow-hidden";
                                    const activeClasses = "bg-black text-white shadow-lg shadow-gray-200"; 
                                    const inactiveClasses = "text-gray-600 hover:bg-gray-100 hover:text-black"; 
                                    
                                    return (
                                        <div key={idx}>
                                            {item.subs ? (
                                                <>
                                                    <button 
                                                        onClick={() => handleSectionClick(item.section)} 
                                                        className={`${itemBaseClasses} ${isActive && isCollapsed ? 'bg-gray-100 text-black' : (isActive ? activeClasses : inactiveClasses)}`}
                                                        title={isCollapsed ? item.section : ''}
                                                    >
                                                        <IconComponent className="h-6 w-6 flex-shrink-0 min-w-[24px]" /> 
                                                        
                                                        <span className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 
                                                            ${isCollapsed ? 'md:w-0 md:opacity-0 md:ml-0' : 'md:w-auto md:opacity-100 ml-3'}`}>
                                                            {item.section}
                                                        </span>

                                                        <ChevronDownIcon 
                                                            className={`ml-auto h-4 w-4 transition-transform duration-300 flex-shrink-0
                                                            ${isSubOpen ? 'rotate-180' : ''}
                                                            ${isCollapsed ? 'md:hidden' : ''}
                                                        `} />
                                                    </button>

                                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out 
                                                        ${isSubOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}
                                                        ${isCollapsed ? 'md:hidden' : ''} 
                                                    `}>
                                                        <ul className="ml-4 pl-4 border-l border-gray-200 space-y-1">
                                                            {item.subs.map((sub, sIdx) => (
                                                                <li key={sIdx}>
                                                                    <Link to={sub.link} onClick={() => setIsOpen(false)} 
                                                                        className={`block py-2 px-3 rounded-md text-[13px] font-medium transition-colors truncate
                                                                        ${location.pathname.startsWith(sub.link) 
                                                                            ? 'text-black bg-gray-50' 
                                                                            : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}>
                                                                        {sub.name}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </>
                                            ) : (
                                                <Link to={item.link} onClick={() => setIsOpen(false)} 
                                                    className={`${itemBaseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                                                    title={isCollapsed ? item.section : ''}
                                                >
                                                    <IconComponent className="h-6 w-6 flex-shrink-0 min-w-[24px]" />
                                                    <span className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300
                                                        ${isCollapsed ? 'md:w-0 md:opacity-0 md:ml-0' : 'md:w-auto md:opacity-100 ml-3'}`}>
                                                        {item.section}
                                                    </span>
                                                </Link>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t border-gray-100 flex-shrink-0 bg-white">
                    <button onClick={() => setShowConfirm(true)} 
                        className={`flex items-center w-full p-3 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group ${isCollapsed ? 'md:justify-center' : ''}`} 
                        title="Cerrar Sesión">
                        <ArrowRightOnRectangleIcon className="h-6 w-6 flex-shrink-0 min-w-[24px]" />
                        <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 font-medium 
                             ${isCollapsed ? 'md:w-0 md:opacity-0 md:ml-0' : 'md:w-auto md:opacity-100 ml-3'}`}>
                            Salir
                        </span>
                    </button>
                </div>
            </div>

            {showConfirm && (
                <ConfirmModal message="¿Deseas cerrar sesión del sistema?" onConfirm={handleLogout} onCancel={() => setShowConfirm(false)} />
            )}
        </>
    );
};

export default Sidebar;