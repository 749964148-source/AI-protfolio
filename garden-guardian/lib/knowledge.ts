import { cropById } from "@/data/crops";
import type { GardenProfile, KnowledgeSource } from "@/lib/types";

export function retrieveGardenKnowledge(profile:GardenProfile) {
  return profile.crops.map(instance => {
    const crop=cropById[instance.cropId];
    if(!crop) return {crop:instance.name,stage:instance.stage,coverage:"limited",tips:[],risks:[],source:null};
    return {crop:crop.name,stage:instance.stage,coverage:"structured",tips:[crop.stageTips[instance.stage],...crop.safeActions],risks:[...crop.weatherRisks,...crop.commonIssues],avoid:crop.avoidActions,source:crop.source};
  });
}

export function uniqueSources(profile:GardenProfile):KnowledgeSource[]{
  const map=new Map<string,KnowledgeSource>();
  profile.crops.forEach(c=>{const source=cropById[c.cropId]?.source;if(source)map.set(source.url,source);});
  map.set("https://www.cma.gov.cn/",{title:"天气预报与农业气象风险资料",publisher:"中国气象局",url:"https://www.cma.gov.cn/",updatedAt:"2026-07-30"});
  return [...map.values()];
}
