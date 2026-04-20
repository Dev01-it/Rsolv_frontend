"use client"
import { useEffect, useState } from 'react'

export default function Products({ initialMode }){
    const [mode, setMode] = useState(initialMode || 'add')
    useEffect(()=>{ if (initialMode) setMode(initialMode) },[initialMode])

    return (
        <div>
            <h2>Products</h2>
            {mode === 'add' && <p>Product create form goes here.</p>}
            {mode === 'list' && <p>Products table/list goes here.</p>}
        </div>
    )
}
