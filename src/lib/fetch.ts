import { WindGenerationActual, WindGenerationForecast } from "./types";
import { ACTUAL_GENERATION_URL, FORECASTED_GENERATION_URL } from "./constants";
import {
  filterActualData,
  filterForecastedData,
  groupByStartTime,
} from "./helper";

export const fetchActualData = async (): Promise<WindGenerationActual[]> => {
  const res = await fetch(ACTUAL_GENERATION_URL, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  const actualDataFiltered = filterActualData(data);

  return actualDataFiltered;
};

export const fetchForecastedData = async (): Promise<
  Map<string, WindGenerationForecast[]>
> => {
  const res = await fetch(FORECASTED_GENERATION_URL, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  const forecastedData = filterForecastedData(data);

  const groupedData = groupByStartTime(forecastedData);

  return groupedData;
};
