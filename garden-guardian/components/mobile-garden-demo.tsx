"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  Check,
  ChevronRight,
  CircleAlert,
  CloudRain,
  Droplets,
  Home,
  Leaf,
  NotebookTabs,
  RotateCcw,
  Sprout,
  Sun,
  X,
} from "lucide-react";

type Tab = "today" | "garden" | "records";
type PlantId = "cucumber" | "tomato" | "pepper";

type Plant = {
  id: PlantId;
  name: string;
  emoji: string;
  stage: string;
  status: "attention" | "steady" | "ready";
  statusLabel: string;
  issue?: string;
  issueDetail?: string;
  action?: string;
};

type Task = {
  id: string;
  plantId: PlantId;
  plantName: string;
  title: string;
  detail: string;
  priority: "先做" | "今天" | "观察";
  reason: string;
  kind: "support" | "observe" | "water" | "diagnose";
  done: boolean;
};

type RecordItem = { id: string; time: string; title: string; detail: string; plantName: string };

const seedPlants: Plant[] = [
  {
    id: "cucumber",
    name: "黄瓜",
    emoji: "🥒",
    stage: "结果期",
    status: "attention",
    statusLabel: "需要处理",
    issue: "雷雨前加固支架",
    issueDetail: "今晚有雷雨和阵风，先检查黄瓜架是否松动。",
    action: "把靠外侧的两根支架绑紧，再轻轻摇一下确认稳固。",
  },
  {
    id: "tomato",
    name: "番茄",
    emoji: "🍅",
    stage: "开花结果期",
    status: "steady",
    statusLabel: "继续观察",
    issue: "下部叶片发黄",
    issueDetail: "先看土壤湿度和叶片背面，不急着施肥。",
    action: "拍一张叶片正面和背面，记录变化，保持通风。",
  },
  {
    id: "pepper",
    name: "辣椒",
    emoji: "🌶️",
    stage: "营养生长期",
    status: "ready",
    statusLabel: "状态不错",
  },
];

const seedTasks: Task[] = [
  {
    id: "support-cucumber",
    plantId: "cucumber",
    plantName: "黄瓜",
    title: "检查并加固黄瓜支架",
    detail: "把靠外侧的两根支架绑紧，雷雨前完成。",
    priority: "先做",
    reason: "今晚 19:00 后有雷雨和阵风。",
    kind: "support",
    done: false,
  },
  {
    id: "observe-tomato",
    plantId: "tomato",
    plantName: "番茄",
    title: "拍照看看番茄黄叶",
    detail: "拍叶片正面和背面，先观察，不要急着施肥。",
    priority: "今天",
    reason: "下部黄叶可能与水分或老叶有关，需要先确认。",
    kind: "diagnose",
    done: false,
  },
  {
    id: "water-pepper",
    plantId: "pepper",
    plantName: "辣椒",
    title: "早上根部少量补水",
    detail: "摸到表土发干再浇，沿盆边慢慢浇一圈。",
    priority: "观察",
    reason: "今天气温适中，辣椒不需要大水。",
    kind: "water",
    done: false,
  },
];

const seedRecords: RecordItem[] = [
  { id: "record-1", time: "昨天 08:40", title: "给番茄根部浇水", detail: "少量浇水，土壤没有积水。", plantName: "番茄" },
  { id: "record-2", time: "周一 17:20", title: "采收 3 根黄瓜", detail: "果实鲜嫩，顺手清理了两片老叶。", plantName: "黄瓜" },
];

function todayLabel() {
  return "9月3日 · 星期三";
}

