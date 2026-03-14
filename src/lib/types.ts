export interface WindGenerationActualRaw {
  dataset: "FUELHH";
  publishTime: string;
  startTime: string;
  settlementDate: string;
  settlementPeriod: number;
  fuelType: "WIND";
  generation: number;
}

export interface WindGenerationActual {
  startTime: string;
  generation: number;
}

export interface WindGenerationForecastRaw {
  dataset: "WINDFOR";
  publishTime: string;
  startTime: string;
  generation: number;
}

export interface WindGenerationForecast {
  publishTime: string;
  startTime: string;
  generation: number;
}

export interface ChartData {
  startTime: string;
  actualGeneration: number;
  forecastedGeneration: number | null;
}
