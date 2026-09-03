"use client";
import { ErrorState } from "@/components/states";
export default function ErrorPage({ reset }: { reset: () => void }) { return <main className="container-page py-24"><ErrorState/><button onClick={reset} className="btn-primary mt-5">重新加载</button></main>; }
