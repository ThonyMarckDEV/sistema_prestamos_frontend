import React from 'react';
import { useDashboardPagos } from 'hooks/Dashboard/useDashboardPagos';
import DashboardCard from 'components/Shared/Cards/DashboardCard';

const TABS = [
    { id: 'cards',   label: 'Resumen' },
    { id: 'diaria',  label: '30 días' },
    { id: 'mensual', label: '12 meses' },
];

const PagoCard = () => {
    const {
        loading, data,
        fechaInicio, setFechaInicio,
        fechaFin,    setFechaFin,
        handleFiltrar, handleLimpiar,
    } = useDashboardPagos();

    const cards   = data?.cards             ?? [];
    const diaria  = data?.graficas?.diaria  ?? [];
    const mensual = data?.graficas?.mensual ?? [];

    const graficas = [
        // Tab diaria
        { tab: 'diaria',  tipo: 'area',   data: diaria,  xKey: 'fecha', dataKey: 'total',    label: 'Monto recaudado (S/)',  color: '#8B1A1A', height: 200 },
        { tab: 'diaria',  tipo: 'barra',  data: diaria,  xKey: 'fecha', dataKey: 'cantidad', label: 'Cantidad de pagos',     color: '#F5A623', isMoney: false, height: 150 },
        // Tab mensual
        { tab: 'mensual', tipo: 'barra',  data: mensual, xKey: 'mes',   dataKey: 'total',    label: 'Monto recaudado (S/)',  color: '#8B1A1A', height: 200 },
        { tab: 'mensual', tipo: 'barra',  data: mensual, xKey: 'mes',   dataKey: 'cantidad', label: 'Cantidad de pagos',     color: '#F5A623', isMoney: false, height: 150 },
    ];

    return (
        <DashboardCard
            title="Pagos"
            subtitle="Módulo de recaudación"
            icon="banknotes"
            loading={loading}
            cards={cards}
            graficas={graficas}
            tabs={TABS}
            conFiltros={true}
            fechaInicio={fechaInicio} setFechaInicio={setFechaInicio}
            fechaFin={fechaFin}       setFechaFin={setFechaFin}
            onFiltrar={handleFiltrar}
            onLimpiar={handleLimpiar}
        />
    );
};

export default PagoCard;