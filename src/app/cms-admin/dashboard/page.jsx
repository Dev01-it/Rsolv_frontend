"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Protected from '../Protected'
import Logins from './components/Logins'
import ContactForm from './components/ContactForm'
import ApplicationNotes from './components/ApplicationNotes'
import MenuItems from './components/MenuItems'
import Products from './components/Products'
import ProductMenu from './components/ProductMenu'

const OPTIONS = [
    {
        key: 'logins',
        label: 'Logins',
        comp: Logins,
        children: [
            { key: 'logins.register', label: 'Register', mode: 'register' },
            { key: 'logins.list', label: 'See Users', mode: 'list' }
        ]
    },
    { key: 'contact', label: 'Contact Form', comp: ContactForm },
    {
        key: 'notes',
        label: 'Application Notes',
        comp: ApplicationNotes,
        children: [
            { key: 'notes.add', label: 'Add Note', mode: 'add' },
            { key: 'notes.list', label: 'See Notes', mode: 'list' }
        ]
    },
    {
        key: 'menu',
        label: 'Menu Items',
        comp: MenuItems,
        children: []
    },
    {
        key: 'products',
        label: 'Products',
        comp: Products,
        children: [
            { key: 'products.add', label: 'Add Product', mode: 'add' },
            { key: 'products.list', label: 'See Products', mode: 'list' }
        ]
    },
    {
        key: 'productMenu',
        label: 'Product Menu',
        comp: ProductMenu,
        children: [
            { key: 'productMenu.add', label: 'Add Menu', mode: 'add' },
            { key: 'productMenu.list', label: 'See Menus', mode: 'list' }
        ]
    }
]

