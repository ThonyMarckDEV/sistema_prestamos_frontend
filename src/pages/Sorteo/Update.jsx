import React from 'react';
import { useUpdate } from 'hooks/Sorteo/useUpdate';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import SorteoForm from 'components/Shared/Formularios/Sorteo/SorteoForm';
import { ESTADO } from 'components/Shared/Formularios/Sorteo/sorteoUtils';

const Update = () => {
    const { sorteo, formData, loading, saving, alert, setAlert, handleChange, handleSubmit } = useUpdate();

    if (loading) return <LoadingScreen />;

    const cerrado = sorteo?.estado === ESTADO.CERRADO;

    return (
        <div className="container mx-auto p-6 max-w-6xl transition-colors">
            <PageHeader
                title="Editar Sorteo"
                subtitle={sorteo?.estado_label}
                buttonText="Volver"
                buttonLink={sorteo ? `/sorteo/ver/${sorteo.id}` : '/sorteo/listar'}
            />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            {cerrado ? (
                <div className="mt-6 p-8 text-center rounded-3xl border border-dashed border-slate-300 dark:border-dark-border text-slate-500 dark:text-dark-text-muted font-bold">
                    Este sorteo está cerrado y ya no se puede modificar.
                </div>
            ) : sorteo && (
                <SorteoForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    loading={saving}
                    isEdit
                    estado={sorteo.estado}
                />
            )}
        </div>
    );
};

export default Update;
