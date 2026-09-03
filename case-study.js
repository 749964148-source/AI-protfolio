(() => {
  const cases = {
    ehs: {
      index: '01', category: 'FLAGSHIP · ENTERPRISE AI', title: 'EHS Buddy',
      subtitle: '从分散的 EHS 任务，到一个统一的 Agent 工作入口。',
      meta: ['Tesla · APAC EHS', '业务 × IT 共创', 'Agent + Workflow'],
      results: [['23', 'business platforms'], ['864', 'China users'], ['242', 'sites'], ['1,607', 'valid forms'], ['2,285', 'global valid forms']],
      lead: 'EHS Buddy 是面向全球 EHS 团队的 AI 系统工具。我的工作不是把一个聊天框放进旧系统，而是把真实业务任务、Site 信息、表单结构和用户反馈重新组织成一条可执行的工作流。',
      note: '企业项目的界面与数据已采用公开演示或脱敏重构。Global 有效表单数字按本次作品集口径展示，正式发布前需与项目记录再次核对。',
      problemTitle: 'EHS 伙伴缺少的不是工具，而是一个更短的完成路径。',
      problems: [['A', '入口与信息分散', 'Take Charge、Action、Inspection、EHS RN 等场景分布在不同平台，用户需要自己判断先去哪一个入口。'], ['B', 'Site 与规则复杂', '不同 Site、任务类型和表单字段带来大量上下文，非熟练用户容易漏项或提交无效内容。'], ['C', '发现问题的人不一定是 EHS', '一线和非 EHS 伙伴看到隐患时，需要一个更低门槛的反馈方式，而不是先学习完整系统。']],
      before: '用户在多个平台间跳转，靠经验确认规则，再手动补齐表单。', after: '用户先描述任务，Agent 识别意图、匹配 Site、引导收集信息，再进入结构化校验和提交。',
      decisions: [['01', '为什么用 Agent，而不是再做一个菜单？', '自然语言适合承接“我想完成什么”，但最终提交必须回到结构化字段。于是产品采用“对话理解 + 结构化确认”的双层入口。'], ['02', '哪些步骤必须由人确认？', '涉及 Site、风险等级和正式提交的动作保留用户确认，Agent 负责收集、解释、检查和准备，不替用户做不可逆判断。'], ['03', '如何让 23 个平台成为一条体验？', '不把平台差异直接暴露给用户，而是先抽象任务能力，再由 Workflow 处理底层系统连接。']],
      flowTitle: '从一句话，到一次有效提交。',
      flow: [['01', '说出任务', '用户描述现场发现或待办'], ['02', '识别意图', 'Agent 判断对应业务场景'], ['03', '匹配上下文', '连接 Site 与相关规则'], ['04', '补齐信息', '通过追问减少漏项'], ['05', '结构化校验', '检查字段与提交条件'], ['06', '回到系统', '完成有效业务提交']],
      demoHref: 'EHS buddy · Agent Tools Demo.html', demoLabel: 'EHS Buddy · Agent Tools Demo', disclaimer: '演示重点：Agent 工具入口、对话式任务处理、Skill 工具箱与结构化业务流程。',
      validationTitle: '把一次性上线，变成持续使用。',
      validation: [['UAT & 灰度', '负责 Agent 的 UAT、灰度测试与用户反馈收集，围绕高频任务持续验证。'], ['Skill 工具箱', '将团队高频任务沉淀为可个性化定制、可复用的 AI 工具能力。'], ['推广与规模化', '在全球 EHS 团队内推动产品落地和持续使用，中国区域覆盖 864 名独立用户。']],
      next: ['02', 'HOP 安全洞察游戏', 'hop']
    },
    hop: {
      index: '02', category: 'BEHAVIOR DESIGN · TESLA EHS', title: 'HOP 安全洞察游戏',
      subtitle: '让抽象的 Human & Organizational Performance，变成一次亲自判断的现场情景。',
      meta: ['Tesla · EHS', '情景模拟', '安全认知与行为设计'], results: [['PA', 'player role'], ['3', 'decision scenes'], ['HOP', 'system thinking']],
      lead: 'HOP 强调从系统与人的视角理解偏差与失败。我把这套不容易被记住的安全理念，转化为一段一线员工可以亲自进入、判断和复盘的情景模拟。',
      note: '这个案例的重点不是“做了一个游戏”，而是如何避免把安全问题简化成寻找责任人，并让用户看见系统条件、沟通方式与现场线索之间的关系。',
      problemTitle: '安全培训不缺内容，缺的是从理解到行动的那一步。',
      problems: [['A', '理念停留在术语', '用户可能记住 HOP 的缩写，却未必能在真实现场识别“系统如何影响人的行为”。'], ['B', 'KPI 完成不等于能力形成', '传统培训更容易验证是否完成，而难以观察用户如何做判断、如何解释选择。'], ['C', '现场信息不会一次性出现', '真实风险往往藏在工单、沟通、环境与时间压力里，不能只靠一张静态题目还原。']],
      before: '阅读概念、完成题目、记住正确答案。', after: '进入现场、获取线索、与角色沟通、作出判断，再理解选择带来的后果。',
      decisions: [['01', '为什么让用户扮演 PA？', 'PA 既需要完成现场任务，又需要与人沟通、观察系统条件，是连接“执行”和“洞察”的合适角色。'], ['02', '如何设计没有单一坏人的选项？', '选项围绕信息是否充分、沟通是否安全、系统条件是否被看见来设计，而不是只判断谁对谁错。'], ['03', '游戏的终点是什么？', '不是通关本身，而是将发现转译成一条可行动的安全洞察，推动后续改善。']],
      flowTitle: '从现场线索，到可行动的洞察。',
      flow: [['01', '接受工单', '确认任务与现场背景'], ['02', '情景沟通', '理解不同角色的约束'], ['03', '现场观察', '寻找环境与流程线索'], ['04', '做出判断', '选择下一步行动'], ['05', '查看后果', '理解系统与人的关系'], ['06', '形成洞察', '沉淀可执行改善']],
      demoHref: 'hop-safety-insight-game-demo.html', demoLabel: 'HOP Safety Insight · Interactive Demo', disclaimer: '演示重点：情景进入、角色判断、风险线索和即时反馈。',
      validationTitle: '让“安全意识”变成可以被观察的行为。',
      validation: [['情景化', '将抽象 HOP 原则放进工单确认、情景沟通与现场观察，而不是单独讲授概念。'], ['反馈化', '每次选择都给出原因和后果，让用户看到判断为什么重要。'], ['可复盘', '最后把发现转化为安全洞察，连接培训体验与后续改善行动。']],
      next: ['03', '车间安全通行大师争霸赛', 'passage']
    },
    passage: {
      index: '03', category: 'GAMIFICATION · TESLA EHS', title: '安全通行大师争霸赛',
      subtitle: '把车间常见的安全通行问题，变成一场 2,964 人参与的飞行棋挑战。',
      meta: ['Tesla · EHS', '活动产品', '2964 participants'], results: [['2,964', 'participants'], ['1', 'board game'], ['20', 'spaces to safety']],
      lead: '安全通行规则本身并不难，真正的挑战是让员工愿意在重复宣导之外，再次把注意力放回现场。于是我将高频问题映射为飞行棋事件，用低门槛、即时反馈和轻竞争重新设计参与路径。',
      note: '这里不把参与人数包装成学习效果。2964 人证明了触达和参与规模；答题正确率、复玩率和行为变化需要用后续活动数据继续验证。',
      problemTitle: '当规则变得熟悉，注意力反而最容易离开。',
      problems: [['A', '信息重复带来疲劳', '安全通行问题常被反复提醒，但单向宣导很难持续获得一线注意力。'], ['B', '问题离体验太远', '用户知道规则，却不一定在具体路口、交叉区或临时物料场景中主动联想。'], ['C', '参与缺少反馈', '如果完成教育后没有即时结果、进度和同伴比较，活动很难形成传播动力。']],
      before: '安全规则宣导 → 被动阅读 → 完成任务。', after: '进入棋盘 → 遇到现场情景 → 作答并获得反馈 → 推进到终点。',
      decisions: [['01', '为什么选择飞行棋？', '规则低门槛、进度直观、适合多人围观，也能自然容纳“前进、停留、挑战”等安全事件。'], ['02', '如何避免游戏喧宾夺主？', '棋盘只负责降低进入门槛，真正的内容仍来自车间高频安全通行场景和每题后的解释。'], ['03', '如何理解 2964 人这个结果？', '将其作为参与规模指标，同时明确区分触达、完成、答题正确和真实行为变化。']],
      flowTitle: '从一个格子，到一次安全提醒。',
      flow: [['01', '进入棋盘', '理解目标与玩法'], ['02', '摇骰前进', '保持节奏和期待'], ['03', '触发事件', '遇到典型通行场景'], ['04', '选择答案', '判断下一步行动'], ['05', '即时反馈', '看见对错与原因'], ['06', '安全达阵', '完成一次轻量复盘']],
      demoHref: 'safety-passage-game-demo.html', demoLabel: 'Safety Passage Master · Game Demo', disclaimer: '演示重点：棋盘、摇骰、情景题和反馈循环。参与数据来自项目记录。',
      validationTitle: '把参与规模和学习效果分开看。',
      validation: [['参与规模', '项目已有 2964 人参与，说明游戏化机制成功降低了进入和参与门槛。'], ['内容映射', '将车间常见通行问题转化为棋盘事件，让用户在语境中重新遇到规则。'], ['下一步验证', '如果继续运营，应补充完成率、正确率、复玩率与现场行为观察，建立效果闭环。']],
      next: ['04', 'Garden Guardian', 'garden']
    },
    garden: {
      index: '04', category: 'PERSONAL 0→1 · REAL USERS', title: 'Garden Guardian',
      subtitle: '为姥姥做一款她真的会用的菜园助手。',
      meta: ['个人项目', '移动端小程序', 'AI + Weather + Care'], results: [['1', 'real grandmother'], ['12', 'crop knowledge cards'], ['30', 'evaluation cases'], ['0→1', 'built & shipped']],
      lead: '姥姥在种菜时经常遇到病虫害、浇水、施肥和天气应对问题。她需要的不是一个拥有更多按钮的农业应用，而是遇到问题时可以立刻说清楚、得到下一步建议的工具。',
      note: 'Garden Guardian 目前已经被姥姥使用，并推广给她的种植爱好者朋友。项目同时明确区分规则评测与模型准确率，未将有限测试包装成 AI 效果承诺。',
      problemTitle: '适老化不是把字号放大，而是把一次任务说清楚。',
      problems: [['A', '信息专业但不易执行', '种植知识很多，但用户真正需要的是“今天先做哪一件事”，而不是一整页术语。'], ['B', '问题往往需要多种判断', '天气、作物阶段、土肥、病理和昆虫因素可能同时影响一个症状。'], ['C', 'AI 必须诚实表达边界', '信息不足或图片不清时，系统应该追问、降低置信度或建议咨询，而不是给出伪确定答案。']],
      before: '搜索零散信息、反复比较、凭经验判断。', after: '查看今日任务、拍照描述、由专家路由分析，再得到带置信度和安全边界的行动建议。',
      decisions: [['01', '为什么做标准版与关怀版？', '同一套能力面对不同数字熟练度。标准版服务完整管理，关怀版将任务拆小、放大关键操作，并提供语音和文字兜底。'], ['02', '为什么采用多专家路由？', '先做客观视觉观察，再动态调度栽培、土肥、病理、昆虫与气象专家，避免所有问题都由一个泛化回答承担。'], ['03', '如何控制 AI 幻觉风险？', '结构化输出、置信度、追问、规则降级、安全禁忌和“建议咨询农技人员”共同构成产品边界。']],
      flowTitle: '从一张照片，到一条可以执行的建议。',
      flow: [['01', '描述问题', '选择作物与生长阶段'], ['02', '观察图片', '提取可见症状与客观信息'], ['03', '专家路由', '调度相关领域判断'], ['04', '综合研判', '合并天气与知识库信息'], ['05', '表达边界', '给出置信度与追问'], ['06', '执行记录', '生成任务并持续跟踪']],
      demoHref: 'garden-guardian-demo.html', demoLabel: 'Garden Guardian · Mobile Prototype', disclaimer: '演示重点：今日任务、关怀模式、作物档案和 AI 诊断边界。完整 Next.js 项目位于 garden-guardian/。', gardenDemo: true,
      validationTitle: '真实用户，是这个项目最重要的评测环境。',
      validation: [['真实使用', '姥姥已经在使用产品，并将它推荐给种植爱好者朋友。'], ['可评测能力', '建立 12 种作物知识卡与 30 个可复现基础评测案例，验证天气风险、专家路由和信息不足处理。'], ['诚实边界', '明确区分规则通过率与模型准确率，未配置模型密钥时进入规则降级模式，不伪装成 AI 分析。']],
      next: ['01', 'EHS Buddy', 'ehs']
    }
  };

  const params = new URLSearchParams(location.search);
  const key = cases[params.get('case')] ? params.get('case') : 'ehs';
  const data = cases[key];
  const root = document.querySelector('#case-root');
  const template = document.querySelector('#case-template');
  root.appendChild(template.content.cloneNode(true));
  document.title = `${data.title}｜项目案例`;

  const field = (name, value) => {
    const el = root.querySelector(`[data-field="${name}"]`);
    if (!el) return;
    if (name === 'demoHref') el.href = value;
    else el.textContent = value;
  };
  ['index', 'category', 'title', 'subtitle'].forEach((name) => field(name, data[name]));
  field('demoHref', data.demoHref);
  field('demoLabel', '打开 Demo');
  document.querySelector(`[data-case-link="${key}"]`)?.classList.add('active');
  root.querySelector('[data-list="meta"]').insertAdjacentHTML('afterbegin', data.meta.map((item) => `<span>${item}</span>`).join(''));
  root.querySelector('[data-list="results"]').innerHTML = data.results.map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join('');

  // The case page uses the same material language as the home page, with a lighter-weight canvas.
  const canvas = root.querySelector('#case-canvas'); const ctx = canvas?.getContext('2d');
  if (canvas && ctx) {
    const colors = key === 'garden' ? ['#92c994','#f3cf8a','#9ec9dc','#e9a7a1'] : key === 'passage' ? ['#e7bb83','#ee8b77','#86bacd','#c5b6df'] : key === 'hop' ? ['#9cc9dd','#a798dc','#ef9e9e','#d6c37d'] : ['#e99a83','#e7c274','#7db9bf','#aaa1d6'];
    let w=1,h=1, raf=0; const resize=()=>{const r=canvas.getBoundingClientRect();const d=Math.min(devicePixelRatio||1,1.35);w=canvas.width=Math.max(1,r.width*d);h=canvas.height=Math.max(1,r.height*d)}; new ResizeObserver(resize).observe(canvas); resize(); const draw=(t=0)=>{ctx.fillStyle=colors[0];ctx.fillRect(0,0,w,h);ctx.globalCompositeOperation='source-over';colors.forEach((c,i)=>{const x=(.18+(i%3)*.31+Math.sin(t*.00008+i)*.18)*w;const y=(.24+(i%2)*.5+Math.cos(t*.00009+i)*.16)*h;const r=Math.max(w,h)*(.35+i*.02);const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c+'e8');g.addColorStop(.55,c+'a5');g.addColorStop(1,c+'00');ctx.fillStyle=g;ctx.fillRect(0,0,w,h)});if(!matchMedia('(prefers-reduced-motion: reduce)').matches)raf=requestAnimationFrame(draw)};draw();addEventListener('pagehide',()=>cancelAnimationFrame(raf),{once:true});
  }
  const cursor = document.querySelector('.cursor-lens'); if(cursor && matchMedia('(hover:hover) and (pointer:fine)').matches){let tx=-50,ty=-50,x=tx,y=ty;const label=cursor.querySelector('span');const loop=()=>{x+=(tx-x)*.2;y+=(ty-y)*.2;cursor.style.left=x+'px';cursor.style.top=y+'px';requestAnimationFrame(loop)};addEventListener('pointermove',(e)=>{tx=e.clientX;ty=e.clientY;cursor.classList.add('is-on');const t=e.target.closest('a,button,.interactive');cursor.classList.toggle('is-target',!!t);label.dataset.label=t?.dataset.cursor||''},{passive:true});loop();}
  const bar=document.querySelector('.case-progress i');addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;if(bar)bar.style.width=(max>0?scrollY/max*100:0)+'%'},{passive:true});
})();
