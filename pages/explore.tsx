import { useEffect, useState } from "react";
import { Container, Loader, Text } from "@mantine/core";

import { useGetBaseCryptoMarketData } from "../http/coinbase";
import { MAIN_CURRENCY } from "../constants";
import { CryptoProductData, SpotPrice, TradingPair, CryptoFeaturedProductData } from "../types";
import CryptoTable from "../components/CryptoTable/CryptoTable";
import {CryptoMarketData} from "../types/crypto-market-data";
import {calculateFeaturedCrypto} from "../utils/featured-crypto";

export default function ExplorePage() {
  const [isLoading, setIsLoading] = useState(true);
  const results = useGetBaseCryptoMarketData(MAIN_CURRENCY);
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

  const [
    cryptoListData,
    tradePairListData,
    cryptoListMarketData,
    coinbaseTodaySpotPrice,
    coinbasePreviousSpotPrice,
  ] = results;

  if (cryptoListData.isError || tradePairListData.isError || cryptoListMarketData.isError || coinbaseTodaySpotPrice.isError || coinbasePreviousSpotPrice.isError) {
    return <Text>An error occurred while fetching data.</Text>;
  }
  const cryptoList = [...(cryptoListData.data.data as CryptoProductData[])];
  const tradePairList = [...(tradePairListData.data as TradingPair[])];
  const cryptoMarketDataList = [...(cryptoListMarketData.data.data as CryptoMarketData[])];
  const todaySpotPriceList = [...(coinbaseTodaySpotPrice.data.data as SpotPrice[])];
  const previousSpotPriceList = [...(coinbasePreviousSpotPrice.data.data as SpotPrice[])];
  const cryptoFeaturedDataList: CryptoFeaturedProductData[] = calculateFeaturedCrypto(
    cryptoList,
    tradePairList,
    todaySpotPriceList,
    previousSpotPriceList,
    cryptoMarketDataList
  );
  return (
    <Container size="xl">
      <CryptoTable data={cryptoFeaturedDataList} />
    </Container>
  )
}