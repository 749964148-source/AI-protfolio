import Link from "next/link";
import { ArrowLeft, Leaf } from "lucide-react";

export function PageShell({ title, eyebrow, children, care = false }: { title: string; eyebrow: string; children: React.ReactNode; care?: boolean }) {
  return (
    <main className={care ? "min-h-screen bg-[#fbf8ed] text-[18px]" : "min-h-screen"}>
      <div className="container-page py-6 md:py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 font-semibold text-leaf-800 hover:bg-white"><ArrowLeft size={18} /> 返回首页</Link>
          <span className="inline-flex items-center gap-2 rounded-full bg-leaf-100 px-4 py-2 text-sm font-semibold text-leaf-800"><Leaf size={16} /> {care ? "关怀模式" : "标准模式"}</span>
        </div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className={care ? "mt-3 text-4xl font-bold text-leaf-900 md:text-6xl" : "section-title"}>{title}</h1>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}
