import { useState, useEffect } from 'react';
import peruData from 'utilities/data/peruData';
import { onlyLetters, onlyNumbers } from 'utilities/Validations/validations';

export const useSolicitudForm = (data, handleChange) => {
    // 1. LÓGICA DE BLOQUEO (Riesgo Crediticio)
    const isMainBlocked = data.modalidad === 'RCS' || (data.modalidad && data.modalidad.includes('VIGENTE'));
    const hasBlockedIntegrante = data.integrantes?.some(int => int.modalidad === 'RCS' || (int.modalidad && int.modalidad.includes('VIGENTE')));
    const isBlocked = isMainBlocked || hasBlockedIntegrante;

    // 2. ESTADOS Y LÓGICA DEL AVAL
    const [tieneAval, setTieneAval] = useState(!!data.aval);
    const [provincias, setProvincias] = useState([]);
    const [distritos, setDistritos] = useState([]);

    const handleAvalInputChange = (field, value, type, limit) => {
        if (isBlocked) return;
        let validated = type === 'numeric' ? onlyNumbers(value, limit) : (type === 'letters' ? onlyLetters(value) : value);
        handleChange(`aval.${field}`, validated);
    };

    const handleToggleAval = (e) => {
        if (isBlocked) return;
        const checked = e.target.checked;
        setTieneAval(checked);
        handleChange('aval', checked ? { 
            dni_aval: '', nombres_aval: '', apellido_paterno_aval: '', 
            apellido_materno_aval: '', telefono_movil_aval: '', direccion_aval: '', 
            relacion_cliente_aval: '', departamento_aval: '', provincia_aval: '', distrito_aval: '' 
        } : null);
    };

    useEffect(() => {
        const dep = data.aval?.departamento_aval;
        setProvincias(dep && peruData[dep] ? Object.keys(peruData[dep]) : []);
    }, [data.aval?.departamento_aval]);

    useEffect(() => {
        const dep = data.aval?.departamento_aval;
        const prov = data.aval?.provincia_aval;
        setDistritos(dep && prov && peruData[dep][prov] ? peruData[dep][prov] : []);
    }, [data.aval?.provincia_aval, data.aval?.departamento_aval]);

    // 3. CÁLCULOS FINANCIEROS EN TIEMPO REAL
    const montoBase = parseFloat(data.monto_solicitado) || 0;
    const porcentajeInteres = parseFloat(data.tasa_interes) || 0;
    const nCuotas = parseInt(data.cuotas_solicitadas) || 1;
    
    const interesGenerado = montoBase * (porcentajeInteres / 100);
    const totalAPagar = montoBase + interesGenerado;
    const valorCuotaAprox = totalAPagar / nCuotas;

    return {
        isBlocked,
        isMainBlocked,
        hasBlockedIntegrante,
        avalConfig: {
            tieneAval, handleToggleAval, handleAvalInputChange, provincias, distritos
        },
        calculadora: {
            montoBase, porcentajeInteres, nCuotas, interesGenerado, totalAPagar, valorCuotaAprox
        }
    };
};