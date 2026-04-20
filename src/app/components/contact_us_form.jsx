"use client"
import { useState } from 'react'
import { Base_url } from '../api/post'

export default function ContactUsForm(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [requestType, setRequestType] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e){
    e.preventDefault()
    setStatus(null)
    if (!name || !email || !description) return setStatus({type:'error', text:'Name, email and description are required'})
    setLoading(true)
    try{
      const res = await fetch(`${Base_url}form/form-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, request_type: requestType, description })
      })
      if (!res.ok) {
        const text = await res.text().catch(()=>null)
        throw new Error(text || `Submit failed (${res.status})`)
      }
      setStatus({type:'success', text:'Message sent — we will contact you soon.'})
      setSubmitted(true)
      setName('')
      setEmail('')
      setPhone('')
      setRequestType('')
      setDescription('')
    }catch(err){
      setStatus({type:'error', text: err.message || 'Submission failed'})
    }finally{
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="screen">
        <div className="flex_center">
          <div className="check_bg flex_center">
            <i className="bi bi-check siz_100 c_w"></i>
          </div>
          <h2>Thank You!</h2>
          <h3>Our team will reach you soon</h3>
          <p className="siz_20 c_db">
            Connect with us <span><b>in</b></span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='contact_form'>
      <h2><i className="bi bi-envelope-fill contact_heading_icon" aria-hidden="true"></i>Send us a message</h2>
      {status && <div style={{color: status.type === 'success' ? 'green' : 'red', marginBottom:12}}>{status.text}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom:8}}>
          <label htmlFor="c-name">Name</label><br />
          <input id="c-name" value={name} onChange={e=>setName(e.target.value)} style={{width:'100%',padding:8,boxSizing:'border-box'}} required/>
        </div>
        <div style={{marginBottom:8}}>
          <label htmlFor="c-email">Email</label><br />
          <input id="c-email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:8,boxSizing:'border-box'}} required/>
        </div>
        <div style={{marginBottom:8}}>
          <label htmlFor="c-phone">Phone</label><br />
          <input id="c-phone" value={phone} onChange={e=>setPhone(e.target.value)} style={{width:'100%',padding:8,boxSizing:'border-box'}} required/>
        </div>
        <div style={{marginBottom:8}}>
          <label htmlFor="c-request">Request Type</label><br />
          <select id="c-request" value={requestType} onChange={e=>setRequestType(e.target.value)} style={{width:'100%',padding:8,boxSizing:'border-box'}} required>
            <option value="">Select request</option>
            <option value="Request For Product Information">Request For Product Information</option>
            <option value="Request For Alternative Column">Request For Alternative Column</option>
            <option value="Request For Quote">Request For Quote</option>
            <option value="Request For Sample">Request For Sample</option>
            <option value="Request For Technical Support">Request For Technical Support</option>
            <option value="Request For Webinar">Request For Webinar</option>
          </select>
        </div>
        <div style={{marginBottom:12}}>
          <label htmlFor="c-description">Description</label><br />
          <textarea id="c-description" value={description} onChange={e=>setDescription(e.target.value)} rows={10} style={{width:'100%',padding:8,boxSizing:'border-box'}} required/>
        </div>
        <div>
          <button type="submit" disabled={loading} className="btn_2">{loading ? 'Sending...' : 'Send Message'}</button>
        </div>
      </form>
    </div>
  )
}
