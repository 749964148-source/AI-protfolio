"use client";

import Link from "next/link";
import { BriefcaseBusiness, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [["作品集", "/#projects"], ["作品一", "/#project-01"], ["作品二", "/#project-02"], ["关于我", "/#about"]] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-leaf-100/80 bg-[#f7f9f2]/85 backdrop-blur-xl">
      <div className="container-page flex min-h-16 items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-2 font-bold text-leaf-900" aria-label="作品集首页">
          <span className="grid size-9 place-items-center rounded-full bg-leaf-700 text-white"><BriefcaseBusiness size={18} /></span>
          我的作品集
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-leaf-800 md:flex">
          {links.map(([label, href]) => <Link key={href} href={href} className="hover:text-leaf-600">{label}</Link>)}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/#about" className="btn-secondary !px-4 !py-2">关于我</Link>
          <Link href="/#projects" className="btn-primary !px-4 !py-2">查看作品</Link>
        </div>
        <button className="grid size-11 place-items-center rounded-full border border-leaf-200 bg-white md:hidden" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label="打开导航">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="container-page grid gap-2 border-t border-leaf-100 py-4 md:hidden">
          {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="min-h-11 rounded-xl px-3 py-2 font-medium">{label}</Link>)}
          <Link href="/#projects" className="btn-primary mt-2">查看四个作品</Link>
        </nav>
      )}
    </header>
  );
}
