import Link from "next/link";
import { ArrowLeft, Check, CircleAlert, Smartphone } from "lucide-react";
import { MobileGardenDemo } from "@/components/mobile-garden-demo";

export default function MobileDemoPage() {
  return (
    <main className="min-h-screen bg-[#eef4e8] pb-16">
      <div className="container-page py-6 md:py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 font-semibold text-leaf-800 hover:bg-white"><ArrowLeft size={18} /> 返回作品集</Link>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-leaf-800"><Smartphone size={16} /> iPhone 17 原型</span>
        </div>
        <div className="grid items-start gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <section className="pt-4 lg:sticky lg:top-8">
            <p className="eyebrow">Mobile Product Prototype · 移动端产品原型</p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-.045em] text-leaf-900 md:text-6xl">给姥姥的菜园，<br /><span className="text-leaf-600">今天先做一件事。</span></h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-leaf-800/75">这是一个面向家庭种植新手的微信小程序方向验证。它不要求先学会农业知识，而是把天气、作物状态和下一步动作放在同一条路上。</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-leaf-200 bg-white/75 p-5"><CircleAlert className="text-amber-600" size={21} /><strong className="mt-4 block text-leaf-900">本轮拷打结论</strong><p className="mt-2 text-sm leading-6 text-leaf-800/70">首屏必须有任务，完成后必须回写状态和记录。</p></div>
              <div className="rounded-3xl border border-leaf-200 bg-white/75 p-5"><Check className="text-leaf-600" size={21} /><strong className="mt-4 block text-leaf-900">当前已补全</strong><p className="mt-2 text-sm leading-6 text-leaf-800/70">任务确认、植物状态更新、记录撤销、诊断转任务。</p></div>
            </div>
            <div className="mt-8 rounded-3xl bg-leaf-900 p-6 text-white"><p className="text-sm font-bold text-leaf-200">演示路径</p><p className="mt-3 text-lg font-semibold leading-8">今日发现异常 → 打开植物 → 执行动作 → 确认完成 → 记录回看</p></div>
          </section>
          <section className="flex justify-center lg:justify-end"><MobileGardenDemo /></section>
        </div>
      </div>
    </main>
  );
}
