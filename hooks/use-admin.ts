'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useMemo } from 'react';

export function useAdmin() {
    const { data: session, status } = useSession();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // Memoize the session email to prevent unnecessary re-renders
    const sessionEmail = useMemo(() => session?.user?.email, [session?.user?.email]);

    useEffect(() => {
        async function checkAdminStatus() {
            if (status === 'loading') return;

            if (!sessionEmail) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/admin/check', {
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsAdmin(data.isAdmin);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        }

        checkAdminStatus();
    }, [sessionEmail, status]);

    return { isAdmin, loading };
} 