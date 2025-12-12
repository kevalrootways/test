import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

export const usePermission = () => {
    const pageProps = usePage().props as any;
    const auth = pageProps.auth as { permissions?: string[]; user?: any } | undefined;

    const can = useMemo(() => {
        return (permission: string): boolean => {
            // Ensure we have a valid auth object and permissions array
            if (!auth || !auth.permissions || !Array.isArray(auth.permissions)) {
                return false;
            }
            return auth.permissions.includes(permission);
        };
    }, [auth?.permissions]);

    const hasRole = useMemo(() => {
        return (_role: string): boolean => {
            return false;
        };
    }, []);

    return { can, hasRole, auth };
};


