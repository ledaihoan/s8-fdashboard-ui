import {CryptoProductData} from "./crypto-product-data";
import {CryptoMarketData} from "./crypto-market-data";

export * from './trading-pair';
export * from './crypto-product-data';
export * from './spot-price';
export * from './candle-data';

export type CryptoFeaturedProductData = CryptoProductData & Omit<CryptoMarketData, 'rank' | 'changePercent24Hr'> & {
  icon: string;
  tradeAble: boolean;
  rank: number;
  changePercent24Hr: number;
};

// Old deprecated, presented in page home.tsx
export type CryptoFeaturedData = {
  id: number;
  name: string;
  symbol: string;
  value: string;
  change: number;
  tradeAble: boolean;
  marketCap?: string;
  volume?: string;
  supply?: string;
  icon: string;
};

export type GranularityData = {
  label: string;
  granularity: number;
  batchSize: number;
};