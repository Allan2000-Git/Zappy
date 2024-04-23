"use client"

import React, { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'

interface ProvidersProps {
    children: ReactNode,
}

const AuthProvider = ({children}:ProvidersProps) => {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}

export default AuthProvider