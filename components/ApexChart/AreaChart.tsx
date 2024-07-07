'use client' // don't forget this part if you use app dir to mark the whole
             // file as client-side components

import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export type AreaChartProps = {
  series: any,
};
export default function AreaChart({ series }: AreaChartProps) {
  const options = {
    xaxis: {
      type: 'datetime',
    },
    tooltip: {
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    }
  };

  return (
    <>
      <Chart
        type="area" series={series}
        // @ts-ignore
        options={options} height={350}
      />
    </>
  )
}