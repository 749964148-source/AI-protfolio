import { qwenChat, parseModelJson, type ChatMessage } from "@/lib/ai/qwen";
import { cropById } from "@/data/crops";
import type { GardenProfile, GrowthStage } from "@/lib/types";

export interface VisualObservation {isPlant:boolean;imageQuality:"good"|"usable"|"poor";visibleParts:string[];symptoms:string[];uncertainties:string[];}
export interface DiagnosisExpert {id:string;name:string;domain:string;conclusion:string;evidence:string[];confidence:number;actions:string[];risks:string[];status:"success"|"failed";}
export interface DiagnosisCause {name:string;likelihood:"较高"|"中等"|"较低";evidence:string[];}
export interface DiagnosisResult {mode:"live"|"fallback";notice?:string;observation:VisualObservation;experts:DiagnosisExpert[];causes:DiagnosisCause[];actions:string[];avoid:string[];confidence:number;followUpQuestions:string[];needExpertHelp:boolean;generatedAt:string;}

const expertDefs={pathology:{name:"植物病理专家 · 唐老师",domain:"病害与非侵染性症状"},entomology:{name:"昆虫植保专家 · 叶老师",domain:"虫害和安全防治"},soil:{name:"土壤肥料专家 · 许老师",domain:"水分、缺素和根区环境"},cultivation:{name:"栽培专家 · 林老师",domain:"生长阶段与管理操作"}};

async function observeImages(images:{mime:string;base64:string}[],context:Record<string,unknown>):Promise<VisualObservation>{
  const content:Record<string,unknown>[]=[{type:"text",text:`请客观观察这些家庭菜园植物照片。不要直接诊断。上下文：${JSON.stringify(context)}。返回JSON：{isPlant:boolean,imageQuality:'good'|'usable'|'poor',visibleParts:string[],symptoms:string[],uncertainties:string[]}`}];
  images.forEach(img=>content.push({type:"image_url",image_url:{url:`data:${img.mime};base64,${img.base64}`}}));
  const text=await qwenChat([{role:"system",content:"你是植物图像观察员，只描述图中可见事实，不猜测未看到的信息。"},{role:"user",content}] as ChatMessage[],process.env.QWEN_VISION_MODEL||"qwen-vl-plus-latest",45000);
  return parseModelJson<VisualObservation>(text);
}

export function routeDiagnosisExperts(symptoms:string,observation:VisualObservation){
  const text=`${symptoms} ${observation.symptoms.join(" ")}`; const chosen:(keyof typeof expertDefs)[]=["cultivation","soil"];
  if(/斑|霉|腐|枯|黄|萎/.test(text))chosen.push("pathology");
  if(/虫|孔|网|卵|啃|黏/.test(text))chosen.push("entomology");
  return [...new Set(chosen)].slice(0,4);
}

async function liveExpert(id:keyof typeof expertDefs,context:Record<string,unknown>):Promise<DiagnosisExpert>{
  const def=expertDefs[id]; const text=await qwenChat([{role:"system",content:`你是${def.name}，负责${def.domain}。区分可见证据与推测，不得给出无依据的精确农药剂量。返回JSON：{conclusion,evidence:string[],confidence:0到1,actions:string[],risks:string[]}`},{role:"user",content:JSON.stringify(context)}]);
  return {id,name:def.name,domain:def.domain,...parseModelJson<Omit<DiagnosisExpert,"id"|"name"|"domain"|"status">>(text),status:"success"};
}

function fallbackObservation(symptoms:string):VisualObservation{return {isPlant:true,imageQuality:"usable",visibleParts:["图片未由视觉模型读取"],symptoms:symptoms?[symptoms]:["未填写明显症状"],uncertainties:["尚未配置百炼密钥，不能分析图片像素","以下仅依据用户文字描述"]};}

function fallbackExperts(ids:(keyof typeof expertDefs)[],symptoms:string,cropId:string,stage:GrowthStage):DiagnosisExpert[]{
  const crop=cropById[cropId]; return ids.map(id=>{const def=expertDefs[id];let conclusion="需要补充更清楚的照片和近期养护记录。";let actions=["观察新叶与老叶的差异","检查土壤干湿和叶片背面"];
    if(id==="soil"&&/黄|矮|萎/.test(symptoms)){conclusion="黄化或萎蔫可能与水分、根区通气或养分失衡有关，不能只凭照片认定缺肥。";actions=["检查土表下约2厘米的湿度","确认近期是否连续浇水或施肥"]}
    if(id==="entomology"&&/虫|孔|啃/.test(symptoms)){conclusion="虫孔需要结合叶背、虫粪或活虫才能判断具体虫种。";actions=["清晨检查叶背和心叶","先人工移除可见虫体"]}
    if(id==="pathology"&&/斑|霉|腐|枯/.test(symptoms)){conclusion="斑点或腐烂可能涉及病害，也可能由日灼、积水等非侵染因素造成。";actions=["隔离严重受损叶片","避免叶面长期潮湿"]}
    if(id==="cultivation")conclusion=`${crop?.name||"该作物"}处于${stage}，先排查环境和近期操作，再决定水肥。`;
    return {id,name:def.name,domain:def.domain,conclusion,evidence:[`用户描述：${symptoms||"未填写"}`,crop?.stageTips[stage]||"自由作物暂无结构化知识卡"],confidence:.45,actions,risks:["信息不足导致误判"],status:"success"};});
}

