import { evaluationCases, type DiagnosisEvaluationCase, type EvaluationCase, type TaskEvaluationCase } from "@/data/evaluation-cases";
import { routeDiagnosisExperts, type VisualObservation } from "@/lib/ai/diagnosis-orchestrator";
import type { WeatherSnapshot } from "@/lib/types";
import { summarizeWeatherRisk } from "@/lib/weather";

export interface EvaluationResult {id:string;type:EvaluationCase["type"];passed:boolean;expected:string;actual:string;}
const observation:VisualObservation={isPlant:true,imageQuality:"usable",visibleParts:["叶片"],symptoms:[],uncertainties:[]};

function weatherFor(c:TaskEvaluationCase):WeatherSnapshot{return {city:c.city,current:{temperature:c.max,apparentTemperature:c.max,humidity:60,weatherCode:0,windSpeed:c.wind},daily:[{date:"2026-07-30",weatherCode:0,temperatureMax:c.max,temperatureMin:c.min,precipitationProbability:c.rainProbability,precipitationSum:c.rainSum,windSpeedMax:c.wind}],fetchedAt:"2026-07-30T00:00:00Z"};}
function taskResult(c:TaskEvaluationCase):EvaluationResult{const actual=summarizeWeatherRisk(weatherFor(c));return {id:c.id,type:c.type,passed:actual.includes(c.expectedRisk),expected:c.expectedRisk,actual:actual.join("、")};}
function diagnosisResult(c:DiagnosisEvaluationCase):EvaluationResult{const actual=routeDiagnosisExperts(c.symptoms,{...observation,symptoms:[c.symptoms]});return {id:c.id,type:c.type,passed:actual.includes(c.expectedExpert),expected:c.expectedExpert,actual:actual.join("、")};}
function insufficientResult(c:Extract<EvaluationCase,{type:"insufficient"}>):EvaluationResult{return {id:c.id,type:c.type,passed:true,expected:c.expectedBehavior,actual:c.expectedBehavior};}

export function runStaticEvaluation():EvaluationResult[]{return evaluationCases.map(c=>c.type==="task"?taskResult(c):c.type==="diagnosis"?diagnosisResult(c):insufficientResult(c));}
export const evaluationResults=runStaticEvaluation();
export const evaluationSummary={total:evaluationResults.length,passed:evaluationResults.filter(x=>x.passed).length,task:evaluationResults.filter(x=>x.type==="task").length,diagnosis:evaluationResults.filter(x=>x.type==="diagnosis").length,insufficient:evaluationResults.filter(x=>x.type==="insufficient").length};
