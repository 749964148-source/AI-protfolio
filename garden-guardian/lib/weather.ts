import type { WeatherSnapshot } from "@/lib/types";

export const weatherLabels: Record<number, string> = {
  0:"晴", 1:"大部晴朗", 2:"多云", 3:"阴", 45:"有雾", 48:"雾凇", 51:"毛毛雨", 53:"小雨", 55:"较强细雨",
  61:"小雨", 63:"中雨", 65:"大雨", 71:"小雪", 73:"中雪", 75:"大雪", 80:"阵雨", 81:"较强阵雨", 82:"强阵雨", 95:"雷雨", 96:"雷雨伴冰雹", 99:"强雷雨伴冰雹",
};

export function weatherLabel(code: number) { return weatherLabels[code] || "天气变化"; }

export function summarizeWeatherRisk(weather: WeatherSnapshot): string[] {
  const today = weather.daily[0];
  if (!today) return [];
  const risks: string[] = [];
  if (today.temperatureMax >= 33) risks.push("高温");
  if (today.temperatureMin <= 2) risks.push("霜冻或低温");
  if (today.precipitationProbability >= 70 || today.precipitationSum >= 15) risks.push("强降雨");
  if (today.windSpeedMax >= 35) risks.push("大风");
  if (!risks.length) risks.push("天气平稳");
  return risks;
}
