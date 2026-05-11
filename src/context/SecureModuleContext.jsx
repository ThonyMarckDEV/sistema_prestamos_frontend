import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { verifyPassword } from 'services/securityService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const UNLOCK_MS = 5 * 60 * 1000; // 5 minutos

const SecureModuleContext = createContext(null);

export function SecureModuleProvider({ children }) {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [verifying,  setVerifying]  = useState(false);
    const [error,      setError]      = useState(null);
    const timerRef = useRef(null);

    const clearTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };

    const startTimer = useCallback(() => {
        clearTimer();
        timerRef.current = setTimeout(() => setIsUnlocked(false), UNLOCK_MS);
    }, []);

    useEffect(() => () => clearTimer(), []);

    const unlock = useCallback(async (password) => {
        setVerifying(true);
        setError(null);
        try {
            await verifyPassword(password);
            setIsUnlocked(true);
            startTimer();
            return true;
        } catch (err) {
            const parsed = handleApiError(err);
            setError(parsed?.message ?? 'Contraseña incorrecta.');
            return false;
        } finally {
            setVerifying(false);
        }
    }, [startTimer]);

    const lock = useCallback(() => {
        clearTimer();
        setIsUnlocked(false);
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return (
        <SecureModuleContext.Provider value={{ isUnlocked, verifying, error, unlock, lock, clearError }}>
            {children}
        </SecureModuleContext.Provider>
    );
}

export function useSecureModule() {
    const ctx = useContext(SecureModuleContext);
    if (!ctx) throw new Error('useSecureModule debe usarse dentro de <SecureModuleProvider>');
    return ctx;
}