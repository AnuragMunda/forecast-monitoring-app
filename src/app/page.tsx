"use client";

import { DatePickerWithRange } from "@/components/datePickerWithRange";
import { MultiLineChart } from "@/components/multiLineChart";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { fetchActualData, fetchForecastedData } from "@/lib/fetch";
import { buildSeries } from "@/lib/helper";
import {
  ChartData,
  WindGenerationActual,
  WindGenerationForecast,
} from "@/lib/types";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Home() {
  /*------------------------ USESTATES ------------------------*/

  const { theme, setTheme } = useTheme();
  const [actuals, setActuals] = useState<WindGenerationActual[]>([]);
  const [forecasted, setForecasted] = useState<
    Map<string, WindGenerationForecast[]>
  >(new Map());
  const [horizon, setHorizon] = useState<number>(4);
  const [chart, setChart] = useState<ChartData[]>([]);

  const [startDate, setStartDate] = useState(new Date("2024-01-01T00:00:00Z"));
  const [endDate, setEndDate] = useState(new Date("2024-01-31T23:30:00Z"));

  /*------------------------ USEEFFECTS ------------------------*/

  useEffect(() => {
    const getAndSetData = async () => {
      const actualData = await fetchActualData();
      setActuals(actualData);

      const forecastedData = await fetchForecastedData();
      setForecasted(forecastedData);
    };

    getAndSetData();
  }, []);

  useEffect(() => {
    if (!actuals?.length || forecasted.size === 0) return;

    const filteredActuals = actuals.filter((a) => {
      const t = new Date(a.startTime);

      return t >= startDate && t <= endDate;
    });

    const data = buildSeries(filteredActuals, forecasted, horizon);
    console.log(data);
    setChart(data);
  }, [actuals, forecasted, horizon]);

  /*------------------------ TSX ------------------------*/

  return (
    <div className="flex min-h-screen">
      <main className="w-full flex flex-col gap-8 items-center">
        <header className="w-full border-b-2 py-6 px-10 flex justify-between items-center">
          <h2 className="text-xl tracking-wide font-semibold">Forecast Monitoring App</h2>
          <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </Button>
        </header>

        <div className="w-full flex">
          <DatePickerWithRange />
          <Slider
            defaultValue={[75]}
            max={100}
            step={1}
            className="mx-auto w-full max-w-xs"
          />
        </div>
        <MultiLineChart />
      </main>
    </div>
  );
}
