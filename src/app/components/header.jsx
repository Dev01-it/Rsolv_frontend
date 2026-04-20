"use client"
import '../css/header.css'
import Link from 'next/link'
import Image from 'next/image'
import NavLink from './nav_link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Header(){
    const pathname = usePathname() || ''
    const [menuOpen, setMenuOpen] = useState(false)
    // hide header for cms-admin routes
    if (pathname.startsWith('/cms-admin')) return null

    return(
        <>
        <header className='header_main'>
            <div className='header'>
                <Image src={'/media/icons/RSolv Logo_png.png'} width={200} height={100} alt='Rsolv logo' loading="eager" priority />
                <nav className='nav desktop-nav'>
                    <NavLink href={'/'} >HOME</NavLink>
                    <NavLink href={'/about-us'} >ABOUT US</NavLink>
                    <NavLink href={''} >PRODUCTS</NavLink>
                    <NavLink href={'/application-notes'} >RESOURCES</NavLink>
                    <NavLink href={'/contact-us'} >CONTACT US</NavLink>
                </nav>

                <button aria-label="Open menu" className="hamburger" onClick={() => setMenuOpen(true)}>
                    <i className="bi bi-list" style={{ fontSize: '28px' }} aria-hidden="true" />
                </button>
            </div>

            <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} role="dialog" aria-hidden={!menuOpen}>
                <div className="mobile-menu-header">
                    <Image src={'/media/icons/RSolv Logo_png.png'} width={140} height={70} alt='Rsolv logo' />
                    <button aria-label="Close menu" className="mobile-close" onClick={() => setMenuOpen(false)}>×</button>
                </div>
                <nav className='mobile-nav'>
                    <NavLink href={'/'} onClick={() => setMenuOpen(false)}>HOME</NavLink>
                    <NavLink href={'/about-us'} onClick={() => setMenuOpen(false)}>ABOUT US</NavLink>
                    <NavLink href={''} onClick={() => setMenuOpen(false)}>PRODUCTS</NavLink>
                    <NavLink href={'/application-notes'} onClick={() => setMenuOpen(false)}>RESOURCES</NavLink>
                    <NavLink href={'/contact-us'} onClick={() => setMenuOpen(false)}>CONTACT US</NavLink>
                </nav>
            </div>

            {menuOpen && <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)} />}
        </header>
        </>
    )
}