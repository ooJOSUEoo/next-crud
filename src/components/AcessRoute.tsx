import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function AcessRoute({
    loged,
    children
}: {
    loged: boolean,
    children: React.ReactNode
}) {
    const router = useRouter();
    const { data: session, status } = useSession();
    if(status === 'loading') return <div className="text-white">Loading...</div>

    if (loged && status === 'authenticated') {
        return children
    }else if(!loged && status === 'unauthenticated') {
        return children
    }else if(loged && status === 'unauthenticated') {
        router.push('/auth/login')
    }else if(!loged && status === 'authenticated') {
        router.push('/')
    }

}
