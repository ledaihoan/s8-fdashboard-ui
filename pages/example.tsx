// PricePage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import S8ApexChart from '../components/ApexChart/S8ApexChart';
import { ApexOptions } from 'apexcharts';

interface PriceData {
  timestamp: number;
  price: number;
}

const PricePage: React.FC = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [granularity, setGranularity] = useState<'minutes' | 'hours' | 'days'>('hours');
  const [currency, setCurrency] = useState<string>('USD');

  const fetchPriceData = useCallback(async () => {
    // Replace this with your actual API call
    const response = await fetch(`/api/price-data?granularity=${granularity}&currency=${currency}`);
    const data = await response.json();
    setPriceData(data);
  }, [granularity, currency]);

  useEffect(() => {
    fetchPriceData();
  }, [fetchPriceData]);

  const chartOptions: ApexOptions = {
    chart: {
      id: 'area-datetime',
      type: 'area',
      height: 350,
      zoom: {
        autoScaleYaxis: true
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
    },
    xaxis: {
      type: 'datetime',
      tickAmount: 6,
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy'
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100]
      }
    },
  };

  const series = [{
    name: `Price (${currency})`,
    data: priceData.map(d => [d.timestamp, d.price])
  }];

  const handleGranularityChange = (newGranularity: 'minutes' | 'hours' | 'days') => {
    setGranularity(newGranularity);
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
  };

  return (
    <div>
      <h1>Price Chart</h1>
      <div>
        <button onClick={() => handleGranularityChange('minutes')}>Minutes</button>
        <button onClick={() => handleGranularityChange('hours')}>Hours</button>
        <button onClick={() => handleGranularityChange('days')}>Days</button>
      </div>
      <div>
        <button onClick={() => handleCurrencyChange('USD')}>USD</button>
        <button onClick={() => handleCurrencyChange('EUR')}>EUR</button>
        <button onClick={() => handleCurrencyChange('GBP')}>GBP</button>
      </div>
      <S8ApexChart
        series={series}
        options={chartOptions}
      />
    </div>
  );
};

export default PricePage;