export function MobileGardenDemo({ preview = false }: { preview?: boolean }) {
  const [tab, setTab] = useState<Tab>("today");
  const [plants, setPlants] = useState(seedPlants);
  const [tasks, setTasks] = useState(seedTasks);
  const [records, setRecords] = useState(seedRecords);
  const [plantSheet, setPlantSheet] = useState<Plant | null>(null);
  const [taskSheet, setTaskSheet] = useState<Task | null>(null);
  const [diagnosisSheet, setDiagnosisSheet] = useState<Plant | null>(null);
  const [note, setNote] = useState("");
  const [toast, setToast] = useState("");

  const remaining = useMemo(() => tasks.filter((task) => !task.done), [tasks]);
  const completed = tasks.length - remaining.length;
  const firstTask = remaining[0];

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  function openTask(task: Task) {
    if (task.kind === "diagnose") {
      const plant = plants.find((item) => item.id === task.plantId);
      if (plant) setDiagnosisSheet(plant);
      return;
    }
    setNote("");
    setTaskSheet(task);
  }

  function confirmTask() {
    if (!taskSheet) return;
    const current = taskSheet;
    setTasks((items) => items.map((task) => (task.id === current.id ? { ...task, done: true } : task)));
    setPlants((items) => items.map((plant) => (plant.id === current.plantId ? { ...plant, status: "ready", statusLabel: "已处理", issue: undefined } : plant)));
    setRecords((items) => [
      { id: `record-${Date.now()}`, time: "刚刚", title: current.title, detail: note.trim() || "已按建议完成处理。", plantName: current.plantName },
      ...items,
    ]);
    setTaskSheet(null);
    setNote("");
    showToast("已记录完成，菜园状态更新了");
  }

  function undoTask(record: RecordItem) {
    const match = tasks.find((task) => task.title === record.title && task.plantName === record.plantName);
    if (!match) return;
    setTasks((items) => items.map((task) => (task.id === match.id ? { ...task, done: false } : task)));
    setPlants((items) => items.map((plant) => (plant.id === match.plantId ? { ...plant, status: plant.id === "pepper" ? "ready" : "attention", statusLabel: plant.id === "pepper" ? "状态不错" : "需要处理" } : plant)));
    setRecords((items) => items.filter((item) => item.id !== record.id));
    showToast("已撤销这条记录");
  }

  function addDiagnosisTask() {
    if (!diagnosisSheet) return;
    const exists = tasks.some((task) => task.id === `diagnose-${diagnosisSheet.id}` && !task.done);
    if (!exists) {
      setTasks((items) => [
        ...items,
        {
          id: `diagnose-${diagnosisSheet.id}`,
          plantId: diagnosisSheet.id,
          plantName: diagnosisSheet.name,
          title: "继续观察并记录番茄叶片",
          detail: "明早再拍一张同角度照片，暂时不要追肥。",
          priority: "观察",
          reason: "诊断结果把握度 72%，需要连续观察 1–2 天。",
          kind: "observe",
          done: false,
        },
      ]);
    }
    setDiagnosisSheet(null);
    setTab("today");
    showToast("已加入今日任务");
  }

  return (
    <div className={`mobile-demo-wrap ${preview ? "is-preview" : ""}`}>
      <div className="mobile-demo-phone" aria-label="菜园守护 iPhone 17 小程序演示">
        <div className="mobile-demo-island" aria-hidden="true" />
        <div className="mobile-demo-screen">
          <div className="mobile-demo-statusbar"><span>9:41</span><span className="flex items-center gap-1"><span className="mobile-signal">▮▮▮</span> ᯤ 􀙇</span></div>
          <header className="mobile-demo-header">
            {tab === "today" ? <><div><p className="mobile-kicker">姥姥的小菜园</p><h1>早上好，今天先做一件事</h1></div><button className="mobile-avatar" aria-label="编辑菜园">姥</button></> : <><button className="mobile-back" onClick={() => setTab("today")} aria-label="返回今日"><ArrowLeft size={18} /></button><div><p className="mobile-kicker">我的菜园</p><h1>{tab === "garden" ? "正在照看的作物" : "照看记录"}</h1></div><span className="mobile-date">{todayLabel()}</span></>}
          </header>

          <main className="mobile-demo-content">
            {tab === "today" && <TodayScreen remaining={remaining} completed={completed} firstTask={firstTask} onTask={openTask} onPlant={(plant) => setPlantSheet(plant)} plants={plants} />}
            {tab === "garden" && <GardenScreen plants={plants} onPlant={(plant) => setPlantSheet(plant)} />}
            {tab === "records" && <RecordsScreen records={records} completed={completed} onUndo={undoTask} />}
          </main>

          <nav className="mobile-demo-nav" aria-label="小程序主导航">
            <NavButton active={tab === "today"} icon={<Home size={20} />} label="今日" onClick={() => setTab("today")} />
            <NavButton active={tab === "garden"} icon={<Sprout size={20} />} label="菜园" onClick={() => setTab("garden")} />
            <NavButton active={tab === "records"} icon={<NotebookTabs size={20} />} label="记录" onClick={() => setTab("records")} />
          </nav>

          {plantSheet && <PlantSheet plant={plantSheet} onClose={() => setPlantSheet(null)} onDiagnose={() => { setPlantSheet(null); setDiagnosisSheet(plantSheet); }} />}
          {taskSheet && <TaskSheet task={taskSheet} note={note} setNote={setNote} onClose={() => setTaskSheet(null)} onConfirm={confirmTask} />}
          {diagnosisSheet && <DiagnosisSheet plant={diagnosisSheet} onClose={() => setDiagnosisSheet(null)} onAdd={addDiagnosisTask} />}
          {toast && <div className="mobile-toast" role="status"><Check size={16} />{toast}</div>}
        </div>
      </div>
    </div>
  );
}

function NavButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return <button className={`mobile-nav-button ${active ? "is-active" : ""}`} onClick={onClick} aria-current={active ? "page" : undefined}>{icon}<span>{label}</span></button>;
}

function TodayScreen({ remaining, completed, firstTask, onTask, onPlant, plants }: { remaining: Task[]; completed: number; firstTask?: Task; onTask: (task: Task) => void; onPlant: (plant: Plant) => void; plants: Plant[] }) {
  return <div className="mobile-stack">
    <section className="mobile-weather-card"><div><span className="mobile-muted">沈阳 · 庭院地栽</span><strong>26°</strong><span className="mobile-weather-copy">多云，晚上有雷雨</span></div><div className="mobile-weather-icon"><CloudRain size={26} /><span>降雨 70%</span></div></section>
    <section className="mobile-focus-card"><div className="mobile-card-label"><span>今天先做一件事</span><span className="mobile-priority">优先</span></div><h2>{firstTask?.title || "今天的任务都完成啦"}</h2><p>{firstTask?.reason || "给自己和菜园放个小假，明天再来看看。"}</p>{firstTask && <button className="mobile-primary-button" onClick={() => onTask(firstTask)}>{firstTask.kind === "diagnose" ? "拍照看看" : "我去处理"}<ChevronRight size={17} /></button>}</section>
    <section><div className="mobile-section-heading"><div><span className="mobile-muted">今日计划</span><h2>还要做 {remaining.length} 件事</h2></div><span className="mobile-progress">{completed}/{completed + remaining.length} 完成</span></div><div className="mobile-task-list">{remaining.slice(0, 3).map((task) => <button key={task.id} className="mobile-task-card" onClick={() => onTask(task)}><span className={`mobile-task-icon ${task.kind === "support" ? "is-wind" : task.kind === "diagnose" ? "is-camera" : "is-water"}`}>{task.kind === "support" ? <WindIcon /> : task.kind === "diagnose" ? <Camera size={18} /> : <Droplets size={18} />}</span><span className="mobile-task-main"><span className="mobile-task-meta"><b>{task.priority}</b><em>{task.plantName}</em></span><strong>{task.title}</strong><small>{task.detail}</small></span><ChevronRight size={18} className="mobile-chevron" /></button>)}</div></section>
    <section className="mobile-mini-section"><div className="mobile-section-heading"><div><span className="mobile-muted">我的作物</span><h2>看一眼状态</h2></div><button className="mobile-text-button" onClick={() => onPlant(plants[0])}>查看全部</button></div><div className="mobile-plant-row">{plants.map((plant) => <button className="mobile-plant-chip" key={plant.id} onClick={() => onPlant(plant)}><span>{plant.emoji}</span><strong>{plant.name}</strong><small className={`status-${plant.status}`}>{plant.statusLabel}</small></button>)}</div></section>
    <div className="mobile-safety-note"><Sun size={17} /><span>小提醒：雷雨前不施肥，先把支架固定好。</span></div>
  </div>;
}

function GardenScreen({ plants, onPlant }: { plants: Plant[]; onPlant: (plant: Plant) => void }) {
  return <div className="mobile-stack"><section className="mobile-garden-summary"><div><span className="mobile-muted">姥姥的小菜园</span><strong>3 种作物</strong><p>沈阳 · 庭院地栽</p></div><span className="mobile-garden-mark"><Leaf size={25} /></span></section><div className="mobile-plant-list">{plants.map((plant) => <button key={plant.id} className="mobile-plant-card" onClick={() => onPlant(plant)}><span className="mobile-plant-emoji">{plant.emoji}</span><span className="mobile-plant-main"><span className="mobile-task-meta"><b>{plant.statusLabel}</b><em>{plant.stage}</em></span><strong>{plant.name}</strong><small>{plant.issue || "光照和水分都很合适，继续保持。"}</small></span><ChevronRight size={18} className="mobile-chevron" /></button>)}</div><section className="mobile-garden-tip"><span className="mobile-tip-icon"><Droplets size={18} /></span><div><strong>浇水不用凭感觉</strong><p>摸摸表土，发干了再浇。每次少一点，慢一点。</p></div></section></div>;
}

