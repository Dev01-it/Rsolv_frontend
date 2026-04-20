"use client"
import '../css/footer.css'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Head from 'next/head'

export default function Footer(){
    const pathname = usePathname() || ''
    // hide footer for cms-admin routes
    if (pathname.startsWith('/cms-admin')) return null

    return(
        <>
            <Head>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
            </Head>
            <footer className="footer">
                <div className='footer_grid'>
                    <div className="left_col">
                        <img src="/media/icons/RSolv Logo_png.png" alt="RSolv logo" className="footer_logo" />
                    </div>
                    <div className="center_col">
                        <ul>
                            <h2>Quick Links</h2>
                            <li><Link href={'/'}>Home</Link></li>
                            <li><Link href={'/'}>About us</Link></li>
                            <li><Link href={'/'}>Products</Link></li>
                            <li><Link href={'/'}>Application Notes</Link></li>
                        </ul>
                    </div>
                    <div className="right_col">
                        <h2>Contact Us</h2>
                        <p>
                            <i className="bi bi-envelope-fill footer_icon" aria-hidden="true"></i>
                            <Link href="mailto:info@rsolv-lifesciences.com">
                                info@rsolv-lifesciences.com
                            </Link>
                        </p>
                        <p>
                            <i className="bi bi-geo-alt-fill footer_icon" aria-hidden="true"></i>
                            North Carolina, USA
                        </p>
                        <p className="social_row">
                            <span>Social Media</span>
                            <a href="#" className="social_linkedin" title="LinkedIn" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                                <i className="bi bi-linkedin" aria-hidden="true"></i>
                            </a>
                        </p>
                    </div>
                    <div>
                        <p className='text-c'><b>Copyright © 2023<u>RSolv Lifesciences</u>All Rights Reserved.</b></p>
                    </div>
                </div>
            </footer>
        </>
    )
}