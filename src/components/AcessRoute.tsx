import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react'

/**
 * A function that handles access control for routes based on the user's authentication status.
 *
 * @param {boolean} loged - Flag indicating if the user is logged in
 * @param {React.ReactNode} children - React component to render based on authentication status
 * @param {string} toLogin - Path to redirect if user isn't logged in
 * @param {string} toNoLogin - Path to redirect if user is logged in
 * @return {React.ReactNode} The appropriate React component based on authentication status
 */

export default function AcessRoute({
    loged,
    children,
    toLogin = '/auth/login',
    toNoLogin = '/'
}: {
    loged: boolean,
    children: React.ReactNode,
    toLogin?: string,
    toNoLogin?: string
}) {
    const router = useRouter();
    const { data: session, status } = useSession();
    if(status === 'loading') return <div className="text-white">Loading...</div>

    if (loged && status === 'authenticated') {
        return children
    }else if(!loged && status === 'unauthenticated') {
        return children
    }else if(loged && status === 'unauthenticated') {
        router.push(toLogin)
    }else if(!loged && status === 'authenticated') {
        router.push(toNoLogin)
    }

}
