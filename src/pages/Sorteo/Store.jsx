import React from 'react';
import { useStore } from 'hooks/Sorteo/useStore';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import SorteoForm from 'components/Shared/Formularios/Sorteo/SorteoForm';

const Store = () => {
    const { formData, loading, alert, setAlert, handleChange, handleSubmit } = useStore();

    return (
        <div className="container mx-auto p-6 max-w-6xl transition-colors">
            <PageHeader title="Nuevo Sorteo" buttonText="Volver" buttonLink="/sorteo/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            <SorteoForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} loading={loading} />
        </div>
    );
};

export default Store;