export default function Dashboard(){
    const router = useRouter()
    const [selected, setSelected] = useState('')
    const [isSuperAdmin, setIsSuperAdmin] = useState(false)
    const [permissions, setPermissions] = useState([])

    // read user info and permissions returned by backend
    useEffect(()=>{
        const userJson = typeof window !== 'undefined' ? localStorage.getItem('user') : null
        if (userJson) {
            try{
                const u = JSON.parse(userJson)
                const isSA = !!(u && (
                    u.role === 'SUPERADMIN' ||
                    (Array.isArray(u.roles) && u.roles.includes('SUPERADMIN'))
                ))
                setIsSuperAdmin(isSA)
                setPermissions(Array.isArray(u.permissions) ? u.permissions : [])
                return
            }catch(e){ /* fallthrough to token fallback */ }
        }

        // fallback: try to parse token payload if user object not stored
        try{
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
            if (!token) return
            const payloadPart = token.split('.')[1]
            const json = atob(payloadPart.replace(/-/g,'+').replace(/_/g,'/'))
            const payload = JSON.parse(json)
            const isSA = !!(payload && (
                payload.role === 'SUPERADMIN' ||
                (Array.isArray(payload.roles) && payload.roles.includes('SUPERADMIN')) ||
                payload.is_superadmin === true ||
                payload.isSuperAdmin === true ||
                payload.superadmin === true
            ))
            setIsSuperAdmin(isSA)
            setPermissions(Array.isArray(payload.permissions) ? payload.permissions : [])
        }catch(e){ /* ignore */ }
    },[])

    function handleLogout(){
        try{ localStorage.removeItem('token') }catch(e){/* ignore */}
        router.replace('/cms-admin')
    }

    // Prefer backend-provided option keys when available (user.options)
    // Backend may return either an array of keys like ['contact','products']
    // or array of objects like [{ key: 'contact', label: 'Contact' }, ...]
    const PERM_MAP = {
        logins: 'users',
        contact: 'form fillups',
        notes: 'application-notes',
        menu: 'menu-items',
        products: 'Products',
        productMenu: 'product-menu'
    }

    let allowedKeys = null
    try{
        const userJson = typeof window !== 'undefined' ? localStorage.getItem('user') : null
        if (userJson){
            const u = JSON.parse(userJson)
            if (Array.isArray(u.options)){
                allowedKeys = u.options.map(opt => typeof opt === 'string' ? opt : (opt && opt.key)).filter(Boolean)
            }
        }
    }catch(e){ /* ignore parse errors */ }
    const allowedKeysKey = allowedKeys ? allowedKeys.join('|') : ''

    const visibleOptions = OPTIONS.filter(o => {
        // superadmin always sees everything
        if (isSuperAdmin) return true

        // if backend explicitly returned option keys, use them
        if (allowedKeys) return allowedKeys.includes(o.key)

        // fallback: map frontend keys to backend permission names
        const needed = PERM_MAP[o.key]
        if (!needed) return true
        return permissions.some(p => String(p).toLowerCase() === String(needed).toLowerCase())
    })
    // resolve selected component and pass initialMode when a child submenu is selected
    const selectedParentKey = selected && selected.includes('.') ? selected.split('.')[0] : selected
    const selectedEntry = visibleOptions.find(o => o.key === selectedParentKey)
    const SelectedComp = selectedEntry?.comp || (()=> <div />)
    const selectedChild = selectedEntry && selectedEntry.children ? selectedEntry.children.find(c=>c.key===selected) : null
    const initialMode = selectedChild?.mode || null

    // ensure selected is valid for current visible options (allow child keys)
    useEffect(()=>{
        const valid = !!visibleOptions.find(o => (
            selected === o.key || (selected && selected.startsWith(o.key + '.'))
        ))
        if (!selected || !valid){
            setSelected(visibleOptions[0]?.key || '')
        }
    // use stable primitive fingerprints instead of passing arrays directly
    },[isSuperAdmin, permissions.join(','), allowedKeysKey, selected])

    return (
        <Protected>
            <div style={{display:'flex',minHeight:'100vh'}}>
                <aside className="dashboard-aside">
                    <h3>Admin</h3>
                    <nav className="dashboard-nav">
                        {visibleOptions.map(o=> {
                            const active = o.key === selected || (selected && selected.startsWith(o.key + '.'))
                            const icon = (
                                o.key === 'logins' ? 'person-check' :
                                o.key === 'contact' ? 'envelope' :
                                o.key === 'notes' ? 'journal-text' :
                                o.key === 'menu' ? 'list' :
                                o.key === 'products' ? 'box-seam' :
                                'menu-button-wide'
                            )

                            if (o.children && o.children.length){
                                return (
                                    <div key={o.key} className="nav-item-with-children">
                                        <button
                                            onClick={() => setSelected(o.key)}
                                            className={`dashboard-button ${active? 'active' : ''}`}
                                            aria-haspopup="true"
                                        >
                                            <i className={`bi bi-${icon}`} aria-hidden="true"></i>
                                            <span>{o.label}</span>
                                        </button>
                                        <div className="submenu" role="menu" aria-label={`${o.label} submenu`}>
                                            {o.children.map(child => (
                                                <button
                                                    key={child.key}
                                                    className="submenu-button"
                                                    onClick={() => setSelected(child.key)}
                                                    role="menuitem"
                                                >
                                                    {child.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )
                            }

                            return (
                                <button
                                    key={o.key}
                                    onClick={() => setSelected(o.key)}
                                    className={`dashboard-button ${active? 'active' : ''}`}
                                >
                                    <i className={`bi bi-${icon}`} aria-hidden="true"></i>
                                    <span>{o.label}</span>
                                </button>
                            )
                        })}
                        <div style={{marginTop:8}}>
                            <button onClick={handleLogout} className="dashboard-button">
                                <i className="bi bi-box-arrow-right" aria-hidden="true"></i>
                                <span>Logout</span>
                            </button>
                        </div>
                    </nav>
                </aside>

                <main style={{flex:1,padding:24}}>
                    <SelectedComp initialMode={initialMode} />
                </main>
            </div>
        </Protected>
    )
}
