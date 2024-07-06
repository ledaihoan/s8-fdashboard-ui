export * from './trading-pair';
export * from './crypto-data';
export * from './spot-price';

export type CryptoFeaturedData = {
  name: string;
  symbol: string;
  value: string;
  change: number;
};