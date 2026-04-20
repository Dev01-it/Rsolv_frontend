"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Protected({ children }){
    const router = useRouter()
    const [allowed, setAllowed] = useState(false)

    useEffect(()=>{
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        if (!token){
            router.replace('/cms-admin')
            return
        }

        // If you want server-side verification, call the verify endpoint here.
        setAllowed(true)
    },[router])

    if (!allowed) return <div>Checking authentication...</div>

    return children
}
