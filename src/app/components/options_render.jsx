"use client"
import { fetchMenuItems_byType } from "../api/get"
import { useState, useEffect } from "react"
import '../css/main.css'

export default function Fetch_options_by_type({ type, onSelect, selectedSlug = null }) {
    const [options, setoptions] = useState([])
    useEffect(() => {
        async function Loadoptions() {
            try {
                const data = await fetchMenuItems_byType(type)
                setoptions(data || [])
                // notify parent of initial selection (first valid child_option)
                if (Array.isArray(data) && data.length > 0 && typeof onSelect === 'function') {
                    const first = data.find((opt) => opt && opt.child_option && String(opt.child_option).trim() !== '') || data[0];
                    const initialValue = first?.child_option || first?.slug || null;
                    if (initialValue) onSelect(initialValue)
                }
            } catch (err) {
                console.log(err)
            }
        }
        Loadoptions()
    }, [type])

    return (
        <>
            <div className="option_containor">
                {options
                    .filter((opt) => opt && opt.child_option && String(opt.child_option).trim() !== '')
                    .map((option, idx) => {
                        const key = option?.id || option?.slug || option?.child_option || idx;
                        const label = option.child_option;
                        const value = option.child_option || option?.slug || null;
                        const active = selectedSlug && String(selectedSlug) === String(value);
                        return (
                            <button
                                key={key}
                                onClick={() => { if (typeof onSelect === 'function') onSelect(value); }}
                                className={active ? "option_btn active" : "option_btn"}
                            >
                                {label}
                            </button>
                        );
                    })}
            </div>
        </>
    )
}