export interface TaskEvaluationCase {id:string;type:"task";city:string;crop:string;max:number;min:number;rainProbability:number;rainSum:number;wind:number;expectedRisk:string;}
export interface DiagnosisEvaluationCase {id:string;type:"diagnosis";crop:string;symptoms:string;expectedExpert:"pathology"|"entomology"|"soil"|"cultivation";}
export interface InsufficientEvaluationCase {id:string;type:"insufficient";input:string;expectedBehavior:string;}
export type EvaluationCase=TaskEvaluationCase|DiagnosisEvaluationCase|InsufficientEvaluationCase;

export const evaluationCases:EvaluationCase[]=[
  {id:"T01",type:"task",city:"沈阳",crop:"黄瓜",max:35,min:24,rainProbability:20,rainSum:0,wind:12,expectedRisk:"高温"},
  {id:"T02",type:"task",city:"北京",crop:"番茄",max:37,min:27,rainProbability:10,rainSum:0,wind:18,expectedRisk:"高温"},
  {id:"T03",type:"task",city:"西安",crop:"辣椒",max:34,min:25,rainProbability:30,rainSum:1,wind:10,expectedRisk:"高温"},
  {id:"T04",type:"task",city:"广州",crop:"小白菜",max:31,min:26,rainProbability:90,rainSum:28,wind:22,expectedRisk:"强降雨"},
  {id:"T05",type:"task",city:"杭州",crop:"草莓",max:29,min:23,rainProbability:80,rainSum:17,wind:16,expectedRisk:"强降雨"},
  {id:"T06",type:"task",city:"成都",crop:"生菜",max:25,min:20,rainProbability:75,rainSum:9,wind:9,expectedRisk:"强降雨"},
  {id:"T07",type:"task",city:"青岛",crop:"豆角",max:26,min:19,rainProbability:25,rainSum:0,wind:42,expectedRisk:"大风"},
  {id:"T08",type:"task",city:"大连",crop:"茄子",max:24,min:17,rainProbability:20,rainSum:0,wind:36,expectedRisk:"大风"},
  {id:"T09",type:"task",city:"昆明",crop:"番茄",max:22,min:11,rainProbability:20,rainSum:0,wind:38,expectedRisk:"大风"},
  {id:"T10",type:"task",city:"哈尔滨",crop:"小白菜",max:8,min:-2,rainProbability:10,rainSum:0,wind:15,expectedRisk:"霜冻或低温"},
  {id:"T11",type:"task",city:"长春",crop:"萝卜",max:9,min:1,rainProbability:20,rainSum:0,wind:14,expectedRisk:"霜冻或低温"},
  {id:"T12",type:"task",city:"呼和浩特",crop:"马铃薯",max:10,min:0,rainProbability:5,rainSum:0,wind:20,expectedRisk:"霜冻或低温"},
  {id:"T13",type:"task",city:"上海",crop:"香菜",max:26,min:18,rainProbability:30,rainSum:1,wind:12,expectedRisk:"天气平稳"},
  {id:"T14",type:"task",city:"武汉",crop:"韭菜",max:29,min:21,rainProbability:40,rainSum:2,wind:15,expectedRisk:"天气平稳"},
  {id:"T15",type:"task",city:"厦门",crop:"辣椒",max:30,min:24,rainProbability:50,rainSum:4,wind:18,expectedRisk:"天气平稳"},
  {id:"D01",type:"diagnosis",crop:"番茄",symptoms:"下部叶片发黄并有褐色斑点",expectedExpert:"pathology"},
  {id:"D02",type:"diagnosis",crop:"黄瓜",symptoms:"叶面有白色粉末状斑块",expectedExpert:"pathology"},
  {id:"D03",type:"diagnosis",crop:"草莓",symptoms:"果实发霉腐烂",expectedExpert:"pathology"},
  {id:"D04",type:"diagnosis",crop:"马铃薯",symptoms:"叶片出现黑斑并快速枯萎",expectedExpert:"pathology"},
  {id:"D05",type:"diagnosis",crop:"小白菜",symptoms:"叶片布满小孔，像被虫啃",expectedExpert:"entomology"},
  {id:"D06",type:"diagnosis",crop:"茄子",symptoms:"叶背有细小虫和蛛网",expectedExpert:"entomology"},
  {id:"D07",type:"diagnosis",crop:"豆角",symptoms:"嫩叶卷曲并发现蚜虫",expectedExpert:"entomology"},
  {id:"D08",type:"diagnosis",crop:"萝卜",symptoms:"叶片有不规则虫孔",expectedExpert:"entomology"},
  {id:"D09",type:"diagnosis",crop:"辣椒",symptoms:"植株矮小，老叶发黄",expectedExpert:"soil"},
  {id:"D10",type:"diagnosis",crop:"香菜",symptoms:"幼苗整体萎蔫，土很湿",expectedExpert:"soil"},
  {id:"D11",type:"diagnosis",crop:"黄瓜",symptoms:"长得很旺但不开花结果",expectedExpert:"cultivation"},
  {id:"D12",type:"diagnosis",crop:"番茄",symptoms:"果实裂开，最近忽干忽湿",expectedExpert:"cultivation"},
  {id:"I01",type:"insufficient",input:"照片严重模糊，没有症状描述",expectedBehavior:"说明图片质量不足并要求补拍"},
  {id:"I02",type:"insufficient",input:"上传的不是植物照片",expectedBehavior:"拒绝诊断并要求更换植物照片"},
  {id:"I03",type:"insufficient",input:"只说‘它怎么了’，没有作物和养护信息",expectedBehavior:"降低置信度并提出追问"},
];
