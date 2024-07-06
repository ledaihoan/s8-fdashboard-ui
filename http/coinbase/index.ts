import {useQueries, useQuery} from '@tanstack/react-query';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc)
dayjs.extend(timezone)

export const QUERY_KEY_WRAPPER = {
  GET_ALL_CRYPTO_CURRENCIES: () => ['coinbase', 'getAllCryptoCurrencies'],
  GET_SPOT_PRICES: (fiatCurrency: string, date: string) => ['coinbase', `getSpotPrices_${fiatCurrency}_${date}`],
};

export const QUERY_FN_WRAPPERS = {
  GET_ALL_CRYPTO_CURRENCIES: function () {
    return async () => {
      const response = await fetch('https://api.coinbase.com/v2/currencies/crypto');
      return response.json();
    }
  },
  GET_SPOT_PRICES: function (fiatCurrency: string, date: string) {
    return async () => {
      const response = await fetch(`https://api.coinbase.com/v2/prices/${fiatCurrency.toLowerCase()}/spot?date=${date}`);
      return response.json();
    }
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
      }
    ]
  });
};