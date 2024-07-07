import {CryptoFeaturedProductData, CryptoProductData, SpotPrice, TradingPair} from "../types";
import {CryptoMarketData} from "../types/crypto-market-data";
import _ from "lodash";
import {CURRENCY_PRECISION} from "../constants";

export const calculateFeaturedCrypto = function (
  cryptoProducts: CryptoProductData[],
  tradingProducts: TradingPair[],
  todaySpotPrices: SpotPrice[],
  previousSpotPrices: SpotPrice[],
  cryptoMarketDataList: CryptoMarketData[]
): CryptoFeaturedProductData[] {
  let rs: CryptoFeaturedProductData[] = [];

  for (const cryptoItem of cryptoProducts) {
    const cryptoMarketDataEntry = _.find(cryptoMarketDataList, ['symbol', cryptoItem.code]);
    const todayPriceEntry = _.find(todaySpotPrices, ['base', cryptoItem.code]);
    const previousPriceEntry = _.find(previousSpotPrices, ['base', cryptoItem.code]);
    const tradeAbleEntry = _.find(tradingProducts, (tradeEntry) => {
      return !tradeEntry.trading_disabled && tradeEntry.id.includes(cryptoItem.code);
    });
    if (cryptoMarketDataEntry && todayPriceEntry && previousPriceEntry) {
      const todayPrice = parseFloat(todayPriceEntry.amount);
      const previousPrice = parseFloat(previousPriceEntry.amount);
      const change = todayPrice - previousPrice;
      const changePercentage = _.round(100 * change / previousPrice, CURRENCY_PRECISION);
      const featuredData: CryptoFeaturedProductData = {
        ...cryptoItem,
        ...(_.omit(cryptoMarketDataEntry, ['priceUsd'])),
        icon: `/images/products/${cryptoItem.code.toLowerCase()}.svg`,
        tradeAble: !!tradeAbleEntry,
        priceUsd: todayPrice.toFixed(CURRENCY_PRECISION),
        rank: +cryptoMarketDataEntry.rank,
        changePercent24Hr: changePercentage,
      };
      rs.push(featuredData);
    }
  }

  rs = _.sortBy(rs, 'rank');
  return rs;
}