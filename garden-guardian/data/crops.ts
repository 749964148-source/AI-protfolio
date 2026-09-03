import type { CropKnowledge, GrowthStage } from "@/lib/types";

const stages = (seed: string, young: string, grow: string, fruit: string, harvest: string): Record<GrowthStage, string> => ({
  "播种萌发": seed, "幼苗期": young, "营养生长期": grow, "开花结果期": fruit, "采收期": harvest,
});

const agriSource = {
  title: "家庭园艺与蔬菜栽培公开技术资料",
  publisher: "中国农业农村信息网",
  url: "https://www.agri.cn/",
  updatedAt: "2026-07-30",
};

export const cropKnowledge: CropKnowledge[] = [
  { id:"tomato", name:"番茄", aliases:["西红柿"], emoji:"🍅", preferredTemperature:[18,28], waterNeed:"中", stageTips:stages("保持基质湿润但不积水","逐步增加光照，避免徒长","见干见湿并及时搭架","水分保持稳定，避免忽干忽湿","成熟果及时采收，清理病叶"), weatherRisks:["高温落花","暴雨裂果","大风倒伏"], commonIssues:["下部黄叶","脐腐","不开花结果","叶斑"], safeActions:["检查土壤湿度","加固支架","改善通风"], avoidActions:["暴雨前追肥","中午叶面喷水"], source:agriSource },
  { id:"cucumber", name:"黄瓜", aliases:["青瓜"], emoji:"🥒", preferredTemperature:[20,30], waterNeed:"较高", stageTips:stages("覆盖保湿，避免低温烂种","少量多次浇水，注意猝倒","引蔓上架并改善通风","根部稳定供水，及时采瓜","清理老叶和畸形瓜"), weatherRisks:["高温萎蔫","暴雨沤根","大风折蔓"], commonIssues:["叶片发黄","白粉状斑","虫咬孔洞","瓜条弯曲"], safeActions:["检查支架","根部补水","摘除严重病叶"], avoidActions:["叶面长期潮湿","暴雨前大水浇灌"], source:agriSource },
  { id:"pepper", name:"辣椒", aliases:["青椒","甜椒"], emoji:"🌶️", preferredTemperature:[20,30], waterNeed:"中", stageTips:stages("保温保湿，不让基质过湿","增加光照，控制徒长","适度控水促根","坐果后均匀供水，少量追肥","分批采收，观察枝条负担"), weatherRisks:["高温落花","低温生长停滞","积水烂根"], commonIssues:["叶片卷曲","落花","果实日灼","蚜虫"], safeActions:["检查叶背","高温时适当遮阴","疏通排水"], avoidActions:["频繁大水","高温时浓肥"], source:agriSource },
  { id:"eggplant", name:"茄子", aliases:[], emoji:"🍆", preferredTemperature:[22,30], waterNeed:"较高", stageTips:stages("保持温暖，覆土不宜过厚","光照充足并避免积水","培土搭架，维持旺盛叶片","结果期保持稳定水肥","及时采收避免果实老化"), weatherRisks:["低温僵苗","高温落花","大风倒伏"], commonIssues:["叶片黄化","红蜘蛛","果实畸形","萎蔫"], safeActions:["查看叶背虫情","加固主枝","检查排水"], avoidActions:["长期干旱后猛浇","病因不明时混用药剂"], source:agriSource },
  { id:"bean", name:"豆角", aliases:["菜豆","豇豆"], emoji:"🫘", preferredTemperature:[20,30], waterNeed:"中", stageTips:stages("避免低温湿涝导致烂种","保持光照，苗期不过量施氮","及时搭架引蔓","开花期避免水分剧烈波动","嫩荚及时采收促进继续开花"), weatherRisks:["大风缠蔓折断","连续阴雨落花","高温结荚差"], commonIssues:["不结荚","叶片虫孔","锈色斑点","藤蔓细弱"], safeActions:["搭架引蔓","清理落叶","观察花荚"], avoidActions:["氮肥过多","雨前叶面施肥"], source:agriSource },
  { id:"lettuce", name:"生菜", aliases:[], emoji:"🥬", preferredTemperature:[15,22], waterNeed:"中", stageTips:stages("低温保湿促进萌发","保持均匀湿度和通风","薄肥少量，避免叶片长期潮湿","高温期注意遮阴防抽薹","外叶或整株及时采收"), weatherRisks:["高温抽薹","暴雨烂叶","霜冻伤叶"], commonIssues:["叶缘焦枯","叶片腐烂","生长缓慢","蜗牛取食"], safeActions:["清理烂叶","早晚浇水","保持株间通风"], avoidActions:["傍晚叶面大量喷水","未洗净即食用"], source:agriSource },
  { id:"bokchoy", name:"小白菜", aliases:["青菜"], emoji:"🥬", preferredTemperature:[15,25], waterNeed:"中", stageTips:stages("浅播并保持表层湿润","间苗并防跳甲","均匀浇水，少量追肥","叶菜以营养生长管理为主","达到大小后及时采收"), weatherRisks:["高温虫害加重","暴雨倒伏","霜冻伤叶"], commonIssues:["跳甲虫孔","黄叶","软腐","徒长"], safeActions:["检查叶背和心叶","及时排水","覆盖防虫网"], avoidActions:["食用前临时高浓度追肥","积水环境继续浇水"], source:agriSource },
  { id:"radish", name:"萝卜", aliases:["白萝卜"], emoji:"🥕", preferredTemperature:[15,24], waterNeed:"中", stageTips:stages("直播并保持表土湿润","及时间苗，避免拥挤","肉质根膨大前保持稳定湿度","膨大期防忽干忽湿","成熟后及时采收防空心"), weatherRisks:["高温糠心","暴雨裂根","低温抽薹"], commonIssues:["裂根","空心","叶片虫孔","肉质根细小"], safeActions:["均匀供水","间苗松土","检查地下害虫"], avoidActions:["土壤干透后猛灌","追施过量氮肥"], source:agriSource },
  { id:"chive", name:"韭菜", aliases:[], emoji:"🌱", preferredTemperature:[15,25], waterNeed:"中", stageTips:stages("保持湿润促进出苗","避免积水和过密","收割后轻浇水并恢复生长","以营养生长期管理为主","留茬适中，工具保持清洁"), weatherRisks:["积水烂根","高温叶尖枯","严寒冻害"], commonIssues:["叶尖干枯","生长细弱","根蛆","锈病"], safeActions:["改善排水","清理枯叶","合理留茬"], avoidActions:["刚收割立即浓肥","长期积水"], source:agriSource },
  { id:"coriander", name:"香菜", aliases:["芫荽"], emoji:"🌿", preferredTemperature:[15,22], waterNeed:"中", stageTips:stages("种子适当处理后浅播保湿","间苗并保证光照","均匀供水防早抽薹","以叶片生长管理为主","分批采收保持鲜嫩"), weatherRisks:["高温抽薹","暴雨烂苗","严寒冻害"], commonIssues:["不萌发","徒长","叶片发黄","蚜虫"], safeActions:["早晚浇水","适当遮阴","及时采收"], avoidActions:["高温中午播种","长期闷湿"], source:agriSource },
  { id:"strawberry", name:"草莓", aliases:[], emoji:"🍓", preferredTemperature:[15,25], waterNeed:"中", stageTips:stages("保持湿润并避免深播","保护生长点，逐步见光","清理老叶和匍匐茎","开花结果时避免果面长期潮湿","成熟果及时采收"), weatherRisks:["高温日灼","连续阴雨灰霉","霜冻伤花"], commonIssues:["果实腐烂","叶斑","红蜘蛛","不开花"], safeActions:["垫高果实","清理病果","加强通风"], avoidActions:["果面频繁喷水","病果留在盆内"], source:agriSource },
  { id:"potato", name:"马铃薯", aliases:["土豆"], emoji:"🥔", preferredTemperature:[15,22], waterNeed:"中", stageTips:stages("种薯切块后适当晾干再播","出苗后及时查苗补土","分次培土防薯块见光","结薯期保持稳定湿度","植株衰老后选择晴天采收"), weatherRisks:["高温不结薯","连续阴雨晚疫风险","积水腐烂"], commonIssues:["叶片黑斑","植株矮小","薯块发绿","地下虫害"], safeActions:["培土遮光","雨后排水","清除严重病株"], avoidActions:["食用发绿薯块","积水地继续浇水"], source:agriSource },
];

export const cropById = Object.fromEntries(cropKnowledge.map(c => [c.id, c]));
