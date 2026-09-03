import { NextRequest, NextResponse } from "next/server";
import type { CityResult } from "@/lib/types";

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name")?.trim();
  if (!name || name.length < 2) return NextResponse.json({ cities: [] });
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", name);
  url.searchParams.set("count", "6");
  url.searchParams.set("language", "zh");
  url.searchParams.set("format", "json");
  try {
    const response = await fetch(url, { next: { revalidate: 86400 } });
    if (!response.ok) throw new Error("geocoding unavailable");
    const data = await response.json();
    const cities: CityResult[] = (data.results || []).map((item: Record<string, unknown>) => ({
      id: Number(item.id), name: String(item.name), admin1: item.admin1 ? String(item.admin1) : undefined,
      country: item.country ? String(item.country) : undefined, latitude: Number(item.latitude), longitude: Number(item.longitude),
    }));
    return NextResponse.json({ cities });
  } catch {
    return NextResponse.json({ error: "城市服务暂时不可用" }, { status: 503 });
  }
}
