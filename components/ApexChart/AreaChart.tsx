'use client' // don't forget this part if you use app dir to mark the whole
             // file as client-side components

import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export type AreaChartProps = {
  series,
};
export default function AreaChart({ series }: AreaChartProps) {
  const options = {
    xaxis: {
      type: 'datetime',
    },
    tooltip: {
      enable: false,
    }
  };
  return (
    <>
      <Chart type="area" series={series} options={options} height={350} />
    </>
  )
}