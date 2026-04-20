"use client"
import { useState, useEffect } from 'react'
import { fetch_applicationnote_by_slug } from '../../api/get'
import { Base_url } from '../../api/post'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Title_bar from '@/app/components/title_bar'

function makeAbsoluteUrl(path) {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const base = Base_url.replace(/\/$/, '')
  return path.startsWith('/') ? base + path : base + '/' + path
}

export default function SlugPage(){
  const params = useParams()
  const slug = params?.slug
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!slug) return setError('missing slug')
    let mounted = true
    setLoading(true)
    setError(null)
    setData(null)
    fetch_applicationnote_by_slug(slug)
      .then((res) => { if (mounted) setData(res) })
      .catch((err) => { if (mounted) setError(err?.message || String(err)) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [slug])

  if (!slug) return (
    <div style={{ padding: 16 }}>
      <p>Invalid or missing slug.</p>
      <Link href="/application-notes">← Back to Application Notes</Link>
    </div>
  )

  if (loading) return (<div style={{ padding: 16 }}>Loading...</div>)
  if (error) return (
    <div style={{ padding: 16 }}>
      <p>Unable to load record for {slug}</p>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{String(error)}</pre>
      <Link href="/application-notes">← Back to Application Notes</Link>
    </div>
  )

  // Normalize response shapes
  let record = null
  if (!data) return (<div style={{ padding: 16 }}>No data</div>)
  if (Array.isArray(data)) record = data[0]
  else if (data && data.data) record = Array.isArray(data.data) ? data.data[0] : data.data
  else record = data

  const imgUrl = makeAbsoluteUrl(record?.image_url)
  const pdfUrl = makeAbsoluteUrl(record?.pdf_url)

  return (
    <>
    <Title_bar title={record?.title_name ?? record?.title ?? slug}/>
      <div className="page-wrapper">
        <div className='product-container'>
                {imgUrl ? (
                    <img id="product-image" className="product-image" src={imgUrl} alt={record?.title_name ?? ''} />
                ) : null}
                <div className='details'>
                  {record?.part_code ? (
                    <p><strong>Part Code:</strong> <span id="part-code">{record.part_code}</span></p>
                  ) : null}
                  {record?.column_name ? (
                    <p><strong>Column:</strong> <span id="column">{record.column_name}</span></p>
                  ) : null}
                  {record?.dimension ? (
                    <p><strong>Dimension:</strong> <span id="dimension">{record.dimension}</span></p>
                  ) : null}
                  {record?.flow_ratio ? (
                    <p><strong>Flow Ratio:</strong> <span id="flow-ratio">{record.flow_ratio}</span></p>
                  ) : null}
                  {record?.injection_volume ? (
                    <p><strong>Injection Volume:</strong> <span id="injection-volume">{record.injection_volume}</span></p>
                  ) : null}
                  {record?.detection ? (
                    <p><strong>Detection:</strong> <span id="detection">{record.detection}</span></p>
                  ) : null}
                  {record?.mobile_phase ? (
                    <p><strong>Mobile Phase:</strong> <span id="mobile-phase">{record.mobile_phase}</span></p>
                  ) : null}
                  {record?.column_temperature ? (
                    <p><strong>Column Temperature:</strong> <span id="column-temperature">{record.column_temperature}</span></p>
                  ) : null}
                  {record?.sample_temperature ? (
                    <p><strong>Sample Temperature:</strong> <span id="sample-temperature">{record.sample_temperature}</span></p>
                  ) : null}
                  {pdfUrl ? (
                    <a id="download-pdf" href={pdfUrl} className="download-btn" target="_blank" rel="noreferrer">Download PDF</a>
                  ) : null}
                </div>
            </div>
        </div>
    </>
  )
}