function fallbackSynthesis(symptoms:string,experts:DiagnosisExpert[]):Pick<DiagnosisResult,"causes"|"actions"|"avoid"|"confidence"|"followUpQuestions"|"needExpertHelp">{
  const causes:DiagnosisCause[]=[];
  if(/虫|孔|啃/.test(symptoms))causes.push({name:"取食性害虫",likelihood:"中等",evidence:["用户描述中出现虫咬或孔洞"]});
  if(/黄|矮|萎/.test(symptoms))causes.push({name:"水分或根区环境不适",likelihood:"中等",evidence:["黄化、矮小和萎蔫可能由多种环境因素造成"]});
  if(/斑|霉|腐|枯/.test(symptoms))causes.push({name:"病害或非侵染性损伤",likelihood:"中等",evidence:["文字描述包含斑、霉、腐或枯"]});
  if(!causes.length)causes.push({name:"信息不足，暂不能判断",likelihood:"较低",evidence:["缺少可由模型读取的图像和具体症状"]});
  return {causes,actions:[...new Set(experts.flatMap(e=>e.actions))].slice(0,4),avoid:["不要因为叶片发黄就立即大量施肥","不要混用多种农药试错","不要把不确定判断当成确诊"],confidence:.4,followUpQuestions:["症状最先出现在新叶还是老叶？","近期是否连续降雨、浇水或施肥？","叶片背面能否看到虫体、虫卵或蛛网？"],needExpertHelp:/整株|快速|严重|腐烂/.test(symptoms)};
}

async function liveSynthesis(context:Record<string,unknown>):Promise<Pick<DiagnosisResult,"causes"|"actions"|"avoid"|"confidence"|"followUpQuestions"|"needExpertHelp">>{
  const text=await qwenChat([{role:"system",content:"你是菜园管家。综合观察和专家意见，处理冲突，给家庭种植者安全、克制的诊断建议。返回JSON：{causes:[{name,likelihood:'较高'|'中等'|'较低',evidence:string[]}],actions:string[],avoid:string[],confidence:0到1,followUpQuestions:string[],needExpertHelp:boolean}"},{role:"user",content:JSON.stringify(context)}]);
  return parseModelJson(text);
}

export async function runDiagnosis(input:{images:{mime:string;base64:string}[];profile:GardenProfile;cropId:string;stage:GrowthStage;symptoms:string;notes:string;}):Promise<DiagnosisResult>{
  let mode:DiagnosisResult["mode"]="live";let notice:string|undefined;let observation:VisualObservation;
  if(!process.env.DASHSCOPE_API_KEY){mode="fallback";notice="尚未配置百炼密钥，图片未发送给模型；当前只根据文字描述展示安全降级结果。";observation=fallbackObservation(input.symptoms);}else{observation=await observeImages(input.images,{cropId:input.cropId,stage:input.stage,symptoms:input.symptoms,notes:input.notes,city:input.profile.city});if(!observation.isPlant)throw new Error("上传内容未识别为植物，请更换照片");}
  const ids=routeDiagnosisExperts(input.symptoms,observation);let experts:DiagnosisExpert[];
  const context={profile:input.profile,crop:cropById[input.cropId]||input.cropId,stage:input.stage,symptoms:input.symptoms,notes:input.notes,observation};
  if(mode==="fallback")experts=fallbackExperts(ids,input.symptoms,input.cropId,input.stage);else{const settled=await Promise.allSettled(ids.map(id=>liveExpert(id,context)));experts=settled.map((r,i)=>r.status==="fulfilled"?r.value:{id:ids[i],name:expertDefs[ids[i]].name,domain:expertDefs[ids[i]].domain,conclusion:"本次分析超时",evidence:[],confidence:0,actions:[],risks:[],status:"failed"});if(experts.filter(e=>e.status==="success").length<2){mode="fallback";notice="多位诊断专家暂时不可用，已切换为文字规则降级结果。";experts=fallbackExperts(ids,input.symptoms,input.cropId,input.stage);}}
  let synthesis=mode==="live"?await liveSynthesis({...context,experts}).catch(()=>null):null;if(!synthesis){if(mode==="live"){mode="fallback";notice="综合诊断暂时不可用，已展示安全降级结果。";}synthesis=fallbackSynthesis(input.symptoms,experts);}
  return {mode,notice,observation,experts,...synthesis,generatedAt:new Date().toISOString()};
}
