"use client"
import Title_bar from "../components/title_bar";
import Fetch_options_by_type from "../components/options_render";
import { fetch_applicationnotes_by_column_type } from "../api/get";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'

export default function Application_notes(){
    const [selected, setSelected] = useState(null)
    const [rows, setRows] = useState([])
    const router = useRouter()

    useEffect(() => {
        if (!selected) return;
        let mounted = true;
        async function load() {
            try {
                const data = await fetch_applicationnotes_by_column_type(selected)
                if (mounted) setRows(Array.isArray(data) ? data : [])
            } catch (err) {
                console.error(err)
                if (mounted) setRows([])
            }
        }
        load()
        return () => { mounted = false }
    }, [selected])

    return(
        <>
            <Title_bar title={'Application Notes'} />
            <div className="option_containor">
                <Fetch_options_by_type type={'application_notes'} onSelect={setSelected} selectedSlug={selected} />
            </div>

            <div style={{ marginTop: 16 }}>
                {rows.length > 0 ? (
                    <table className="application_table">
                        <thead>
                            <tr>
                                <th className="application_table_th">Product Name</th>
                                <th className="application_table_th">Column Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r, i) => (
                                <tr
                                    key={r.id || i}
                                    onClick={() => {
                                        const target = r?.slug || r?.id;
                                        if (target) router.push(`/application-notes/${target}`);
                                        else console.warn('Record has no identifier, not navigating', r);
                                    }}
                                    style={{ cursor: r?.slug || r?.id ? 'pointer' : 'default' }}
                                >
                                    <td className="application_table_td">{r.title_name ?? r.title ?? ''}</td>
                                    <td className="application_table_td">{r.column_name ?? ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No records to display.</p>
                )}
            </div>
        </>
    )
}