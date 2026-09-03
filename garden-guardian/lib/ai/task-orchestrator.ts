import { cropById } from "@/data/crops";
import { retrieveGardenKnowledge, uniqueSources } from "@/lib/knowledge";
import { parseModelJson, qwenChat } from "@/lib/ai/qwen";
import type { GardenProfile, GardenTask, WeatherSnapshot } from "@/lib/types";
import { summarizeWeatherRisk } from "@/lib/weather";

export interface ExpertOpinion {id:string;name:string;domain:string;conclusion:string;evidence:string[];confidence:number;risks:string[];actions:string[];status:"success"|"failed";}
export interface TaskRunResult {mode:"live"|"fallback";notice?:string;weather:WeatherSnapshot;risks:string[];experts:ExpertOpinion[];tasks:GardenTask[];sources:ReturnType<typeof uniqueSources>;generatedAt:string;}

const expertDefs={cultivation:{name:"栽培专家 · 林老师",domain:"作物阶段与日常管理"},soil:{name:"土壤肥料专家 · 许老师",domain:"浇水、施肥与根区环境"},meteorology:{name:"气象专家 · 周老师",domain:"高温、降雨、大风与低温风险"}};

function chooseExperts(weather:WeatherSnapshot){
  const risks=summarizeWeatherRisk(weather); const chosen:(keyof typeof expertDefs)[]=["cultivation","soil"];
  if(risks[0]!=="天气平稳"||weather.daily[0])chosen.push("meteorology"); return chosen;
}

function ruleExpert(id:keyof typeof expertDefs,profile:GardenProfile,weather:WeatherSnapshot):ExpertOpinion{
  const risks=summarizeWeatherRisk(weather); const today=weather.daily[0]; const def=expertDefs[id];
  if(id==="meteorology") return {id,name:def.name,domain:def.domain,conclusion:risks[0]==="天气平稳"?"今天气象条件总体平稳，按土壤实际状态安排养护。":`今天重点防范${risks.join("、")}。`,evidence:[`最高 ${today.temperatureMax}℃，最低 ${today.temperatureMin}℃`,`降雨概率 ${today.precipitationProbability}%`,`最大风速 ${today.windSpeedMax} km/h`],confidence:.9,risks,actions:risks.includes("强降雨")?["检查排水","暂停施肥"]:risks.includes("大风")?["加固支架"]:["早晚查看植株状态"],status:"success"};
  if(id==="soil") return {id,name:def.name,domain:def.domain,conclusion:today.precipitationProbability>=70?"降雨前暂缓施肥，浇水以土壤实际干湿为准。":"先检查土壤表层和根区，再决定是否浇水。",evidence:[`最近浇水记录：${profile.crops[0]?.lastWateredAt||"未填写"}`,`今日降雨概率 ${today.precipitationProbability}%`],confidence:.72,risks:["过量浇水","雨前养分流失"],actions:["手指插入土表下约2厘米检查湿度","避免一次大量追肥"],status:"success"};
  return {id,name:def.name,domain:def.domain,conclusion:`${profile.crops.map(c=>c.name).join("、")}当前以${profile.crops[0]?.stage||"当前阶段"}管理为主。`,evidence:profile.crops.map(c=>`${c.name}：${cropById[c.cropId]?.stageTips[c.stage]||"按实际长势观察"}`),confidence:.76,risks:["支架松动","叶片长期潮湿"],actions:["检查长势和叶背","清理明显病残叶"],status:"success"};
}

async function liveExpert(id:keyof typeof expertDefs,profile:GardenProfile,weather:WeatherSnapshot):Promise<ExpertOpinion>{
  const def=expertDefs[id]; const knowledge=retrieveGardenKnowledge(profile);
  const content=await qwenChat([{role:"system",content:`你是${def.name}，负责${def.domain}。只依据提供的档案、天气和知识摘要分析家庭菜园。不得推荐精确农药剂量。返回JSON：{conclusion,evidence:string[],confidence:0到1,risks:string[],actions:string[]}`},{role:"user",content:JSON.stringify({profile,weather,knowledge})}]);
  const parsed=parseModelJson<Omit<ExpertOpinion,"id"|"name"|"domain"|"status">>(content); return {id,name:def.name,domain:def.domain,...parsed,status:"success"};
}

