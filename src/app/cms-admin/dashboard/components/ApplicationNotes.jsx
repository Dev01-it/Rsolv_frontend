"use client";

import { useState, useEffect } from "react";
import { Base_url } from "@/app/api/post";

export default function ApplicationNoteForm({ initialMode }) {
  const [formData, setFormData] = useState({
    Title_name: "",
    Column_Name: "",
    Column_type: "", // mandatory
    Part_Code: "",
    Dimension: "",
    Flow_Ratio: "",
    Injection_Volume: "",
    Detection: "",
    Mobile_Phase: "",
    Column_Temperature: "",
    Sample_Temperature: "",
    slug: "",
    meta_title: "",
    canonical: "",
    keywords: "",
    description: "",
    status: "",
    image_file: "",
    pdf_file: "",
  });

  const [message, setMessage] = useState("");
  const [mode, setMode] = useState(initialMode || 'add')
  useEffect(()=>{
    if (initialMode) setMode(initialMode)
  },[initialMode])
  const [editingId, setEditingId] = useState(null)
  const [rows, setRows] = useState([])
  const [loadingRows, setLoadingRows] = useState(false)
  const [rowsError, setRowsError] = useState(null)

  useEffect(()=>{
    if (mode !== 'list') return
    let mounted = true
    async function load(){
      setLoadingRows(true)
      setRowsError(null)
      try{
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        const res = await fetch(`${Base_url}api/application-notes`, {
          method: 'GET',
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const data = await res.json()
        if (!mounted) return
        setRows(Array.isArray(data) ? data : (data.data || []))
      }catch(err){
        if (!mounted) return
        setRowsError(err.message || 'Failed to load')
      }finally{
        if (mounted) setLoadingRows(false)
      }
    }
    load()
    return ()=>{ mounted = false }
  },[mode])

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Column_type) {
      setMessage("Column_type is required!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in localStorage");
      }

      const body = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        body.append(key, value || "");
      });

      const isEdit = mode === 'edit' && editingId
      const url = isEdit ? `${Base_url}api/application-notes/${editingId}` : `${Base_url}api/application-notes`
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`Failed to submit: ${response.status}`);
      }

      setMessage(isEdit ? "Application note updated successfully!" : "Application note submitted successfully!");
      setFormData({
        Title_name: "",
        Column_Name: "",
        Column_type: "",
        Part_Code: "",
        Dimension: "",
        Flow_Ratio: "",
        Injection_Volume: "",
        Detection: "",
        Mobile_Phase: "",
        Column_Temperature: "",
        Sample_Temperature: "",
        slug: "",
        meta_title: "",
        canonical: "",
        keywords: "",
        description: "",
        status: "",
        image_file: "",
        pdf_file: "",
      });
      setEditingId(null)
      setMode('list')
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const getFieldFromObj = (obj, key) => {
    if (!obj) return undefined
    if (key in obj) return obj[key]
    const lower = key.toLowerCase()
    if (lower in obj) return obj[lower]
    const upper = key.toUpperCase()
    if (upper in obj) return obj[upper]
    const camel = key.replace(/_([a-z])/g, (_, c)=> c.toUpperCase())
    if (camel in obj) return obj[camel]
    return undefined
  }

  const handleEdit = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${Base_url}api/application-notes/${id}`, { method: 'GET', headers: token ? { Authorization: `Bearer ${token}` } : {} })
      if (!res.ok) throw new Error(`Failed to fetch item: ${res.status}`)
      const payload = await res.json()
      const item = payload && (payload.data || payload)
      const newForm = { ...formData }
      Object.keys(newForm).forEach(k=>{
        const val = getFieldFromObj(item, k)
        newForm[k] = val ?? ''
      })
      setFormData(newForm)
      setEditingId(id)
      setMode('edit')
      setMessage('')
    } catch(err){
      setMessage(`Error loading item: ${err.message}`)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this application note?')) return
    try{
      const token = localStorage.getItem('token')
      const res = await fetch(`${Base_url}api/application-notes/${id}`, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} })
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`)
      setMessage('Deleted successfully')
      setRows(prev => prev.filter(r => {
        const rid = r.id ?? r.ID ?? r.Id ?? r.pk ?? r.pk_id
        return String(rid) !== String(id)
      }))
    }catch(err){
      setMessage(`Delete error: ${err.message}`)
    }
  }

  const visibleCols = ['id','column_type','title_name','column_name','status','created_at','updated_at','created_by','updated_by','actions']

  return (
    <div >
      {mode === 'list' ? (
        <div>
          {loadingRows && <div>Loading notes...</div>}
          {rowsError && <div style={{color:'red'}}>{rowsError}</div>}
          {!loadingRows && !rowsError && (
            <div className="table-container" style={{ width: '100%', overflow: 'auto', maxHeight: '70vh' }}>
              <table className="data-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    {rows.length ? visibleCols.map(k=> <th key={k}>{k}</th>) : <th>No notes</th>}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx)=> (
                    <tr key={idx}>
                      {visibleCols.map(col => {
                        if (col === 'actions'){
                          const id = r.id ?? r.ID ?? r.Id ?? r.pk ?? r.pk_id
                          return (
                            <td key={col}>
                              <button onClick={()=> handleEdit(id)} style={{marginRight:8, background:'none', border:'none', padding:4, cursor:'pointer'}} aria-label="Edit">
                                <i className="bi bi-pencil" style={{fontSize:18}} aria-hidden="true" />
                              </button>
                              <button onClick={()=> handleDelete(id)} style={{background:'none', border:'none', padding:4, cursor:'pointer'}} aria-label="Delete">
                                <i className="bi bi-trash" style={{fontSize:18}} aria-hidden="true" />
                              </button>
                            </td>
                          )
                        }
                        const val = (r && (r[col] ?? r[col.toLowerCase()] ?? r[col.toUpperCase()])) ?? ''
                        return <td key={col}>{String(val)}</td>
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px 20px",
          width: "90%",
          maxWidth: "1200px",
        }}
      >
        {/* render all fields except description in the two-column grid */}
        {Object.keys(formData)
          .filter((f) => f !== "description")
          .map((field) => (
            <div key={field} style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
                {field.replace(/_/g, " ")}
                {field === "Column_type" && <span style={{ color: "red" }}> *</span>}
              </label>
              {field === "image_file" || field === "pdf_file" ? (
                <input type="file" name={field} onChange={handleChange} />
              ) : (
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                />
              )}
            </div>
          ))}

        {/* description should be full-width and placed below the other inputs */}
        <div style={{ gridColumn: "1 / span 2", display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={8}
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }}
          />
        </div>
        <div style={{ gridColumn: "1 / span 2", textAlign: "center" }}>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {mode === 'edit' ? 'Update' : 'Submit'}
          </button>
        </div>
      </form>
      )}
      {message && <p style={{ marginTop: "15px" }}>{message}</p>}
    </div>
  );
}