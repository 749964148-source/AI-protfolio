import { PageShell } from "@/components/page-shell";
import { GardenApp } from "@/components/garden-app";

export default function StandardAppPage() {
  return <PageShell eyebrow="Standard Mode · 标准版" title="我的菜园"><GardenApp /></PageShell>;
}
