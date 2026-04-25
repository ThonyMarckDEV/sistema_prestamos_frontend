import React from 'react';
import { useUpdate } from 'hooks/Parametro/useUpdate';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import ParametroForm from 'components/Shared/Formularios/Parametro/ParametroForm';

const Update = () => {
    const { formData, clave, loading, saving, alert, setAlert, handleChange, handleSubmit } = useUpdate();

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <PageHeader
                title="Editar Parámetro"
                subtitle={`Clave: ${clave}`}
                buttonText="Volver"
                buttonLink="/parametro/listar"
            />
            <AlertMessage
                type={alert?.type}
                message={alert?.message}
                details={alert?.details}
                onClose={() => setAlert(null)}
            />
            <ParametroForm
                formData={formData}
                clave={clave}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                saving={saving}
            />
        </div>
    );
};

export default Update;