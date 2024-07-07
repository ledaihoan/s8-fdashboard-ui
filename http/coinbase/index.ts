import {useQueries} from '@tanstack/react-query';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {CANDLE_BATCH_SIZES} from "../../constants";
import {QueriesOptions} from "@tanstack/react-query/build/legacy/useQueries";

dayjs.extend(utc)
dayjs.extend(timezone)

export const QUERY_KEY_WRAPPER = {
  GET_ALL_CRYPTO_CURRENCIES: () => ['coinbase', 'getAllCryptoCurrencies'],
  GET_SPOT_PRICES: (fiatCurrency: string, date: string) => ['coinbase', `getSpotPrices_${fiatCurrency}_${date}`],
  GET_ALL_TRADE_PAIRS: () => ['coinbase', 'getAllTradePairs'],
  GET_EXTERNAL_MARKET_DATA: () => ['external', 'getMarket'],
  GET_PRODUCT_CANDLES: (productId: string, granularity: number, start?: number, end?: number) => {
    const currentTimestamp = dayjs().unix();
    const defaultEnd = currentTimestamp - currentTimestamp % granularity;
    const defaultStart = defaultEnd - CANDLE_BATCH_SIZES * granularity;
    const startKey = start || defaultStart;
    const endKey = end || defaultEnd;
    return ['coinbase', `product_candle_${productId}_${granularity}_${startKey}_${endKey}`];
  }
};

export const QUERY_FN_WRAPPERS = {
  GET_ALL_CRYPTO_CURRENCIES: function () {
    return async () => {
      const response = await fetch('https://api.coinbase.com/v2/currencies/crypto');
      return response.json();
    };
  },
  GET_SPOT_PRICES: function (fiatCurrency: string, date: string) {
    return async () => {
      const response = await fetch(`https://api.coinbase.com/v2/prices/${fiatCurrency.toLowerCase()}/spot?date=${date}`);
      return response.json();
    };
  },
  GET_ALL_TRADE_PAIRS: function () {
    return async () => {
      const response = await fetch('https://api.pro.coinbase.com/products');
      return response.json();
    };
  },
  GET_EXTERNAL_MARKET_DATA: function () {
    return async () => {
      const response = await fetch('https://api.coincap.io/v2/assets');
      return response.json();
    };
  },
  GET_PRODUCT_CANDLES: function (productId: string, granularity: number, start?: number, end?: number) {
    const currentTimestamp = dayjs().unix();
    const defaultEnd = currentTimestamp - currentTimestamp % granularity;
    const defaultStart = defaultEnd - CANDLE_BATCH_SIZES * granularity;
    const startKey = start || defaultStart;
    const endKey = end || defaultEnd;
    return async () => {
      const response = await fetch(`https://api.pro.coinbase.com/products/${productId}/candles?start=${startKey}&end=${endKey}&granularity=${granularity}`);
      return response.json();
    };
  }
};

export const useGetCryptoPriceQueries = (fiatCurrency: string) => {
  const today = dayjs.utc().format('YYYY-MM-DD');
  const yesterday = dayjs.utc().subtract(1, 'day').format('YYYY-MM-DD');
  return useQueries({
    queries: [
      {
        queryKey: QUERY_KEY_WRAPPER.GET_ALL_CRYPTO_CURRENCIES(),
        queryFn: QUERY_FN_WRAPPERS.GET_ALL_CRYPTO_CURRENCIES(),
      },
      {
        queryKey: QUERY_KEY_WRAPPER.GET_SPOT_PRICES(fiatCurrency, today),
        queryFn: QUERY_FN_WRAPPERS.GET_SPOT_PRICES(fiatCurrency, today),
      },
      {
        queryKey: QUERY_KEY_WRAPPER.GET_SPOT_PRICES(fiatCurrency, yesterday),
        queryFn: QUERY_FN_WRAPPERS.GET_SPOT_PRICES(fiatCurrency, yesterday),
      },
      {
        queryKey: QUERY_KEY_WRAPPER.GET_ALL_TRADE_PAIRS(),
        queryFn: QUERY_FN_WRAPPERS.GET_ALL_TRADE_PAIRS()
      }
    ]
  });
};

// Get Market data (External - currently CoinCap API) with USD as the currency
export const useGetBaseCryptoMarketData = (fiatCurrency: string) => {
  const today = dayjs.utc().format('YYYY-MM-DD');
  const yesterday = dayjs.utc().subtract(1, 'day').format('YYYY-MM-DD');
  return useQueries({
    queries: [
      {
        queryKey: QUERY_KEY_WRAPPER.GET_ALL_CRYPTO_CURRENCIES(),
        queryFn: QUERY_FN_WRAPPERS.GET_ALL_CRYPTO_CURRENCIES(),
      },
      {
        queryKey: QUERY_KEY_WRAPPER.GET_ALL_TRADE_PAIRS(),
        queryFn: QUERY_FN_WRAPPERS.GET_ALL_TRADE_PAIRS()
      },
      {
        queryKey: QUERY_KEY_WRAPPER.GET_EXTERNAL_MARKET_DATA(),
        queryFn: QUERY_FN_WRAPPERS.GET_EXTERNAL_MARKET_DATA()
      },
      {
        queryKey: QUERY_KEY_WRAPPER.GET_SPOT_PRICES(fiatCurrency, today),
        queryFn: QUERY_FN_WRAPPERS.GET_SPOT_PRICES(fiatCurrency, today),
      },
      {
        queryKey: QUERY_KEY_WRAPPER.GET_SPOT_PRICES(fiatCurrency, yesterday),
        queryFn: QUERY_FN_WRAPPERS.GET_SPOT_PRICES(fiatCurrency, yesterday),
      },
    ],
  });
};

export const useGetCryptoCandles = (cryptoCode: string, fiatCurrency: string, granularity: number, startTs?: number, endTs?: number) => {
  const productId = cryptoCode? `${cryptoCode.toUpperCase()}-${fiatCurrency.toUpperCase()}` : null;
  const queries = productId ? [
    {
      queryKey: QUERY_KEY_WRAPPER.GET_ALL_CRYPTO_CURRENCIES(),
      queryFn: QUERY_FN_WRAPPERS.GET_ALL_CRYPTO_CURRENCIES(),
    },
    {
      queryKey: QUERY_KEY_WRAPPER.GET_EXTERNAL_MARKET_DATA(),
      queryFn: QUERY_FN_WRAPPERS.GET_EXTERNAL_MARKET_DATA()
    },
    {
      queryKey: QUERY_KEY_WRAPPER.GET_PRODUCT_CANDLES(productId, granularity, startTs, endTs),
      queryFn: QUERY_FN_WRAPPERS.GET_PRODUCT_CANDLES(productId, granularity, startTs, endTs),
    }
  ] : [];
  return useQueries({
    queries,
  });
}