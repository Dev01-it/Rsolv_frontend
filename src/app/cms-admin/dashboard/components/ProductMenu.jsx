"use client"
import { useEffect, useState } from 'react'

export default function ProductMenu({ initialMode }){
    const [mode, setMode] = useState(initialMode || 'add')
    useEffect(()=>{ if (initialMode) setMode(initialMode) },[initialMode])

    return (
        <div>
            <h2>Product Menu</h2>
            {mode === 'add' && <p>Product menu form goes here.</p>}
            {mode === 'list' && <p>Product menu list goes here.</p>}
        </div>
    )
}
