"use client"; 

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, children, onClick }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className="nav_links"
      onClick={onClick}
      style={{ color: isActive ? "#539E53" : "#727272" }}
    >
      {children}
    </Link>
  );
}