import { PageShell } from "@/components/page-shell";
import { CareDashboard } from "@/components/care-dashboard";

export default function CarePage() {
  return <PageShell care eyebrow="Care Mode · 关怀版" title="今天先做一件事"><CareDashboard /></PageShell>;
}
