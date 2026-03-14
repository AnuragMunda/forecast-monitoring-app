import {
  ChartData,
  WindGenerationActual,
  WindGenerationActualRaw,
  WindGenerationForecast,
  WindGenerationForecastRaw,
} from "./types";

export const filterActualData = (
  data: WindGenerationActualRaw[],
): WindGenerationActual[] => {
  const actualData = data.map((d) => ({
    startTime: d.startTime,
    generation: d.generation,
  }));

  return actualData;
};

export const filterForecastedData = (
  data: WindGenerationForecastRaw[],
): WindGenerationForecast[] => {
  const forecastedData = data
    .map((d) => ({
      publishTime: d.publishTime,
      startTime: d.startTime,
      generation: d.generation,
    }))
    .filter((d) => {
      const start = new Date(d.startTime).getTime();
      const publish = new Date(d.publishTime).getTime();

      const horizonHours = (start - publish) / (1000 * 60 * 60);

      return horizonHours >= 0 && horizonHours <= 48;
    });

  return forecastedData;
};

export const groupByStartTime = (
  data: WindGenerationForecast[],
): Map<string, WindGenerationForecast[]> => {
  const map = new Map();

  for (const f of data) {
    if (!map.has(f.startTime)) {
      map.set(f.startTime, []);
    }

    map.get(f.startTime).push(f);
  }

  return map;
};

const selectForecast = (
  forecasts: WindGenerationForecast[],
  targetTime: string,
  horizon: number,
): WindGenerationForecast | null => {
  const cutoff = new Date(targetTime).getTime() - horizon * 3600000;

  const valid = forecasts.filter(
    (f) => new Date(f.publishTime).getTime() <= cutoff,
  );

  if (valid.length === 0) return null;

  valid.sort(
    (a, b) =>
      new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime(),
  );

  return valid[0];
};

export const buildSeries = (
  actuals: WindGenerationActual[],
  forecastMap: Map<string, WindGenerationForecast[]>,
  horizon: number,
): ChartData[] => {
  return actuals.map((a) => {
    const forecastsForTarget = forecastMap.get(a.startTime) || [];

    const forecast = selectForecast(forecastsForTarget, a.startTime, horizon);

    return {
      startTime: a.startTime,
      actualGeneration: a.generation,
      forecastedGeneration: forecast?.generation ?? null,
    };
  }).filter((d) => d.forecastedGeneration != null);
};
