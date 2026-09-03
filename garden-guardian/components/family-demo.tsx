"use client";

import { useState } from "react";
import { Check, CheckCircle2, ClipboardCheck, Copy, History, UserRoundPlus } from "lucide-react";

export function FamilyDemo(){
  const [step,setStep]=useState(1);const [copied,setCopied]=useState(false);const [done,setDone]=useState(false);
  async function copyCode(){try{await navigator.clipboard.writeText("CAIYUAN-0729");setCopied(true);}catch{setCopied(true);}setStep(2);}
  return <div><div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">功能演示：当前版本不创建真实账号，也不会跨设备共享数据。所有操作只用于展示产品流程。</div>
    <div className="mb-8 flex items-center gap-2">{[1,2,3].map(n=><div key={n} className={`h-2 flex-1 rounded-full ${step>=n?"bg-leaf-600":"bg-leaf-100"}`}/>)}</div>
    <div className="grid gap-5 lg:grid-cols-3">
      <section className={`paper-card p-6 transition ${step===1?"ring-4 ring-leaf-100":""}`}><span className="grid size-10 place-items-center rounded-full bg-leaf-100 font-bold text-leaf-800">1</span><UserRoundPlus className="mt-8 text-leaf-600"/><h2 className="mt-4 text-xl font-bold">邀请家人</h2><p className="muted mt-2">生成临时邀请码，让家人协助填写菜园资料。</p><div className="mt-5 rounded-2xl bg-leaf-50 p-4 text-center font-mono text-lg font-bold tracking-widest">CAIYUAN-0729</div><button className="btn-primary mt-4 w-full" onClick={copyCode}>{copied?<Check/>:<Copy size={17}/>} {copied?"已复制":"复制邀请码"}</button></section>
      <section className={`paper-card p-6 transition ${step===2?"ring-4 ring-leaf-100":""}`}><span className="grid size-10 place-items-center rounded-full bg-leaf-100 font-bold text-leaf-800">2</span><div className="mt-8 rounded-2xl bg-leaf-50 p-4"><p className="text-sm text-leaf-700">今日任务</p><strong className="mt-1 block text-lg">检查黄瓜支架</strong><p className="mt-2 text-xs text-leaf-700">傍晚可能有雷雨</p></div><h2 className="mt-5 text-xl font-bold">远程查看</h2><p className="muted mt-2">家人看到最重要的任务和原因。</p><button className="btn-secondary mt-5 w-full" onClick={()=>setStep(3)}><ClipboardCheck/>帮忙确认任务</button></section>
      <section className={`paper-card p-6 transition ${step===3?"ring-4 ring-leaf-100":""}`}><span className="grid size-10 place-items-center rounded-full bg-leaf-100 font-bold text-leaf-800">3</span><CheckCircle2 className="mt-8 text-leaf-600"/><h2 className="mt-4 text-xl font-bold">确认完成</h2><p className="muted mt-2">代为记录天气防护结果，并留下简短说明。</p><button className="btn-primary mt-5 w-full" onClick={()=>setDone(true)}><Check/> {done?"已记录完成":"标记已完成"}</button>{done&&<div className="mt-4 rounded-2xl bg-leaf-50 p-4 text-sm leading-6 text-leaf-800"><History className="mb-2" size={18}/><strong>演示历史</strong><p>今天 09:20 · 家人已确认支架加固</p></div>}</section>
    </div>
  </div>;
}
