export type Province =
  | 'Gauteng'
  | 'Western Cape'
  | 'KwaZulu-Natal'
  | 'Limpopo'
  | 'Mpumalanga'
  | 'Eastern Cape'
  | 'Free State'
  | 'North West'
  | 'Northern Cape';

export interface TrackedPlant {
  id: string;
  cropId: string;
  name: string;
  plantedDate: string;
  fieldSizeSqM: number;
  growthProgress: number;
  wateringDueDays: number;
  status: 'Healthy' | 'Needs Attention' | 'Harvest Ready';
}

export interface TrackedAnimal {
  id: string;
  category: 'Cattle' | 'Poultry' | 'Goats' | 'Sheep';
  tagId: string;
  breed: string;
  count: number;
  status: 'Healthy' | 'Treated' | 'Quarantined';
  lastLogDate: string;
}

export interface CropInfo {
  id: string;
  name: string;
  localName: string; // South African local name (e.g. Spinasie, Mielies)
  avgPriceZAR: number; // in Rands
  unit: string; // e.g. kg, head, crate (10kg)
  rowSpacingCm: number;
  plantSpacingCm: number;
  seedsPerHa: number;
  fertilizerNeeds: string; // LAN, 2:3:2, etc.
  bestMonths: number[]; // 1-12 (Jan-Dec) for general South African conditions
  description: string;
}

export interface ProvinceData {
  province: Province;
  climateZone: string;
  currentSeason: string;
  idealCropsNow: string[];
  tips: string[];
}

export interface FarmLog {
  id: string;
  date: string;
  cropId: string;
  activityType: 'watering' | 'fertilizer' | 'planting' | 'harvest' | 'diagnostic' | 'other';
  notes: string;
  quantity?: string;
}

export interface DiagnosticResult {
  cropId: string;
  symptom: string;
  diagnosis: string;
  confidence: number;
  cause: string;
  treatmentOrganic: string;
  treatmentChemical: string;
  prevention: string;
  createdAt: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  rainProbability: number;
  windSpeed: number;
  advice: string;
}
