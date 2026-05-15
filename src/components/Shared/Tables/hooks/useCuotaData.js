import { useMemo } from 'react';

/**
 * Hook que centraliza todos los cálculos derivados de una cuota.
 * Úsalo tanto en la card móvil como en la fila de tabla desktop.
 */
export const useCuotaData = (cuota, i, esVistaIntegrante) =>
    useMemo(() => {
        const nro     = cuota.nro ?? i + 1;
        const monto   = parseFloat(cuota.total_cuota ?? cuota.monto ?? 0);
        const capital = parseFloat(cuota.capital ?? 0);
        const interes = parseFloat(cuota.interes ?? 0);

        /* ── Seguro ── */
        const seguro = parseFloat(cuota.seguro ?? 0);
        let segPagado = parseFloat(cuota.seguro_pagado ?? 0);
        if (!esVistaIntegrante && cuota.integrantes?.length > 0) {
            segPagado = cuota.integrantes.reduce(
                (sum, int) => sum + parseFloat(int.seguro_pagado || 0),
                0,
            );
        }
        const segPend = Math.max(0, seguro - segPagado);

        /* ── Capital / Interés ── */
        const capPagado = parseFloat(cuota.capital_pagado ?? 0);
        const intPagado = parseFloat(cuota.interes_pagado ?? 0);
        const capPend   = parseFloat(cuota.capital_pendiente  ?? Math.max(0, capital - capPagado));
        const intPend   = parseFloat(cuota.interes_pendiente  ?? Math.max(0, interes - intPagado));

        /* ── Mora ── */
        const moraTotal  = parseFloat(cuota.mora_total ?? cuota.mora ?? 0);
        const moraPagada = parseFloat(cuota.mora_pagada ?? 0);
        const moraPend   = Math.max(0, moraTotal - moraPagada);

        /* ── Abonos / Excedentes ── */
        const abonado = esVistaIntegrante
            ? parseFloat(cuota.pago_total_real ?? cuota.pago_acumulado ?? 0)
            : parseFloat(cuota.pago_realizado  ?? cuota.pago_acumulado ?? 0);
        const acumInd    = esVistaIntegrante ? parseFloat(cuota.pago_acumulado ?? 0) : 0;
        const saldo      = parseFloat(cuota.saldo_pendiente ?? cuota.saldo_real ?? 0);
        const diasAtraso = cuota.dias_atraso || 0;

        const excAnt = esVistaIntegrante
            ? parseFloat(cuota.excedente_aplicado || 0)
            : parseFloat(cuota.excedente_consumido || 0) > 0
                ? parseFloat(cuota.excedente_consumido)
                : parseFloat(cuota.excedente_anterior || 0);
        const excConsInd = esVistaIntegrante ? parseFloat(cuota.excedente_consumido || 0) : 0;
        const excGen     = parseFloat(cuota.excedente_generado || 0);
        const pagoAcumGrupo = !esVistaIntegrante ? parseFloat(cuota.pago_acumulado || 0) : 0;

        /* ── Flags de estado ── */
        const esCancelada    = cuota.estado === 0;
        const esRefinanciada = cuota.estado === 6;
        const esInactiva     = esCancelada || esRefinanciada;
        const mostrarRecibido = abonado > 0;

        let estadoGlobal = cuota.estado;
        if (!esVistaIntegrante && cuota.integrantes?.length > 0 && !esInactiva) {
            if (saldo <= 0)               estadoGlobal = 2;
            else if (abonado > 0)         estadoGlobal = 5;
        }

        const tieneAbonos =
            mostrarRecibido ||
            acumInd > 0 ||
            excAnt > 0 ||
            moraPagada > 0 ||
            excGen > 0 ||
            excConsInd > 0 ||
            pagoAcumGrupo > 0;

        return {
            nro, monto, capital, interes,
            seguro, segPagado, segPend,
            capPagado, intPagado, capPend, intPend,
            moraTotal, moraPagada, moraPend,
            abonado, acumInd, saldo, diasAtraso,
            excAnt, excConsInd, excGen, pagoAcumGrupo,
            esCancelada, esRefinanciada, esInactiva,
            mostrarRecibido, estadoGlobal, tieneAbonos,
        };
    }, [cuota, i, esVistaIntegrante]);