"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Camera, Check, CloudSun, Droplets, ImagePlus, LoaderCircle, MapPin, Pencil, Plus, Search, Sparkles, Sprout, Trash2 } from "lucide-react";
import { cropKnowledge, cropById } from "@/data/crops";
import { loadProfile, loadTasks, saveProfile, saveTasks } from "@/lib/storage";
import type { CityResult, GardenEnvironment, GardenProfile, GardenTask, GrowingMethod, GrowthStage, WeatherSnapshot } from "@/lib/types";
import type { TaskRunResult } from "@/lib/ai/task-orchestrator";
import type { DiagnosisResult } from "@/lib/ai/diagnosis-orchestrator";
import { summarizeWeatherRisk, weatherLabel } from "@/lib/weather";
import { ErrorState } from "@/components/states";

const stages: GrowthStage[] = ["播种萌发","幼苗期","营养生长期","开花结果期","采收期"];
const defaultCity: CityResult = { id: 2034937, name:"沈阳", admin1:"辽宁", country:"中国", latitude:41.79222, longitude:123.43278 };

export function GardenApp() {
  const [profile, setProfile] = useState<GardenProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [weatherError, setWeatherError] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"tasks"|"diagnose">("tasks");

  useEffect(() => {
    const stored = loadProfile(); setProfile(stored); setEditing(!stored);
    if (new URLSearchParams(location.search).get("tab") === "diagnose") setActiveTab("diagnose");
  }, []);

  useEffect(() => {
    if (!profile) return;
    setWeatherLoading(true); setWeatherError("");
    fetch(`/api/weather?lat=${profile.latitude}&lon=${profile.longitude}&city=${encodeURIComponent(profile.city)}`)
      .then(async r => { if (!r.ok) throw new Error((await r.json()).error); return r.json(); })
      .then(setWeather).catch(e => setWeatherError(e.message || "天气获取失败")).finally(() => setWeatherLoading(false));
  }, [profile]);

  function onSave(next: GardenProfile) { saveProfile(next); setProfile(next); setEditing(false); }

  if (editing || !profile) return <ProfileEditor initial={profile} onSave={onSave} onCancel={profile ? () => setEditing(false) : undefined}/>;

  return <div>
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-leaf-100 bg-white/70 p-4">
      <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-full bg-leaf-100 text-leaf-700"><MapPin size={20}/></span><div><strong className="block text-leaf-900">{profile.name}</strong><span className="text-sm text-leaf-800/60">{profile.city} · {profile.environment}{profile.growingMethod}</span></div></div>
      <button className="btn-secondary !px-4 !py-2" onClick={() => setEditing(true)}><Pencil size={16}/> 编辑档案</button>
    </div>
    <div className="mt-6 flex gap-2 rounded-2xl bg-leaf-100/70 p-1.5" role="tablist">
      <button role="tab" aria-selected={activeTab==="tasks"} onClick={()=>setActiveTab("tasks")} className={`min-h-11 flex-1 rounded-xl px-4 font-bold transition ${activeTab==="tasks"?"bg-white text-leaf-900 shadow":"text-leaf-700"}`}><CloudSun className="mr-2 inline" size={18}/>今日任务</button>
      <button role="tab" aria-selected={activeTab==="diagnose"} onClick={()=>setActiveTab("diagnose")} className={`min-h-11 flex-1 rounded-xl px-4 font-bold transition ${activeTab==="diagnose"?"bg-white text-leaf-900 shadow":"text-leaf-700"}`}><Camera className="mr-2 inline" size={18}/>拍照问菜</button>
    </div>
    {activeTab === "tasks" ? <TasksFoundation profile={profile} weather={weather} loading={weatherLoading} error={weatherError}/> : <DiagnosisFoundation profile={profile} />}
  </div>;
}

