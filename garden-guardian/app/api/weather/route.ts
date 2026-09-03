import { NextRequest, NextResponse } from "next/server";
import { fetchWeather } from "@/lib/open-meteo";

export async function GET(request: NextRequest) {
  const latitude = Number(request.nextUrl.searchParams.get("lat"));
  const longitude = Number(request.nextUrl.searchParams.get("lon"));
  const city = request.nextUrl.searchParams.get("city") || "当前城市";
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return NextResponse.json({ error: "经纬度无效" }, { status: 400 });
  try {
    return NextResponse.json(await fetchWeather(latitude,longitude,city));
  } catch { return NextResponse.json({ error:"天气服务暂时不可用，请稍后重试" }, { status:503 }); }
}
