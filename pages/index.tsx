import {
  Button,
  Container,
  Flex,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  Title
} from "@mantine/core";
import {useEffect, useState} from "react";
import _ from "lodash";
import Link from "next/link";

import {CryptoProductData, TradingPair, CryptoFeaturedProductData, SpotPrice} from "../types";
import {useGetBaseCryptoMarketData} from "../http/coinbase";
import {
  MAIN_CURRENCY,
  FEATURED_FIAT_CURRENCY_SYMBOL,
  NUMBER_OF_FEATURED_CRYPTO_CURRENCIES
} from "../constants";
import classes from './index.module.css';
import {CryptoMarketData} from "../types/crypto-market-data";
import FeaturedCryptoCard from "../components/FeaturedCryptoCard/FeaturedCryptoCard";
import {calculateFeaturedCrypto} from "../utils/featured-crypto";

export default function IndexPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeFeaturedWidget, setActiveFeaturedWidget] = useState('trade');
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

  const topFeaturedDataList: CryptoFeaturedProductData[] = _.filter(
    cryptoFeaturedDataList,
    item => item.tradeAble
  ).slice(0, NUMBER_OF_FEATURED_CRYPTO_CURRENCIES);

  const topGainerDataList: CryptoFeaturedProductData[] = _.orderBy(
    cryptoFeaturedDataList,
    'changePercent24Hr',
    'desc'
  ).slice(0, NUMBER_OF_FEATURED_CRYPTO_CURRENCIES);

  const topFeaturedWidgets = topFeaturedDataList.map((coin) => (
    <FeaturedCryptoCard key={'featured' + coin.symbol} coin={coin} fiatCurrency={FEATURED_FIAT_CURRENCY_SYMBOL} />
  ));

  const topGainerWidgets = topGainerDataList.map((coin) => (
    <FeaturedCryptoCard key={'gainer' + coin.symbol} coin={coin} fiatCurrency={FEATURED_FIAT_CURRENCY_SYMBOL} />
  ));

  return (
    <Container size="xl">
      <Flex align="flex-start" mt={50} direction={{ base: 'column', md: 'row' }}>
        <Stack gap="xs" style={{ flex: 1 }}>
          <Title order={2} style={{ color: '#1A55FF' }}>
            Explore crypto like Bitcoin, Ethereum, and Dogecoin
          </Title>
          <Text size="lg">
            Simply and securely buy, sell, and manage hundreds of cryptocurrencies.
          </Text>
          <Link href={'/explore'} passHref legacyBehavior>
            <Button variant="filled" color="#1A55FF" style={{ alignSelf: 'flex-start', marginTop: 20 }}>
              See more assets
            </Button>
          </Link>
        </Stack>

        <Stack gap="xs" style={{ flex: 1 }} mt={{ base: 20, md: 0 }}>
          <Group gap="xs">
            <Text
              onClick={() => setActiveFeaturedWidget('trade')}
              size="sm" fw={700} px={10} py={5}
              className={activeFeaturedWidget === 'trade' ? classes.activeLabel : ''}
            >
              Tradable
            </Text>
            <Text
              onClick={() => setActiveFeaturedWidget('gainer')}
              size="sm" fw={700}
              className={activeFeaturedWidget === 'gainer' ? classes.activeLabel : ''}
            >Top gainers</Text>
          </Group>

          <SimpleGrid cols={3} spacing="md">
            {activeFeaturedWidget == 'trade' && topFeaturedWidgets }
            {activeFeaturedWidget == 'gainer' && topGainerWidgets }
          </SimpleGrid>
        </Stack>
      </Flex>
    </Container>
  );
}
