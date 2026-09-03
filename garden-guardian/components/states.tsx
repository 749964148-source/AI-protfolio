import { AlertTriangle, LoaderCircle, Sprout } from "lucide-react";

export function LoadingState({ label = "菜园管家正在整理信息…" }: { label?: string }) {
  return <div className="paper-card flex min-h-40 items-center justify-center gap-3 p-6 text-leaf-800"><LoaderCircle className="animate-spin" />{label}</div>;
}
export function EmptyState({ title = "还没有内容", detail = "先建立一份菜园档案，管家才能为你安排任务。" }: { title?: string; detail?: string }) {
  return <div className="paper-card grid min-h-48 place-items-center p-8 text-center"><div><Sprout className="mx-auto mb-3 text-leaf-600" size={34}/><h2 className="text-xl font-bold text-leaf-900">{title}</h2><p className="muted mt-2">{detail}</p></div></div>;
}
export function ErrorState({ detail = "暂时无法完成，请稍后再试。" }: { detail?: string }) {
  return <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-900"><div className="flex gap-3"><AlertTriangle/><div><strong>这次没有成功</strong><p className="mt-1 text-sm leading-6">{detail}</p></div></div></div>;
}