function fallbackTasks(profile:GardenProfile,weather:WeatherSnapshot):GardenTask[]{
  const today=weather.daily[0]; const risks=summarizeWeatherRisk(weather); const tasks:GardenTask[]=[];
  profile.crops.forEach((crop,index)=>{
    if(today.precipitationProbability>=70||today.precipitationSum>=15)tasks.push({id:`rain-${crop.id}`,cropName:crop.name,title:index===0?"先检查排水和支架":"雨前暂停施肥",detail:`${crop.name}在降雨前以防积水和倒伏为主。`,priority:index===0?"urgent":"today",reason:`今日降雨概率 ${today.precipitationProbability}%`,avoid:"不要在暴雨前大水浇灌或集中追肥"});
    else if(today.temperatureMax>=33)tasks.push({id:`heat-${crop.id}`,cropName:crop.name,title:"早晨检查土壤湿度",detail:"如土表下约2厘米已经干燥，在根部缓慢补水；中午注意遮阴。",priority:index===0?"urgent":"today",reason:`今日最高温 ${today.temperatureMax}℃`,avoid:"不要在中午突然大量浇冷水"});
    else if(today.temperatureMin<=2)tasks.push({id:`cold-${crop.id}`,cropName:crop.name,title:"夜间做好保温",detail:"傍晚前覆盖幼苗，盆栽尽量移到避风处。",priority:"urgent",reason:`今日最低温 ${today.temperatureMin}℃`,avoid:"覆盖材料不要直接压住嫩叶"});
    else if(today.windSpeedMax>=35)tasks.push({id:`wind-${crop.id}`,cropName:crop.name,title:"加固植株和支架",detail:"检查绑蔓位置，给高秆和藤蔓作物增加支撑。",priority:"urgent",reason:`最大风速 ${today.windSpeedMax} km/h`,avoid:"不要绑得过紧损伤茎秆"});
    else tasks.push({id:`normal-${crop.id}`,cropName:crop.name,title:"查看叶片和土壤",detail:cropById[crop.cropId]?.stageTips[crop.stage]||"根据长势进行日常观察。",priority:index===0?"today":"observe",reason:`天气总体平稳，${crop.name}处于${crop.stage}`,avoid:cropById[crop.cropId]?.avoidActions[0]});
  });
  return tasks.slice(0,6);
}

async function synthesizeLive(profile:GardenProfile,weather:WeatherSnapshot,experts:ExpertOpinion[]):Promise<GardenTask[]>{
  const content=await qwenChat([{role:"system",content:"你是菜园管家。综合专家意见，解决冲突，按优先级生成最多6个今日任务。不得虚构天气或精确农药剂量。返回JSON：{tasks:[{id,cropName,title,detail,priority:'urgent'|'today'|'observe',reason,avoid}]}"},{role:"user",content:JSON.stringify({profile,weather,experts})}]);
  return parseModelJson<{tasks:GardenTask[]}>(content).tasks;
}

export async function runTaskOrchestrator(profile:GardenProfile,weather:WeatherSnapshot):Promise<TaskRunResult>{
  const ids=chooseExperts(weather); let mode:TaskRunResult["mode"]="live"; let notice:string|undefined;
  let experts:ExpertOpinion[];
  if(!process.env.DASHSCOPE_API_KEY){mode="fallback";notice="尚未配置百炼密钥，当前展示可验证的规则降级结果。";experts=ids.map(id=>ruleExpert(id,profile,weather));}
  else{
    const settled=await Promise.allSettled(ids.map(id=>liveExpert(id,profile,weather)));
    experts=settled.map((result,index)=>result.status==="fulfilled"?result.value:{id:ids[index],name:expertDefs[ids[index]].name,domain:expertDefs[ids[index]].domain,conclusion:"本次分析超时",evidence:[],confidence:0,risks:[],actions:[],status:"failed"});
    if(experts.filter(e=>e.status==="success").length<2){mode="fallback";notice="多位专家暂时不可用，已切换为规则降级结果。";experts=ids.map(id=>ruleExpert(id,profile,weather));}
  }
  let tasks=fallbackTasks(profile,weather);
  if(mode==="live"){try{tasks=await synthesizeLive(profile,weather,experts.filter(e=>e.status==="success"));}catch{mode="fallback";notice="综合研判暂时不可用，已展示规则生成结果。";}}
  return {mode,notice,weather,risks:summarizeWeatherRisk(weather),experts,tasks,sources:uniqueSources(profile),generatedAt:new Date().toISOString()};
}
