import { useState, useEffect } from 'react';
import { misSorteos } from 'services/sorteoService';

/** Sorteos vigentes del cliente logueado. Sólo consulta si `enabled` (rol cliente). */
export const useMisSorteos = (enabled) => {
    const [sorteos, setSorteos] = useState([]);
    const [loading, setLoading] = useState(enabled);

    useEffect(() => {
        if (!enabled) return;
        let alive = true;
        misSorteos()
            .then((res) => { if (alive) setSorteos(Array.isArray(res.data) ? res.data : []); })
            .catch(() => { if (alive) setSorteos([]); }) // silencioso: el Home no debe romperse por esto
            .finally(() => { if (alive) setLoading(false); });
        return () => { alive = false; };
    }, [enabled]);

    return { sorteos, loading };
};
