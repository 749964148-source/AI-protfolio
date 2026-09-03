export type ChatMessage={role:"system"|"user"|"assistant";content:string|Array<Record<string,unknown>>};

export async function qwenChat(messages:ChatMessage[],model=process.env.QWEN_TEXT_MODEL||"qwen-plus-latest",timeoutMs=30000){
  const key=process.env.DASHSCOPE_API_KEY;
  if(!key) throw new Error("DASHSCOPE_API_KEY_MISSING");
  const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{
    const response=await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${key}`},body:JSON.stringify({model,messages,temperature:0.2,response_format:{type:"json_object"}}),signal:controller.signal});
    if(!response.ok) throw new Error(`QWEN_${response.status}`);
    const data=await response.json(); return String(data.choices?.[0]?.message?.content||"");
  }finally{clearTimeout(timer);}
}

export function parseModelJson<T>(text:string):T{
  const cleaned=text.replace(/^```(?:json)?/i,"").replace(/```$/i,"").trim();
  return JSON.parse(cleaned) as T;
}
