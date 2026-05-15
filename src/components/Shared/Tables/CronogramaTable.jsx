import React from 'react';
import { CuotaCard } from './components/CuotaCard';

const CronogramaTable = ({
    cronograma = [],
    esVistaIntegrante = false,
    onHistorialModal,
    onReducirMora,
    extraColumns = [],
}) => {
    const sharedProps = {
        cronograma,
        esVistaIntegrante,
        onHistorialModal,
        onReducirMora: esVistaIntegrante ? undefined : onReducirMora,
        extraColumns,
    };

    return (
        <div className="flex flex-col gap-3">
            {cronograma.map((cuota, i) => (
                <CuotaCard key={cuota.nro ?? i} cuota={cuota} i={i} {...sharedProps} />
            ))}
        </div>
    );
};

export default CronogramaTable;