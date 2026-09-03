import type { WeatherSnapshot } from "@/lib/types";

export async function fetchWeather(latitude:number, longitude:number, city:string): Promise<WeatherSnapshot> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude",String(latitude)); url.searchParams.set("longitude",String(longitude));
  url.searchParams.set("current","temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m");
  url.searchParams.set("daily","weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max");
  url.searchParams.set("timezone","auto"); url.searchParams.set("forecast_days","7");
  const response = await fetch(url,{next:{revalidate:900}});
  if(!response.ok) throw new Error("天气服务暂时不可用");
  const data=await response.json(); const daily=data.daily;
  return {city,current:{temperature:data.current.temperature_2m,apparentTemperature:data.current.apparent_temperature,humidity:data.current.relative_humidity_2m,weatherCode:data.current.weather_code,windSpeed:data.current.wind_speed_10m},daily:daily.time.map((date:string,i:number)=>({date,weatherCode:daily.weather_code[i],temperatureMax:daily.temperature_2m_max[i],temperatureMin:daily.temperature_2m_min[i],precipitationProbability:daily.precipitation_probability_max[i]??0,precipitationSum:daily.precipitation_sum[i]??0,windSpeedMax:daily.wind_speed_10m_max[i]??0})),fetchedAt:new Date().toISOString()};
}
