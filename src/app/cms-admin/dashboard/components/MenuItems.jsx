"use client"
import React, { useState, useEffect } from 'react'
import { Base_url } from '@/app/api/post'

export default function MenuItemsForm(){
  const [parentTitle, setParentTitle] = useState('')
  const [childTitle, setChildTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [editingId, setEditingId] = useState(null)

  useEffect(() => { loadItems() }, [])

  async function loadItems(){
    try{
      const res = await fetch(`${Base_url}api/menu-items`)
      if (!res.ok) throw new Error(`Failed to load menu items (${res.status})`)
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    }catch(err){
      console.error(err)
      setStatus({ error: 'Unable to load menu items' })
    }
  }

  async function handleSubmit(e){
    e.preventDefault()
    setStatus(null)
    if (!parentTitle.trim() || !childTitle.trim()){
      setStatus({ error: 'Parent title and child title are required.' })
      return
    }

    const payload = {
      parent_title: parentTitle.trim(),
      child_title: childTitle.trim(),
      slug: slug ? String(slug).trim() : ""
    }

    if (slug && String(slug).trim() !== '') payload.slug = String(slug).trim()

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    try{
      setLoading(true)
      const url = editingId ? `${Base_url}api/menu-items/${editingId}` : `${Base_url}api/menu-items`
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok){
        const body = await res.json().catch(()=>null)
        let errMsg = `Request failed (${res.status})`
        if (body) {
          if (typeof body === 'string') errMsg = body
          else if (body.detail) errMsg = body.detail
          else if (body.message) errMsg = body.message
          else if (Array.isArray(body)) errMsg = body.join(', ')
          else if (typeof body === 'object') {
            const parts = []
            for (const [k,v] of Object.entries(body)){
              if (Array.isArray(v)) parts.push(`${k}: ${v.join('; ')}`)
              else parts.push(`${k}: ${String(v)}`)
            }
            errMsg = parts.join(' | ')
          } else {
            try { errMsg = JSON.stringify(body) } catch(e) { errMsg = String(body) }
          }
        }
        throw new Error(errMsg)
      }

      const data = await res.json().catch(()=>null)
      setStatus({ success: editingId ? 'Menu item updated.' : 'Menu item added.' , data})
      setParentTitle('')
      setChildTitle('')
      setSlug('')
      setEditingId(null)
      await loadItems()
    }catch(err){
      setStatus({ error: err.message || String(err) })
    }finally{ setLoading(false) }
  }

  async function handleEdit(item){
    setEditingId(item.id)
    setParentTitle(item.parent_title ?? item.parent_option ?? '')
    setChildTitle(item.child_title ?? item.child_option ?? '')
    setSlug(item.slug ?? '')
    setStatus(null)
  }

  async function handleDelete(id){
    if (!confirm('Delete this menu item?')) return
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    try{
      const res = await fetch(`${Base_url}api/menu-items/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      })
      if (!res.ok) throw new Error(`Delete failed (${res.status})`)
      setStatus({ success: 'Deleted.' })
      await loadItems()
    }catch(err){
      setStatus({ error: err.message || String(err) })
    }
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 ,width:"100%"}}>
        <div style={{ display: 'flex', gap: 12,width:900 }}>
          <div style={{ flex: 1, display: 'flex',flexDirection: 'column', gap: 6 }}>
            <label style={{ fontWeight: 600, marginBottom: 4 }}>Parent Title <span style={{ color: 'red' }}>*</span></label>
            <input value={parentTitle} onChange={(e) => setParentTitle(e.target.value)} placeholder="Parent title" required style={{ width: '100%', padding: 8, boxSizing: 'border-box', height: 40, fontSize: 14 }} />
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontWeight: 600, marginBottom: 4 }}>Child Title <span style={{ color: 'red' }}>*</span></label>
            <input value={childTitle} onChange={(e) => setChildTitle(e.target.value)} placeholder="Child title" required style={{ width: '100%', padding: 8, boxSizing: 'border-box', height: 40, fontSize: 14 }} />
          </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 600, marginBottom: 4 }}>Slug <span style={{ fontWeight: 400, color: '#666' }}>(optional)</span></label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug (optional)" style={{ width: '100%', padding: 8, boxSizing: 'border-box', height: 40, fontSize: 14 }} />
            </div>
        </div>


        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="submit" disabled={loading} style={{ padding: '10px 16px', background: '#438BA1', color: 'white', border: 'none', borderRadius: 6 }}>
            {loading ? 'Saving...' : (editingId ? 'Update Menu Item' : 'Add Menu Item')}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setParentTitle(''); setChildTitle(''); setSlug(''); setStatus(null) }} style={{ padding: '10px 12px' }}>Cancel</button>
          )}
        </div>

        {status?.error && <div style={{ color: 'red' }}>{status.error}</div>}
        {status?.success && <div style={{ color: 'green' }}>{status.success}</div>}
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>ID</th>
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Parent</th>
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Child</th>
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Slug</th>
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: 8 }}>{it.id}</td>
              <td style={{ padding: 8 }}>{it.parent_title ?? it.parent_option ?? ''}</td>
              <td style={{ padding: 8 }}>{it.child_title ?? it.child_option ?? ''}</td>
              <td style={{ padding: 8 }}>{it.slug ?? ''}</td>
              <td style={{ padding: 8 }}>
                <button onClick={() => handleEdit(it)} style={{ marginRight: 8 }}>Edit</button>
                <button onClick={() => handleDelete(it.id)} style={{ color: 'red' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
