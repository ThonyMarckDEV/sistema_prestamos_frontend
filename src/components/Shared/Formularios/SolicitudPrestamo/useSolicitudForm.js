import { useState, useEffect } from 'react';
import peruData from 'utilities/data/peruData';
import { onlyLetters, onlyNumbers } from 'utilities/Validations/validations';

export const useSolicitudForm = (data, handleChange) => {
    // 1. LÓGICA DE BLOQUEO (Riesgo Crediticio + DNI DEL BACKEND)
    const dniPrincipalVencido = data.dni_status?.estado === 'VENCIDO';
    const dniIntegranteVencido = data.es_grupal && data.integrantes?.some(int => int.dni_status?.estado === 'VENCIDO');

    // Riesgo Crediticio: Bloquea SOLO si piden GRUPAL y ya tienen un GRUPAL
    const principalBloqueadoPorRiesgo = data.es_grupal && 
        (data.modalidad?.includes('GRUPAL') && (data.modalidad?.includes('VIGENTE') || data.modalidad?.includes('RCS')));

    const integranteBloqueadoPorRiesgo = data.es_grupal && data.integrantes?.some(int => 
        int.modalidad?.includes('GRUPAL') && (int.modalidad?.includes('VIGENTE') || int.modalidad?.includes('RCS'))
    );

    const isMainBlocked = dniPrincipalVencido || principalBloqueadoPorRiesgo;
    const hasBlockedIntegrante = dniIntegranteVencido || integranteBloqueadoPorRiesgo;
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

    return {
        isBlocked,
        isMainBlocked,
        hasBlockedIntegrante,
        avalConfig: { tieneAval, handleToggleAval, handleAvalInputChange, provincias, distritos }
    };
};