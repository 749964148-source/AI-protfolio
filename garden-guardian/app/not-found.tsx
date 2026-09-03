import Link from "next/link";
import { Sprout } from "lucide-react";
export default function NotFound(){return <main className="container-page grid min-h-screen place-items-center py-20 text-center"><div><Sprout className="mx-auto text-leaf-500" size={64}/><p className="eyebrow mt-7">404 · Lost in the Garden</p><h1 className="mt-3 text-4xl font-bold text-leaf-900">这条小路还没种上东西</h1><p className="muted mt-4">回到菜园首页，继续照看今天的作物。</p><Link href="/" className="btn-primary mt-7">返回首页</Link></div></main>;}
