import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const number = slug.match(/(\d+)/)?.[1] ?? "01";

  return (
    <main className="min-h-screen bg-[#f7f9f2] py-10 md:py-16">
      <div className="container-page max-w-4xl">
        <Link href="/#projects" className="inline-flex items-center gap-2 text-sm font-semibold text-leaf-700 hover:text-leaf-900"><ArrowLeft size={17} /> 返回作品集</Link>
        <div className="mt-10 overflow-hidden rounded-[2.25rem] border border-leaf-100 bg-[#fffdf8] shadow-soft">
          <div className="flex min-h-[260px] items-end justify-between bg-gradient-to-br from-[#dcead0] via-[#edf4e8] to-[#f8efe3] p-8 md:p-12"><div><p className="eyebrow">Project {number} · Case Study</p><h1 className="mt-4 text-4xl font-semibold tracking-[-.05em] text-leaf-900 md:text-6xl">作品 {number} · 项目详情</h1></div><span className="font-mono text-7xl font-semibold tracking-[-.1em] text-leaf-900/20">{number}</span></div>
          <div className="space-y-8 p-8 md:p-12"><p className="text-lg leading-8 text-leaf-800/75">这是项目详情页占位。收到你的真实作品后，可以在这里展开项目背景、目标、角色、关键决策、过程产出和最终结果。</p><div className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl bg-leaf-50 p-5"><span className="text-xs font-bold text-leaf-600">01 · 背景</span><p className="mt-3 text-sm leading-6 text-leaf-800/70">用户与业务问题</p></div><div className="rounded-2xl bg-leaf-50 p-5"><span className="text-xs font-bold text-leaf-600">02 · 贡献</span><p className="mt-3 text-sm leading-6 text-leaf-800/70">你的角色与关键判断</p></div><div className="rounded-2xl bg-leaf-50 p-5"><span className="text-xs font-bold text-leaf-600">03 · 结果</span><p className="mt-3 text-sm leading-6 text-leaf-800/70">上线表现与复盘结论</p></div></div><Link href="/#projects" className="inline-flex items-center gap-2 rounded-full bg-leaf-700 px-5 py-3 font-semibold text-white hover:bg-leaf-800">浏览其他作品 <ArrowUpRight size={17} /></Link></div>
        </div>
      </div>
    </main>
  );
}
