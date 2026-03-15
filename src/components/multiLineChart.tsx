"use client";

// import { TrendingUp } from "lucide-react";
import { Bar, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartData } from "@/lib/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { DateRange } from "react-day-picker";

export const description = "A multiple line chart";

const chartConfig = {
  actualGeneration: {
    label: "Actual value (MW)",
    color: "var(--chart-1)",
  },
  forecastedGeneration: {
    label: "Forecasted value (MW)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const formatXAxis = (value: string) => {
  const date = new Date(value);

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  // Show date at midnight
  if (hours === 0 && minutes === 0) {
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  // Otherwise show time
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function MultiLineChart({
  chartData,
  date,
}: {
  chartData: ChartData[];
  date: DateRange | undefined;
}) {
  return (
    <Card className="w-[95%] md:w-[80%] md:h-[63%] mt-20 md:my-10">
      <CardHeader>
        <CardTitle>Power Generation Chart</CardTitle>
        <CardDescription>
          {`From
          ${date?.from ? date.from.toDateString() : ""} -
          ${date?.to ? date.to.toDateString() : ""}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="w-full md:h-[75%]" config={chartConfig}>
          <LineChart
            className="-ml-5 md:mt-8"
            accessibilityLayer
            data={chartData}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={6}
              tickFormatter={(value) =>
                value === 0 ? "0" : `${value / 1000}k`
              }
            />
            <XAxis
              dataKey="startTime"
              // type="category"
              // interval="preserveStartEnd"
              tickLine={true}
              axisLine={false}
              tickMargin={8}
              minTickGap={30}
              tickFormatter={formatXAxis}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
              labelFormatter={(value) => new Date(value).toLocaleString()}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="actualGeneration"
              type="monotone"
              stroke="var(--color-actualGeneration)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="forecastedGeneration"
              type="monotone"
              stroke="var(--color-forecastedGeneration)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      {/* <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  );
}
