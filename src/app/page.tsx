"use client";

import { DatePickerWithRange } from "@/components/datePickerWithRange";
import { MultiLineChart } from "@/components/multiLineChart";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { DateRange } from "react-day-picker";

export default function Home() {
  /*------------------------ USESTATES ------------------------*/

  const { theme, setTheme } = useTheme();
  const [actuals, setActuals] = useState<WindGenerationActual[]>([]);
  const [forecasted, setForecasted] = useState<
    Map<string, WindGenerationForecast[]>
  >(new Map());
  const [horizon, setHorizon] = useState<number[]>([4]);
  const [chart, setChart] = useState<ChartData[]>([]);

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date("2024-01-01")),
    to: new Date(new Date("2024-01-31")),
  });

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
      if (!date?.from || !date?.to) return false;

      const t = new Date(a.startTime).getTime();

      const start = new Date(date?.from);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date?.to);
      end.setHours(23, 59, 59, 999);

      return t >= start.getTime() && t <= end.getTime();
    });

    const data = buildSeries(filteredActuals, forecasted, horizon[0]);
    setChart(data);
  }, [actuals, forecasted, horizon, date]);

  /*------------------------ TSX ------------------------*/

  return (
    <div className="flex min-h-screen">
      <main className="w-full flex flex-col gap-8 items-center">
        <header className="w-full border-b-2 py-6 px-10 flex justify-between items-center">
          <h2 className="text-xl tracking-wide font-semibold">
            Forecast Monitoring App
          </h2>
          <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "☀️" : "🌙"}
          </Button>
        </header>

        <div className="w-full flex flex-col md:flex-row gap-15 md:gap-0 md:justify-around">
          <DatePickerWithRange date={date} setDate={setDate} />

          <div className="mx-auto w-full max-w-xs flex flex-col justify-center gap-4">
            <Label htmlFor="horizon" className="flex justify-center">
              Forecast Horizon: {horizon}h
            </Label>
            <Slider
              id="horizon"
              defaultValue={[4]}
              value={horizon}
              max={48}
              step={1}
              onValueChange={setHorizon}
            />
          </div>
        </div>
        <MultiLineChart chartData={chart} date={date} />
      </main>
    </div>
  );
}
