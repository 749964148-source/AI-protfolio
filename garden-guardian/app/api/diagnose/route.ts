import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runDiagnosis } from "@/lib/ai/diagnosis-orchestrator";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime="nodejs";
const profileSchema=z.object({id:z.string(),name:z.string(),city:z.string(),latitude:z.number(),longitude:z.number(),environment:z.string(),growingMethod:z.string(),crops:z.array(z.any()),updatedAt:z.string()});
const stages=["播种萌发","幼苗期","营养生长期","开花结果期","采收期"] as const;

export async function POST(request:NextRequest){
  try{
    const rate=await checkRateLimit(request,"diagnosis");if(!rate.allowed)return NextResponse.json({error:"今天诊断次数已用完，请明天再试"},{status:429,headers:{"Retry-After":String(Math.max(1,Math.ceil((rate.reset-Date.now())/1000)))}});
    const form=await request.formData(); const files=form.getAll("images").filter((x):x is File=>x instanceof File);
    if(files.length<1||files.length>3)return NextResponse.json({error:"请上传1到3张图片"},{status:400});
    const allowed=new Set(["image/jpeg","image/png","image/webp"]);let total=0;
    for(const file of files){total+=file.size;if(!allowed.has(file.type))return NextResponse.json({error:"仅支持 JPG、PNG 或 WebP 图片"},{status:400});}
    if(total>6*1024*1024)return NextResponse.json({error:"图片总大小不能超过6MB"},{status:413});
    const profile=profileSchema.parse(JSON.parse(String(form.get("profile")||"{}"))); const stage=z.enum(stages).parse(form.get("stage")); const cropId=z.string().min(1).parse(form.get("cropId"));
    const symptoms=z.string().max(500).parse(form.get("symptoms")||"");const notes=z.string().max(1000).parse(form.get("notes")||"");
    const images=await Promise.all(files.map(async file=>({mime:file.type,base64:Buffer.from(await file.arrayBuffer()).toString("base64")})));
    return NextResponse.json(await runDiagnosis({images,profile:profile as Parameters<typeof runDiagnosis>[0]["profile"],cropId,stage,symptoms,notes}),{headers:{"X-RateLimit-Remaining":String(rate.remaining),"X-RateLimit-Mode":rate.mode}});
  }catch(error){const message=error instanceof Error?error.message:"诊断失败";return NextResponse.json({error:message},{status:message.includes("未识别为植物")?422:503});}
}
