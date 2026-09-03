import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchWeather } from "@/lib/open-meteo";
import { runTaskOrchestrator } from "@/lib/ai/task-orchestrator";
import { checkRateLimit } from "@/lib/rate-limit";

const cropSchema=z.object({id:z.string(),cropId:z.string(),name:z.string(),stage:z.enum(["播种萌发","幼苗期","营养生长期","开花结果期","采收期"]),plantedAt:z.string().optional(),lastWateredAt:z.string().optional(),lastFertilizedAt:z.string().optional()});
const profileSchema=z.object({id:z.string(),name:z.string().min(1).max(50),city:z.string().min(1).max(80),latitude:z.number().min(-90).max(90),longitude:z.number().min(-180).max(180),environment:z.enum(["庭院","阳台","露台","室内窗台"]),growingMethod:z.enum(["地栽","盆栽","种植箱"]),crops:z.array(cropSchema).min(1).max(12),updatedAt:z.string()});

export async function POST(request:NextRequest){
  try{const rate=await checkRateLimit(request,"tasks");if(!rate.allowed)return NextResponse.json({error:"今天生成次数已用完，请明天再试"},{status:429,headers:{"Retry-After":String(Math.max(1,Math.ceil((rate.reset-Date.now())/1000)))}});const parsed=profileSchema.safeParse((await request.json()).profile);if(!parsed.success)return NextResponse.json({error:"菜园档案不完整",details:parsed.error.flatten()},{status:400});const weather=await fetchWeather(parsed.data.latitude,parsed.data.longitude,parsed.data.city);return NextResponse.json(await runTaskOrchestrator(parsed.data,weather),{headers:{"X-RateLimit-Remaining":String(rate.remaining),"X-RateLimit-Mode":rate.mode}});}
  catch(error){return NextResponse.json({error:error instanceof Error?error.message:"任务生成失败"},{status:503});}
}
