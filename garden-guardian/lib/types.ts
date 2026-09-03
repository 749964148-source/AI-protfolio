export type GrowthStage = "播种萌发" | "幼苗期" | "营养生长期" | "开花结果期" | "采收期";
export type GardenEnvironment = "庭院" | "阳台" | "露台" | "室内窗台";
export type GrowingMethod = "地栽" | "盆栽" | "种植箱";

export interface CropInstance {
  id: string;
  cropId: string;
  name: string;
  stage: GrowthStage;
  plantedAt?: string;
  lastWateredAt?: string;
  lastFertilizedAt?: string;
}

export interface GardenProfile {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  environment: GardenEnvironment;
  growingMethod: GrowingMethod;
  crops: CropInstance[];
  updatedAt: string;
}

export interface CityResult {
  id: number;
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

export interface WeatherDay {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbability: number;
  precipitationSum: number;
  windSpeedMax: number;
}

export interface WeatherSnapshot {
  city: string;
  current: {
    temperature: number;
    apparentTemperature: number;
    humidity: number;
    weatherCode: number;
    windSpeed: number;
  };
  daily: WeatherDay[];
  fetchedAt: string;
}

export type TaskPriority = "urgent" | "today" | "observe";
export interface GardenTask {
  id: string;
  cropName: string;
  title: string;
  detail: string;
  priority: TaskPriority;
  reason: string;
  avoid?: string;
  done?: boolean;
}

export interface KnowledgeSource {
  title: string;
  publisher: string;
  url: string;
  updatedAt: string;
}

export interface CropKnowledge {
  id: string;
  name: string;
  aliases: string[];
  emoji: string;
  preferredTemperature: [number, number];
  waterNeed: "低" | "中" | "较高";
  stageTips: Record<GrowthStage, string>;
  weatherRisks: string[];
  commonIssues: string[];
  safeActions: string[];
  avoidActions: string[];
  source: KnowledgeSource;
}
