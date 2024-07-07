import {useEffect, useState} from "react";
import {useGetCryptoPriceQueries} from "../http/coinbase";
import {CURRENCY_PRECISION, FEATURED_FIAT_CURRENCY, FEATURED_FIAT_CURRENCY_SYMBOL} from "../constants";
import {Container, Loader, Text} from "@mantine/core";
import {CryptoData, CryptoFeaturedData, SpotPrice, TradingPair} from "../types";
import _ from "lodash";
import CryptoTable from "../components/CryptoTable/CryptoTable";

export default function ExplorePage() {
  const [isLoading, setIsLoading] = useState(true);
  const results = useGetCryptoPriceQueries(FEATURED_FIAT_CURRENCY);
  useEffect(() => {
    const allLoaded = results.every(result => !result.isLoading);
    setIsLoading(!allLoaded);
  }, [results]);

  if (isLoading) {
    return (
      <Container>
        <Loader />
        <Text>Loading data...</Text>
      </Container>
    );
  }

  const [cryptoListData, todaySpotPriceData, yesterdaySpotPriceData, tradePairListData] = results;

  if (cryptoListData.isError || todaySpotPriceData.isError || yesterdaySpotPriceData.isError || tradePairListData.isError) {
    return <Text>An error occurred while fetching data.</Text>;
  }
  const cryptoList = [...(cryptoListData.data.data as CryptoData[])];
  const todaySpotPriceList = [...(todaySpotPriceData.data.data as SpotPrice[])];
  const yesterdaySpotPriceList = [...(yesterdaySpotPriceData.data.data as SpotPrice[])];
  const tradePairList = [...(tradePairListData.data as TradingPair[])];
  let cryptoFeaturedDataList: CryptoFeaturedData[] = [];
  for (const cryptoItem of cryptoList) {
    const currentPriceEntry = _.find(todaySpotPriceList, ['base', cryptoItem.code]);
    const previousPriceEntry = _.find(yesterdaySpotPriceList, ['base', cryptoItem.code]);
    const tradeAbleEntry = _.find(tradePairList, (tradeEntry) => {
      return !tradeEntry.trading_disabled && tradeEntry.id.includes(cryptoItem.code);
    });
    const currentPrice = parseFloat(currentPriceEntry?.amount as string);
    const previousPrice = parseFloat(previousPriceEntry?.amount as string);
    const diffPrice = currentPrice - previousPrice;
    const featuredData: CryptoFeaturedData = {
      id: cryptoFeaturedDataList.length + 1,
      name: cryptoItem.name,
      symbol: cryptoItem.code,
      value: `${FEATURED_FIAT_CURRENCY_SYMBOL}${currentPrice.toFixed(CURRENCY_PRECISION)}`,
      change: _.round(100 * diffPrice / previousPrice, CURRENCY_PRECISION),
      tradeAble: !!tradeAbleEntry,
      icon: `/images/products/${cryptoItem.code.toLowerCase()}.svg`,
    };
    cryptoFeaturedDataList.push(featuredData);
  }
  cryptoFeaturedDataList = _.sortBy(cryptoFeaturedDataList, 'sort_index');
  return (
    <Container size="xl">
      <CryptoTable data={cryptoFeaturedDataList} />
    </Container>
  )
}