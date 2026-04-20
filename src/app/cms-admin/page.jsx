'use client'
import { Base_url } from '../api/post'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function CmsAdmin(){
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const lastSubmitRef = useRef(0)
    const DEBOUNCE_MS = 1500

    async function handleSubmit(e){
        e.preventDefault()
        const now = Date.now()
        if (now - lastSubmitRef.current < DEBOUNCE_MS) return
        lastSubmitRef.current = now

        setSubmitting(true)
        setError(null)
        try{
            const res = await fetch(`${Base_url}auth/login`,{
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })

            if (!res.ok) {
                const text = await res.text()
                throw new Error(text || `Login failed (${res.status})`)
            }

            const data = await res.json().catch(()=>null)
            const token = data && (data.token || data.access || data.access_token || data.jwt || data.authToken || (data.data && data.data.token))

            if (!token) {
                // no token in response
                throw new Error('No token returned from server')
            }

            try{
                localStorage.setItem('token', token)
                // store user object if backend returned it
                const userObj = data && (data.user || (data.data && data.data.user))
                if (userObj) localStorage.setItem('user', JSON.stringify(userObj))
            }catch(err){
                console.warn('Unable to access localStorage', err)
            }

            // Success: redirect to dashboard
            setSubmitting(false)
            router.replace('/cms-admin/dashboard')
        }catch(err){
            // Network errors often appear as "Failed to fetch"
            if (err && err.message && err.message.toLowerCase().includes('failed to fetch')){
                setError('Failed to fetch — ensure the backend is running and CORS is allowed')
            } else {
                setError(err.message || 'Request failed')
            }
        }finally{
            setSubmitting(false)
        }
    }

    return(
        <div className='screen'>
            <form onSubmit={handleSubmit}>
                <h1>RSolv Admin Login</h1>

                <label htmlFor="username">Username</label>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    name="username"
                    id="username"
                    required
                    placeholder="Enter username"
                />

                <label htmlFor="password">Password</label>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    name="password"
                    id="password"
                    required
                    placeholder="Enter password"
                />

                <button type="submit" disabled={submitting}>{submitting ? 'Logging in...' : 'Login'}</button>

                {error && <div className="form-error">{error}</div>}
            </form>
        </div>
    )
}