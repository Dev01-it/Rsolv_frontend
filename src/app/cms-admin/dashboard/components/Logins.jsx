"use client"
import { useEffect, useState, useRef } from 'react'
import { Base_url } from '../../../api/post'

export default function Logins({ initialMode }){
    const [mode, setMode] = useState(initialMode || 'register') // 'register' | 'list'
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [role, setRole] = useState('EDITOR')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [messageType, setMessageType] = useState(null) // 'success' | 'error' | null

    const [users, setUsers] = useState([])
    const didFetchRef = useRef(false)

    function formatServerMessage(data, fallback){
        if (!data) return fallback
        const candidate = data.detail ?? data.message ?? data
        if (typeof candidate === 'string') return candidate
        if (Array.isArray(candidate)){
            return candidate.map(item => typeof item === 'string' ? item : (item.msg || item.message || JSON.stringify(item))).join('; ')
        }
        if (typeof candidate === 'object'){
            const arr = candidate.errors || candidate.issues || candidate.details || null
            if (Array.isArray(arr)) return arr.map(it => it.msg || it.message || JSON.stringify(it)).join('; ')
            return candidate.msg || candidate.message || JSON.stringify(candidate)
        }
        return String(candidate)
    }

    useEffect(()=>{
        // if parent provided initialMode, respect it; otherwise default to register
        if (initialMode) setMode(initialMode)
        else setMode('register')
    },[initialMode])

    async function handleRegister(e){
        e.preventDefault()
        setMessage(null)
        setMessageType(null)
        if (!username) return setMessage('Username is required')
        if (!username) { setMessageType('error'); return setMessage('Username is required') }
        if (!password) { setMessageType('error'); return setMessage('Password is required') }
        if (password !== confirmPassword) { setMessageType('error'); return setMessage('Passwords do not match') }

        setLoading(true)
        try{
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
            const res = await fetch(`${Base_url}auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ username, password, confirm_password: confirmPassword, role })
            })
            const data = await res.json()
            if (!res.ok){
                setMessageType('error')
                setMessage(formatServerMessage(data, 'Failed to create user'))
            }else{
                setMessageType('success')
                setMessage('User created successfully')
                // clear form
                setUsername('')
                setPassword('')
                setConfirmPassword('')
                setRole('EDITOR')
            }
        }catch(err){
            setMessageType('error')
            setMessage(err.message || 'Request failed')
        }finally{
            setLoading(false)
        }
    }

    async function fetchUsers(){
        setLoading(true)
        setMessage(null)
        setMessageType(null)
        try{
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
            const res = await fetch(`${Base_url}auth/user`, {
                method: 'GET',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            })
            if (!res.ok) throw new Error(`Error ${res.status}`)
            const data = await res.json()
            // expect array
            setUsers(Array.isArray(data) ? data : (data.data || []))
        }catch(err){
            setMessageType('error')
            setMessage(err.message || 'Failed to load users')
        }finally{
            setLoading(false)
        }
    }

    function getUserId(u){
        return u?.id ?? u?.user_id ?? u?.pk ?? u?._id ?? u?.uid ?? null
    }

    async function handleDelete(u){
        const id = getUserId(u)
        if (!id) { setMessageType('error'); return setMessage('Unable to determine user id for delete') }
        if (!confirm(`Delete user ${u.username || id}?`)) return
        setLoading(true)
        setMessage(null)
        setMessageType(null)
        try{
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
            const res = await fetch(`${Base_url}auth/user/${id}`, {
                method: 'DELETE',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            })
            if (!res.ok){
                const data = await res.json().catch(()=>({}))
                setMessageType('error')
                setMessage(formatServerMessage(data, `Failed to delete (${res.status})`))
            }else{
                setMessageType('success')
                setMessage('User deleted')
                // refresh list
                fetchUsers()
            }
        }catch(err){
            setMessageType('error')
            setMessage(err.message || 'Delete request failed')
        }finally{
            setLoading(false)
        }
    }

    // when switching to list view, load users
    // guard with a ref so React StrictMode (dev) double-mount doesn't trigger duplicate requests
    useEffect(()=>{
        if (mode === 'list'){
            if (!didFetchRef.current){
                didFetchRef.current = true
                fetchUsers()
            }
        }else{
            // reset when leaving list view so subsequent navigations reload
            didFetchRef.current = false
        }
    },[mode])

    return (
        <div>
            <h2>Logins</h2>

            {mode === 'register' && (
                <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'60vh'}}>
                    <form onSubmit={handleRegister} style={{maxWidth:480,width:'100%',margin:'0 auto'}} aria-label="Register user form">
                        {message && <div style={{marginBottom:8,color: messageType==='success' ? 'green' : 'red'}}>{message}</div>}
                        <div style={{marginBottom:8}}>
                            <label htmlFor="reg-username">Username</label><br />
                            <input id="reg-username" value={username} onChange={e=>setUsername(e.target.value)} style={{width:'100%',boxSizing:'border-box',padding:8}} />
                        </div>
                        <div style={{marginBottom:8}}>
                            <label htmlFor="reg-password">Password</label><br />
                            <input id="reg-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',boxSizing:'border-box',padding:8}} />
                        </div>
                        <div style={{marginBottom:8}}>
                            <label htmlFor="reg-confirm">Confirm Password</label><br />
                            <input id="reg-confirm" type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} style={{width:'100%',boxSizing:'border-box',padding:8}} />
                        </div>
                        <div style={{marginBottom:12}}>
                            <label htmlFor="reg-role">Role</label><br />
                            <select id="reg-role" value={role} onChange={e=>setRole(e.target.value)} style={{width:'100%',boxSizing:'border-box',padding:8}}>
                                    <option value="SUPERADMIN">SUPERADMIN</option>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="EDITOR">EDITOR</option>
                            </select>
                        </div>
                        <div>
                            <button type="submit" disabled={loading} className="dashboard-button" style={{width:'100%',padding:10,background:'#0b9bb1',color:'#fff'}}>{loading? 'Creating...' : 'Create User'}</button>
                        </div>
                    </form>
                </div>
            )}

            {mode === 'list' && (
                <div>
                    {message && <div style={{marginBottom:8,color: messageType==='success' ? 'green' : 'red'}}>{message}</div>}
                    {loading && <div>Loading users...</div>}
                    {!loading && (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u, idx) => (
                                        <tr key={idx}>
                                            <td>{u.username ?? u.user ?? ''}</td>
                                            <td>{u.role ?? u.roles ?? ''}</td>
                                            <td style={{width:110}}>
                                                <button
                                                    type="button"
                                                    onClick={()=>handleDelete(u)}
                                                    title="Delete user"
                                                    aria-label={`Delete user ${u.username || ''}`}
                                                    style={{background:'#d9534f',border:'none',color:'#fff',padding:'6px 8px',borderRadius:6,cursor:'pointer'}}
                                                >
                                                    <i className="bi bi-trash" aria-hidden="true"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