function RecordsScreen({ records, completed, onUndo }: { records: RecordItem[]; completed: number; onUndo: (record: RecordItem) => void }) {
  return <div className="mobile-stack"><section className="mobile-record-summary"><div><span className="mobile-muted">本周照看</span><strong>{completed + 5} 次</strong><p>每一次小动作，菜园都记得。</p></div><div className="mobile-record-week"><span className="is-done">一</span><span className="is-done">二</span><span className="is-done">三</span><span>四</span><span>五</span><span>六</span><span>日</span></div></section><section><div className="mobile-section-heading"><div><span className="mobile-muted">最近记录</span><h2>照看时间线</h2></div><CalendarDays size={20} className="text-leaf-600" /></div><div className="mobile-record-list">{records.map((record) => <article className="mobile-record-item" key={record.id}><span className="mobile-record-dot"><Check size={13} /></span><div><span className="mobile-muted">{record.time} · {record.plantName}</span><strong>{record.title}</strong><p>{record.detail}</p><button onClick={() => onUndo(record)} className="mobile-undo-button"><RotateCcw size={13} />撤销</button></div></article>)}</div></section>{records.length === 0 && <div className="mobile-empty-state"><Sprout size={28} /><strong>还没有照看记录</strong><p>完成一件小事后，这里会留下足迹。</p></div>}</div>;
}

function PlantSheet({ plant, onClose, onDiagnose }: { plant: Plant; onClose: () => void; onDiagnose: () => void }) {
  return <Sheet onClose={onClose}><div className="mobile-sheet-plant"><span className="mobile-sheet-emoji">{plant.emoji}</span><div><span className="mobile-muted">{plant.stage} · {plant.statusLabel}</span><h2>{plant.name}</h2></div></div>{plant.issue ? <><div className="mobile-issue-box"><CircleAlert size={19} /><div><strong>{plant.issue}</strong><p>{plant.issueDetail}</p></div></div><p className="mobile-sheet-copy">建议动作：{plant.action}</p><button className="mobile-primary-button w-full" onClick={onDiagnose}><Camera size={17} />拍照问问管家</button></> : <div className="mobile-good-box"><Check size={19} /><div><strong>状态不错，继续保持</strong><p>光照、湿度和叶片状态暂时都正常。</p></div></div>}<button className="mobile-secondary-button w-full" onClick={onClose}>知道了</button></Sheet>;
}

function TaskSheet({ task, note, setNote, onClose, onConfirm }: { task: Task; note: string; setNote: (value: string) => void; onClose: () => void; onConfirm: () => void }) {
  return <Sheet onClose={onClose}><div className="mobile-sheet-kicker">{task.priority} · {task.plantName}</div><h2 className="mobile-sheet-title">{task.title}</h2><p className="mobile-sheet-copy">{task.detail}</p><div className="mobile-reason"><span>为什么现在做</span><strong>{task.reason}</strong></div><label className="mobile-note-label">留一句记录（可选）<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="例如：支架已经绑紧了" rows={2} /></label><button className="mobile-primary-button w-full" onClick={onConfirm}><Check size={17} />我做完了</button><button className="mobile-secondary-button w-full" onClick={onClose}>先不做</button></Sheet>;
}

function DiagnosisSheet({ plant, onClose, onAdd }: { plant: Plant; onClose: () => void; onAdd: () => void }) {
  return <Sheet onClose={onClose}><div className="mobile-sheet-kicker">拍照问问 · {plant.name}</div><h2 className="mobile-sheet-title">先不用急着施肥</h2><div className="mobile-diagnosis-result"><div className="mobile-diagnosis-score"><strong>72%</strong><span>当前把握度</span></div><div><strong>更像是老叶自然变黄</strong><p>也可能和水分变化有关，暂时看不出需要用药的迹象。</p></div></div><div className="mobile-diagnosis-actions"><span>今天可以做</span><p>拍一张叶片正面和背面，保持通风，明早再看一次。</p></div><button className="mobile-primary-button w-full" onClick={onAdd}><NotebookTabs size={17} />加入今日任务</button><button className="mobile-secondary-button w-full" onClick={onClose}>先记在心里</button></Sheet>;
}

function Sheet({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return <div className="mobile-sheet-backdrop" role="presentation" onClick={onClose}><div className="mobile-sheet" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><button className="mobile-sheet-close" onClick={onClose} aria-label="关闭"><X size={18} /></button>{children}</div></div>;
}

function WindIcon() { return <span className="mobile-wind-icon"><i /><i /><i /></span>; }
