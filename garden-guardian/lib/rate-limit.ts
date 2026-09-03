import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

const memory=new Map<string,{count:number;reset:number}>();

function clientId(request:NextRequest){return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||request.headers.get("x-real-ip")||"local";}

export async function checkRateLimit(request:NextRequest,kind:"tasks"|"diagnosis"){
  const limit=kind==="tasks"?20:10;const id=`${kind}:${clientId(request)}`;
  if(process.env.UPSTASH_REDIS_REST_URL&&process.env.UPSTASH_REDIS_REST_TOKEN){
    const redis=Redis.fromEnv();const limiter=new Ratelimit({redis,limiter:Ratelimit.slidingWindow(limit,"1 d"),prefix:"garden-guardian"});const result=await limiter.limit(id);return {allowed:result.success,remaining:result.remaining,reset:result.reset,mode:"upstash" as const};
  }
  const now=Date.now();const current=memory.get(id);if(!current||current.reset<now){memory.set(id,{count:1,reset:now+86_400_000});return {allowed:true,remaining:limit-1,reset:now+86_400_000,mode:"memory" as const};}current.count+=1;memory.set(id,current);return {allowed:current.count<=limit,remaining:Math.max(0,limit-current.count),reset:current.reset,mode:"memory" as const};
}
