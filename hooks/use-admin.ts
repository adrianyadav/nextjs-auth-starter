'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useMemo } from 'react';

// Cache admin status to prevent multiple API calls
let adminStatusCache: { [email: string]: boolean } = {};
let adminStatusLoading: { [email: string]: boolean } = {};

export function useAdmin() {
    const { data: session, status } = useSession();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    const sessionEmail = useMemo(() => session?.user?.email, [session?.user?.email]);

    useEffect(() => {
        async function checkAdminStatus() {
            if (status === 'loading') return;

            if (!sessionEmail) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            // Check cache first
            if (sessionEmail in adminStatusCache) {
                setIsAdmin(adminStatusCache[sessionEmail]);
                setLoading(false);
                return;
            }

            // If already loading for this email, wait
            if (adminStatusLoading[sessionEmail]) {
                return;
            }

            adminStatusLoading[sessionEmail] = true;

            try {
                const response = await fetch('/api/admin/check', {
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    adminStatusCache[sessionEmail] = data.isAdmin;
                    setIsAdmin(data.isAdmin);
                } else {
                    adminStatusCache[sessionEmail] = false;
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
                adminStatusCache[sessionEmail] = false;
                setIsAdmin(false);
            } finally {
                adminStatusLoading[sessionEmail] = false;
                setLoading(false);
            }
        }

        checkAdminStatus();
    }, [sessionEmail, status]);

    return { isAdmin, loading };
} 