function TasksFoundation({ profile, weather, loading, error }: { profile:GardenProfile; weather:WeatherSnapshot|null; loading:boolean; error:string }) {
  const risks = weather ? summarizeWeatherRisk(weather) : [];
  const [run,setRun]=useState<TaskRunResult|null>(null); const [tasks,setTasks]=useState<GardenTask[]>([]); const [generating,setGenerating]=useState(false); const [taskError,setTaskError]=useState("");
  useEffect(()=>setTasks(loadTasks()),[]);
  async function generate(){setGenerating(true);setTaskError("");try{const response=await fetch("/api/tasks",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({profile})});const data=await response.json();if(!response.ok)throw new Error(data.error||"生成失败");setRun(data);setTasks(data.tasks);saveTasks(data.tasks);}catch(e){setTaskError(e instanceof Error?e.message:"任务生成失败");}finally{setGenerating(false);}}
  function toggleDone(id:string){const next=tasks.map(t=>t.id===id?{...t,done:!t.done}:t);setTasks(next);saveTasks(next);}
  function exportCalendar(){const now=new Date();const date=now.toISOString().slice(0,10).replaceAll("-","");const lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Garden Guardian//CN",...tasks.filter(t=>!t.done).flatMap(t=>["BEGIN:VEVENT",`UID:${t.id}@garden-guardian`,`DTSTART:${date}T080000`,`DTEND:${date}T083000`,`SUMMARY:${t.cropName}：${t.title}`,`DESCRIPTION:${t.detail.replaceAll("\n"," ")} 原因：${t.reason.replaceAll("\n"," ")}`,"END:VEVENT"]),"END:VCALENDAR"];const blob=new Blob([lines.join("\r\n")],{type:"text/calendar;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`菜园任务-${new Date().toISOString().slice(0,10)}.ics`;a.click();URL.revokeObjectURL(url);}
  return <div className="mt-6 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
    <aside className="space-y-5">
      <section className="paper-card p-6">
        <div className="flex items-center justify-between"><div><p className="eyebrow">Live Weather</p><h2 className="mt-2 text-2xl font-bold text-leaf-900">{profile.city}天气</h2></div><CloudSun className="text-amber-500" size={30}/></div>
        {loading && <p className="mt-8 flex items-center gap-2 text-leaf-700"><LoaderCircle className="animate-spin"/>正在获取实时天气…</p>}
        {error && <div className="mt-5"><ErrorState detail={error}/></div>}
        {weather && <><div className="mt-7 flex items-end gap-3"><strong className="text-5xl font-semibold text-leaf-900">{Math.round(weather.current.temperature)}°</strong><span className="pb-1 text-leaf-800/65">{weatherLabel(weather.current.weatherCode)} · 体感 {Math.round(weather.current.apparentTemperature)}°</span></div><div className="mt-5 grid grid-cols-2 gap-3 text-sm"><div className="rounded-2xl bg-leaf-50 p-3"><Droplets className="mb-2 text-sky-600" size={18}/>湿度 {weather.current.humidity}%</div><div className="rounded-2xl bg-leaf-50 p-3"><CloudSun className="mb-2 text-leaf-600" size={18}/>风速 {Math.round(weather.current.windSpeed)} km/h</div></div><div className="mt-5 flex flex-wrap gap-2">{risks.map(r=><span key={r} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">{r}</span>)}</div></>}
      </section>
      <section className="paper-card p-6"><p className="eyebrow">My Crops</p><h2 className="mt-2 text-2xl font-bold text-leaf-900">正在照看的作物</h2><div className="mt-5 space-y-3">{profile.crops.map(c=><div key={c.id} className="flex items-center gap-3 rounded-2xl bg-leaf-50 p-3"><span className="text-2xl">{cropById[c.cropId]?.emoji || "🌱"}</span><div><strong>{c.name}</strong><span className="block text-xs text-leaf-800/55">{c.stage}</span></div></div>)}</div></section>
    </aside>
    <section className="paper-card p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="eyebrow">Today&apos;s Plan</p><h2 className="mt-2 text-3xl font-bold text-leaf-900">今日菜园任务</h2><p className="muted mt-2">菜园管家会动态调度相关专家，再统一给出行动优先级。</p></div><CalendarDays className="text-leaf-600"/></div>
      {taskError&&<div className="mt-5"><ErrorState detail={taskError}/></div>}
      {run?.notice&&<div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">{run.notice}</div>}
      {!tasks.length&&<div className="mt-8 rounded-3xl border border-dashed border-leaf-300 bg-leaf-50/60 p-8 text-center"><Sparkles className="mx-auto text-leaf-600"/><h3 className="mt-4 text-xl font-bold">天气和档案已经准备好</h3><p className="muted mt-2">点击后将生成今天真正需要处理的事项。</p><button onClick={generate} disabled={generating||loading||!!error} className="btn-primary mt-6">{generating?<><LoaderCircle className="animate-spin"/>专家分析中…</>:<><Sparkles size={18}/>生成今日任务</>}</button></div>}
      {tasks.length>0&&<div className="mt-7 space-y-4">{tasks.map(task=><article key={task.id} className={`rounded-3xl border p-5 ${task.done?"border-leaf-100 bg-leaf-50/50 opacity-60":task.priority==="urgent"?"border-amber-200 bg-amber-50":"border-leaf-100 bg-white"}`}><div className="flex items-start gap-4"><button onClick={()=>toggleDone(task.id)} aria-label={task.done?`取消完成${task.title}`:`完成${task.title}`} className={`mt-1 grid size-8 shrink-0 place-items-center rounded-full border ${task.done?"border-leaf-600 bg-leaf-600 text-white":"border-leaf-300 bg-white text-transparent"}`}><Check size={17}/></button><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-leaf-100 px-2.5 py-1 text-xs font-bold text-leaf-800">{task.cropName}</span><span className="text-xs text-leaf-700">{task.priority==="urgent"?"优先处理":task.priority==="today"?"今天完成":"继续观察"}</span></div><h3 className={`mt-3 text-xl font-bold ${task.done?"line-through":""}`}>{task.title}</h3><p className="mt-2 text-sm leading-7 text-leaf-800/75">{task.detail}</p><p className="mt-3 text-xs leading-6 text-leaf-700"><strong>依据：</strong>{task.reason}</p>{task.avoid&&<p className="mt-1 text-xs leading-6 text-amber-800"><strong>暂时不要：</strong>{task.avoid}</p>}</div></div></article>)}</div>}
      {tasks.length>0&&<div className="mt-6 flex flex-wrap gap-3"><button className="btn-primary" onClick={generate} disabled={generating}>{generating?<LoaderCircle className="animate-spin"/>:<Sparkles size={18}/>}重新研判</button><button className="btn-secondary" onClick={exportCalendar}><CalendarDays size={18}/>加入系统日历</button></div>}
      {run&&<div className="mt-7 border-t border-leaf-100 pt-6"><details><summary className="cursor-pointer font-bold text-leaf-800">查看参与分析的专家与依据</summary><div className="mt-4 space-y-3">{run.experts.map(expert=><div key={expert.id} className="rounded-2xl bg-leaf-50 p-4"><div className="flex justify-between gap-3"><strong>{expert.name}</strong><span className="text-xs text-leaf-700">把握度 {Math.round(expert.confidence*100)}%</span></div><p className="mt-2 text-sm leading-6 text-leaf-800/75">{expert.conclusion}</p><ul className="mt-2 list-inside list-disc text-xs leading-6 text-leaf-700">{expert.evidence.slice(0,3).map(x=><li key={x}>{x}</li>)}</ul></div>)}</div></details><div className="mt-5 text-xs leading-6 text-leaf-700"><strong>资料来源：</strong>{run.sources.map((s,i)=><span key={s.url}>{i>0?"；":""}<a className="underline" href={s.url} target="_blank" rel="noreferrer">{s.publisher}</a></span>)}</div></div>}
    </section>
  </div>;
}

async function compressImage(file:File):Promise<File>{
  if(file.size<900_000)return file;
  try{const bitmap=await createImageBitmap(file);const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement("canvas");canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);canvas.getContext("2d")?.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/jpeg",.82));return blob?new File([blob],file.name.replace(/\.[^.]+$/,"")+".jpg",{type:"image/jpeg"}):file;}catch{return file;}
}

function DiagnosisFoundation({profile}:{profile:GardenProfile}) {
  const [files,setFiles]=useState<File[]>([]); const [previews,setPreviews]=useState<string[]>([]); const [cropId,setCropId]=useState(profile.crops[0]?.cropId||"tomato"); const [stage,setStage]=useState<GrowthStage>(profile.crops[0]?.stage||"开花结果期"); const [symptoms,setSymptoms]=useState("叶子发黄"); const [notes,setNotes]=useState(""); const [result,setResult]=useState<DiagnosisResult|null>(null); const [busy,setBusy]=useState(false); const [error,setError]=useState("");
  async function selectFiles(list:FileList|null){if(!list)return;setError("");const incoming=Array.from(list);if(files.length+incoming.length>3){setError("最多上传三张图片");return;}if(incoming.some(f=>!["image/jpeg","image/png","image/webp"].includes(f.type))){setError("仅支持 JPG、PNG 或 WebP 图片");return;}const compressed=await Promise.all(incoming.map(compressImage));if([...files,...compressed].reduce((n,f)=>n+f.size,0)>6*1024*1024){setError("压缩后图片总大小仍超过6MB，请减少图片");return;}setFiles(v=>[...v,...compressed]);setPreviews(v=>[...v,...compressed.map(URL.createObjectURL)]);}
  function remove(index:number){URL.revokeObjectURL(previews[index]);setFiles(v=>v.filter((_,i)=>i!==index));setPreviews(v=>v.filter((_,i)=>i!==index));}
  async function diagnose(){if(!files.length){setError("请至少上传一张图片");return;}setBusy(true);setError("");setResult(null);try{const form=new FormData();files.forEach(f=>form.append("images",f));form.set("profile",JSON.stringify(profile));form.set("cropId",cropId);form.set("stage",stage);form.set("symptoms",symptoms);form.set("notes",notes);const response=await fetch("/api/diagnose",{method:"POST",body:form});const data=await response.json();if(!response.ok)throw new Error(data.error||"诊断失败");setResult(data);}catch(e){setError(e instanceof Error?e.message:"诊断失败");}finally{setBusy(false);}}
  return <div className="mt-6 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
    <section className="paper-card p-7"><p className="eyebrow">Plant Diagnosis</p><h2 className="mt-2 text-3xl font-bold text-leaf-900">拍下你担心的地方</h2><p className="muted mt-3">建议分别拍整株、叶片正面和背面。AI 建议只用于辅助观察。</p>
      <label className="mt-7 grid min-h-44 cursor-pointer place-items-center rounded-3xl border-2 border-dashed border-leaf-200 bg-leaf-50/50 text-center transition hover:border-leaf-500"><span><ImagePlus className="mx-auto text-leaf-600" size={34}/><strong className="mt-3 block">选择植物照片</strong><span className="muted mt-1 block">JPG / PNG / WebP · 最多三张</span></span><input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e=>selectFiles(e.target.files)}/></label>
      {previews.length>0&&<div className="mt-4 grid grid-cols-3 gap-3">{previews.map((src,i)=><div key={src} className="relative aspect-square overflow-hidden rounded-2xl bg-leaf-50"><img src={src} alt={`待诊断图片${i+1}`} className="size-full object-cover"/><button onClick={()=>remove(i)} aria-label={`删除第${i+1}张图片`} className="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-white/90 text-red-700 shadow"><Trash2 size={16}/></button></div>)}</div>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2"><label><span className="mb-2 block text-sm font-bold">作物</span><select className="field" value={cropId} onChange={e=>setCropId(e.target.value)}>{profile.crops.map(c=><option key={c.cropId} value={c.cropId}>{c.name}</option>)}</select></label><label><span className="mb-2 block text-sm font-bold">生长阶段</span><select className="field" value={stage} onChange={e=>setStage(e.target.value as GrowthStage)}>{stages.map(x=><option key={x}>{x}</option>)}</select></label></div>
      <label className="mt-4 block"><span className="mb-2 block text-sm font-bold">你观察到了什么？</span><input className="field" value={symptoms} onChange={e=>setSymptoms(e.target.value)} placeholder="例如：下部叶片发黄、有小孔"/></label><label className="mt-4 block"><span className="mb-2 block text-sm font-bold">补充信息</span><textarea className="field min-h-28 py-3" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="近期是否连续下雨、浇水或施肥？"/></label>
      {error&&<div className="mt-5"><ErrorState detail={error}/></div>}<button onClick={diagnose} disabled={busy||!files.length} className="btn-primary mt-6 w-full">{busy?<><LoaderCircle className="animate-spin"/>多位专家分析中…</>:<><Camera size={18}/>开始诊断</>}</button>
    </section>
    <section className="paper-card p-7">
      {!result&&<div className="grid min-h-[520px] place-items-center text-center"><div><Sprout className="mx-auto text-leaf-300" size={52}/><h3 className="mt-5 text-xl font-bold">诊断结果会显示在这里</h3><p className="muted mt-2 max-w-sm">模型会先描述可见症状，再由相关专家分别分析，最后由菜园管家综合。</p></div></div>}
      {result&&<div><div className="flex items-start justify-between gap-3"><div><p className="eyebrow">Garden Diagnosis</p><h2 className="mt-2 text-3xl font-bold text-leaf-900">菜园管家研判</h2></div><span className="rounded-full bg-leaf-100 px-3 py-1 text-xs font-bold text-leaf-800">整体把握度 {Math.round(result.confidence*100)}%</span></div>{result.notice&&<div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">{result.notice}</div>}
        <div className="mt-6"><h3 className="font-bold">可能原因</h3><div className="mt-3 space-y-3">{result.causes.map(c=><div key={c.name} className="rounded-2xl bg-leaf-50 p-4"><div className="flex justify-between gap-3"><strong>{c.name}</strong><span className="text-xs text-leaf-700">可能性 {c.likelihood}</span></div><p className="mt-2 text-xs leading-6 text-leaf-700">{c.evidence.join("；")}</p></div>)}</div></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl bg-leaf-700 p-5 text-white"><h3 className="font-bold">今天可以做</h3><ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-6 text-leaf-50">{result.actions.map(x=><li key={x}>{x}</li>)}</ul></div><div className="rounded-2xl bg-amber-50 p-5 text-amber-950"><h3 className="font-bold">暂时不要做</h3><ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-6">{result.avoid.map(x=><li key={x}>{x}</li>)}</ul></div></div>
        <details className="mt-6"><summary className="cursor-pointer font-bold">查看专家意见</summary><div className="mt-3 space-y-3">{result.experts.map(e=><div className="rounded-2xl border border-leaf-100 p-4" key={e.id}><div className="flex justify-between gap-2"><strong>{e.name}</strong><span className="text-xs text-leaf-700">{Math.round(e.confidence*100)}%</span></div><p className="mt-2 text-sm leading-6 text-leaf-800/75">{e.conclusion}</p></div>)}</div></details>
        <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-leaf-100"><h3 className="font-bold">还需要确认</h3><ul className="mt-2 list-inside list-decimal text-sm leading-7 text-leaf-700">{result.followUpQuestions.map(x=><li key={x}>{x}</li>)}</ul></div>{result.needExpertHelp&&<p className="mt-4 text-sm font-bold text-red-700">症状可能较重，建议携带清晰照片咨询当地农技人员。</p>}
      </div>}
    </section>
  </div>;
}

function ProfileEditor({ initial, onSave, onCancel }: { initial:GardenProfile|null; onSave:(p:GardenProfile)=>void; onCancel?:()=>void }) {
  const [gardenName,setGardenName]=useState(initial?.name || "我的小菜园");
  const [query,setQuery]=useState(initial?.city || "沈阳"); const [cities,setCities]=useState<CityResult[]>([]); const [city,setCity]=useState<CityResult|null>(initial ? {id:0,name:initial.city,latitude:initial.latitude,longitude:initial.longitude} : defaultCity);
  const [environment,setEnvironment]=useState<GardenEnvironment>(initial?.environment || "庭院"); const [method,setMethod]=useState<GrowingMethod>(initial?.growingMethod || "地栽");
  const [selected,setSelected]=useState<string[]>(initial?.crops.map(c=>c.cropId) || ["tomato","cucumber","pepper"]); const [stage,setStage]=useState<GrowthStage>(initial?.crops[0]?.stage || "开花结果期");
  const [lastWatered,setLastWatered]=useState(initial?.crops[0]?.lastWateredAt || ""); const [lastFertilized,setLastFertilized]=useState(initial?.crops[0]?.lastFertilizedAt || ""); const [searching,setSearching]=useState(false); const [message,setMessage]=useState("");
  const canSave = !!city && selected.length > 0;
  const chosen = useMemo(()=>cropKnowledge.filter(c=>selected.includes(c.id)),[selected]);
  async function searchCities(){ setSearching(true);setMessage("");try{const r=await fetch(`/api/geocode?name=${encodeURIComponent(query)}`);const d=await r.json();if(!r.ok)throw new Error(d.error);setCities(d.cities);if(!d.cities.length)setMessage("没有找到城市，请换一个名称");}catch(e){setMessage(e instanceof Error?e.message:"城市搜索失败");}finally{setSearching(false);} }
  function toggleCrop(id:string){setSelected(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);}
  function submit(){if(!city||!canSave)return;const now=new Date().toISOString();onSave({id:initial?.id||crypto.randomUUID(),name:gardenName,city:[city.name,city.admin1].filter(Boolean).join(" · "),latitude:city.latitude,longitude:city.longitude,environment,growingMethod:method,crops:chosen.map(c=>({id:initial?.crops.find(x=>x.cropId===c.id)?.id||crypto.randomUUID(),cropId:c.id,name:c.name,stage,lastWateredAt:lastWatered||undefined,lastFertilizedAt:lastFertilized||undefined})),updatedAt:now});}
  return <section className="paper-card p-6 md:p-9"><div className="flex items-start gap-4"><span className="grid size-12 place-items-center rounded-2xl bg-leaf-100 text-leaf-700"><Sprout/></span><div><p className="eyebrow">Garden Profile</p><h2 className="mt-2 text-3xl font-bold text-leaf-900">建立菜园档案</h2><p className="muted mt-2">这些信息只保存在当前浏览器中。</p></div></div>
    <div className="mt-8 grid gap-6 md:grid-cols-2"><label className="block"><span className="mb-2 block text-sm font-bold">菜园名称</span><input className="field" value={gardenName} onChange={e=>setGardenName(e.target.value)}/></label><div><span className="mb-2 block text-sm font-bold">所在城市</span><div className="flex gap-2"><input className="field" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();searchCities();}}}/><button className="btn-secondary !px-4" onClick={searchCities} disabled={searching}>{searching?<LoaderCircle className="animate-spin"/>:<Search/>}</button></div>{message&&<p className="mt-2 text-sm text-amber-700">{message}</p>}{cities.length>0&&<div className="mt-2 overflow-hidden rounded-2xl border border-leaf-100 bg-white">{cities.map(c=><button key={`${c.id}-${c.latitude}`} onClick={()=>{setCity(c);setQuery(c.name);setCities([]);}} className="flex min-h-11 w-full items-center justify-between border-b border-leaf-50 px-4 text-left last:border-0 hover:bg-leaf-50"><span>{c.name} {c.admin1}</span>{city?.latitude===c.latitude&&<Check size={17}/>}</button>)}</div>} {city&&<p className="mt-2 text-xs text-leaf-700"><MapPin className="mr-1 inline" size={14}/>已选择：{city.name} {city.admin1}</p>}</div>
      <label><span className="mb-2 block text-sm font-bold">种植空间</span><select className="field" value={environment} onChange={e=>setEnvironment(e.target.value as GardenEnvironment)}>{["庭院","阳台","露台","室内窗台"].map(x=><option key={x}>{x}</option>)}</select></label><label><span className="mb-2 block text-sm font-bold">种植方式</span><select className="field" value={method} onChange={e=>setMethod(e.target.value as GrowingMethod)}>{["地栽","盆栽","种植箱"].map(x=><option key={x}>{x}</option>)}</select></label>
    </div>
    <div className="mt-8"><span className="mb-3 block text-sm font-bold">正在种什么？</span><div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">{cropKnowledge.map(c=><button key={c.id} onClick={()=>toggleCrop(c.id)} aria-pressed={selected.includes(c.id)} className={`min-h-20 rounded-2xl border p-2 text-center transition ${selected.includes(c.id)?"border-leaf-500 bg-leaf-100":"border-leaf-100 bg-white hover:border-leaf-300"}`}><span className="block text-2xl">{c.emoji}</span><span className="mt-1 block text-sm font-bold">{c.name}</span></button>)}</div></div>
    <div className="mt-7 grid gap-5 md:grid-cols-3"><label><span className="mb-2 block text-sm font-bold">生长阶段</span><select className="field" value={stage} onChange={e=>setStage(e.target.value as GrowthStage)}>{stages.map(x=><option key={x}>{x}</option>)}</select></label><label><span className="mb-2 block text-sm font-bold">最近浇水</span><input type="date" className="field" value={lastWatered} onChange={e=>setLastWatered(e.target.value)}/></label><label><span className="mb-2 block text-sm font-bold">最近施肥</span><input type="date" className="field" value={lastFertilized} onChange={e=>setLastFertilized(e.target.value)}/></label></div>
    <div className="mt-8 flex flex-wrap justify-end gap-3">{onCancel&&<button className="btn-secondary" onClick={onCancel}>取消</button>}<button className="btn-primary" onClick={submit} disabled={!canSave}><Plus size={18}/>{initial?"保存修改":"建立菜园"}</button></div>
  </section>;
}
