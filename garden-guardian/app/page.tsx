import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronRight,
  CircleDot,
  Layers3,
  Mail,
  Sparkles,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";

type Project = {
  index: string;
  type: string;
  title: string;
  subtitle: string;
  summary: string;
  result: string;
  tags: string[];
  accent: string;
  href: string;
  featured?: boolean;
};

// 四个项目槽位：收到你的真实作品后，只需要替换这里的文字、链接和封面视觉。
const projects: Project[] = [
  { index: "01", type: "FEATURED PROJECT", title: "作品一 · 项目名称", subtitle: "一句话说清楚它解决了什么问题", summary: "用 2–3 句话交代背景、目标用户和你的核心贡献，让访客在进入详情前先理解项目价值。", result: "关键结果：待补充可量化成果或验证结论", tags: ["产品策略", "用户洞察", "方案落地"], accent: "from-[#dcead0] via-[#edf4e8] to-[#f8efe3]", href: "/projects/project-01", featured: true },
  { index: "02", type: "FEATURED PROJECT", title: "作品二 · 项目名称", subtitle: "把复杂过程整理成可读的决策故事", summary: "突出你面对的关键约束、做出的取舍，以及从洞察到交付之间最有代表性的工作。", result: "关键结果：待补充上线表现、效率提升或用户反馈", tags: ["体验设计", "流程优化", "跨团队协作"], accent: "from-[#e4e2f2] via-[#f1eef8] to-[#e7f0ed]", href: "/projects/project-02", featured: true },
  { index: "03", type: "PROJECT", title: "作品三 · 项目名称", subtitle: "展示你的另一种能力侧面", summary: "可以是数据分析、视觉设计、研究或独立开发项目；保持叙事简洁，把重点留给详情页。", result: "关键结果：待补充项目产出或影响", tags: ["数据分析", "原型验证", "迭代复盘"], accent: "from-[#f1e4d4] via-[#f7f1e8] to-[#e8e4d6]", href: "/projects/project-03" },
  { index: "04", type: "PROJECT", title: "作品四 · 项目名称", subtitle: "用一个项目收束你的方法论", summary: "保留最能代表你的项目背景、角色边界和最终产出，形成四张卡片之间的能力互补。", result: "关键结果：待补充可展示的结果或作品链接", tags: ["研究方法", "内容表达", "项目管理"], accent: "from-[#dbe8ec] via-[#edf4f2] to-[#f4eadf]", href: "/projects/project-04" },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <article id={`project-${project.index}`} className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#dfe7d9] bg-[#fffdf8] shadow-[0_18px_55px_rgba(53,74,45,.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(53,74,45,.14)]">
      <div className={`relative min-h-[218px] overflow-hidden bg-gradient-to-br ${project.accent} p-6`}>
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(65,105,54,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(65,105,54,.1)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="relative flex items-start justify-between"><span className="rounded-full border border-white/70 bg-white/65 px-3 py-1 text-[10px] font-bold tracking-[.18em] text-leaf-800">{project.type}</span><span className="font-mono text-4xl font-semibold tracking-[-.08em] text-leaf-900/25">{project.index}</span></div>
        <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between"><div className="grid size-14 place-items-center rounded-2xl border border-white/70 bg-white/65 text-leaf-700 shadow-sm backdrop-blur-sm">{project.featured ? <Sparkles size={25} /> : <CircleDot size={25} />}</div><span className="rounded-full bg-leaf-900/85 px-3 py-1 text-xs font-semibold text-white">可替换封面</span></div>
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className="text-xs font-bold tracking-[.16em] text-leaf-600">{project.subtitle}</p><h2 className="mt-3 text-2xl font-semibold tracking-[-.04em] text-leaf-900 md:text-[1.75rem]">{project.title}</h2><p className="mt-4 text-sm leading-7 text-leaf-800/70">{project.summary}</p><p className="mt-5 border-l-2 border-leaf-300 pl-3 text-sm font-semibold leading-6 text-leaf-800">{project.result}</p>
        <div className="mt-6 flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="rounded-full bg-leaf-50 px-3 py-1.5 text-xs font-medium text-leaf-700">{tag}</span>)}</div>
        <div className="mt-7 flex items-center justify-between border-t border-leaf-100 pt-5"><Link href={project.href} className="inline-flex items-center gap-2 text-sm font-bold text-leaf-700 transition group-hover:text-leaf-900">查看项目详情 <ChevronRight size={17} className="transition group-hover:translate-x-1" /></Link><ArrowUpRight size={18} className="text-leaf-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div>
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden">
        <section className="container-page pb-16 pt-16 md:pb-20 md:pt-24"><div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-end"><div><p className="eyebrow">Portfolio · Selected Works</p><h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.04] tracking-[-.06em] text-leaf-900 md:text-7xl">把想法做成<br /><span className="text-leaf-600">值得被看见的作品。</span></h1><p className="mt-7 max-w-2xl text-base leading-8 text-leaf-800/70 md:text-lg">这里先放四个核心作品。每张卡片都用“背景 → 贡献 → 结果”的顺序，让访客快速判断项目价值，再进入详情页阅读完整过程。</p></div><aside className="rounded-[1.75rem] border border-leaf-100 bg-white/65 p-6 shadow-[0_14px_40px_rgba(53,74,45,.06)]"><div className="flex items-center gap-3 text-leaf-700"><BriefcaseBusiness size={19} /><span className="text-xs font-bold uppercase tracking-[.18em]">Portfolio Map</span></div><p className="mt-5 text-4xl font-semibold tracking-[-.06em] text-leaf-900">04 <span className="text-base font-medium tracking-normal text-leaf-800/55">个精选作品</span></p><p className="mt-3 text-sm leading-6 text-leaf-800/65">后续可按岗位需要调整排序，第一、二张作为重点案例，其余两张补充能力广度。</p></aside></div></section>
        <section id="projects" className="border-y border-leaf-100 bg-white/45 py-16 md:py-20"><div className="container-page"><div className="mb-9 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Selected Projects</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.04em] text-leaf-900 md:text-4xl">四个作品，先看最重要的。</h2></div><span className="inline-flex items-center gap-2 rounded-full border border-leaf-200 bg-[#f7f9f2] px-4 py-2 text-xs font-semibold text-leaf-700"><Layers3 size={15} /> 点击卡片进入详情</span></div><div className="grid gap-6 md:grid-cols-2">{projects.map((project) => <ProjectCard key={project.index} project={project} />)}</div></div></section>
        <section id="about" className="container-page py-16 md:py-20"><div className="rounded-[2.25rem] bg-leaf-900 p-8 text-white shadow-[0_22px_65px_rgba(47,71,42,.2)] md:flex md:items-center md:justify-between md:gap-10 md:p-12"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-leaf-200">Next · About the maker</p><h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-.04em] md:text-4xl">四个作品只是入口，详情页再讲清楚你的判断。</h2><p className="mt-4 max-w-2xl leading-7 text-leaf-100/75">后续可以继续补充个人简介、工作经历、简历下载和联系方式；首页始终保持以作品为中心。</p></div><Link href="mailto:hello@example.com" className="mt-7 inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#e8f5c9] px-6 py-3 font-semibold text-leaf-900 transition hover:-translate-y-0.5 hover:bg-white md:mt-0"><Mail size={18} /> 联系我</Link></div></section>
      </main>
      <footer className="border-t border-leaf-100 bg-white/60 py-8"><div className="container-page flex flex-col justify-between gap-2 text-sm text-leaf-800/55 md:flex-row"><span>Portfolio · Selected Works</span><span>四个项目槽位已就绪，等待替换为你的真实作品。</span></div></footer>
    </>
  );
}
