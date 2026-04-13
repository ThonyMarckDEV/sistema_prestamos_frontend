import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/productoService';
import ProductoForm from 'components/Shared/Formularios/Producto/ProductoForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

const Store = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [formData, setFormData] = useState({ nombre: '', rango_tasa: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await store(formData);
            setAlert({ type: 'success', message: 'Producto registrado.' });
            setTimeout(() => navigate('/producto/listar'), 1500);
        } catch (err) { setAlert({ type: 'error', message: 'Error al registrar.' }); }
        finally { setLoading(false); }
    };

    return (
        <div className="container mx-auto p-6 max-w-3xl">
            <PageHeader title="Registrar Producto" buttonText="Volver" buttonLink="/producto/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
            <form onSubmit={handleSubmit} className="mt-6">
                <ProductoForm data={formData} handleChange={(f, v) => setFormData({...formData, [f]: v})} />
                <div className="mt-8 flex justify-end">
                    <button type="submit" disabled={loading} className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black uppercase shadow-lg shadow-red-500/30 hover:bg-red-700 transition-all">
                        {loading ? 'Guardando...' : 'Guardar Producto'}
                    </button>
                </div>
            </form>
        </div>
    );
};
export default Store;