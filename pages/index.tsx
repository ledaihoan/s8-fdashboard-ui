import {
  Button,
  Container,
  Flex,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title
} from "@mantine/core";
import {CryptoData, CryptoFeaturedData, SpotPrice, TradingPair} from "../types";
import {useEffect, useState} from "react";
import _ from "lodash";
import {IconArrowDown, IconArrowUp, IconMinus} from "@tabler/icons-react";
import Link from "next/link";
import {useGetCryptoPriceQueries} from "../http/coinbase";
import {
  CURRENCY_PRECISION,
  FEATURED_FIAT_CURRENCY,
  FEATURED_FIAT_CURRENCY_SYMBOL,
  NUMBER_OF_FEATURED_CRYPTO_CURRENCIES
} from "../constants";
export default function IndexPage() {
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
      name: cryptoItem.name,
      symbol: cryptoItem.code,
      value: `${FEATURED_FIAT_CURRENCY_SYMBOL}${currentPrice.toFixed(CURRENCY_PRECISION)}`,
      change: _.round(100 * diffPrice / previousPrice, CURRENCY_PRECISION),
      tradeAble: !!tradeAbleEntry,
      icon: 'https://dynamic-assets.coinbase.com/e785e0181f1a23a30d9476038d9be91e9f6c63959b538eabbc51a1abc8898940383291eede695c3b8dfaa1829a9b57f5a2d0a16b0523580346c6b8fab67af14b/asset_icons/b57ac673f06a4b0338a596817eb0a50ce16e2059f327dc117744449a47915cb2.png'
    };
    cryptoFeaturedDataList.push(featuredData);
  }
  cryptoFeaturedDataList = _.sortBy(cryptoFeaturedDataList, 'sort_index');
  const topFeaturedDataList: CryptoFeaturedData[] = cryptoFeaturedDataList.filter(item => item.tradeAble).slice(0, NUMBER_OF_FEATURED_CRYPTO_CURRENCIES);


  return (
    <Container size="xl">
      <Flex align="flex-start" mt={50} direction={{ base: 'column', md: 'row' }}>
        <Stack gap="xs" style={{ flex: 1 }}>
          <Title order={2} style={{ color: '#4c6ef5' }}>
            Explore crypto like Bitcoin, Ethereum, and Dogecoin
          </Title>
          <Text size="lg">
            Simply and securely buy, sell, and manage hundreds of cryptocurrencies.
          </Text>
          <Button variant="filled" color="blue" style={{ alignSelf: 'flex-start', marginTop: 20 }}>
            See more assets
          </Button>
        </Stack>

        <Stack gap="xs" style={{ flex: 1 }} mt={{ base: 20, md: 0 }}>
          <Group gap="xs">
            <Text size="sm" fw={700} px={10} py={5} style={{ border: '1px solid #e9ecef', borderRadius: 16 }}>
              Tradable
            </Text>
            <Text size="sm" fw={700}>Top gainers</Text>
          </Group>

          <SimpleGrid cols={3} spacing="md">
            {topFeaturedDataList.map((coin) => (
              <Link key={coin.symbol} href={`/price/${coin.symbol}`} passHref legacyBehavior>
                <Paper key={coin.symbol} p="md" radius="md" withBorder>
                  <Group mb="xs">
                    <Text fw={700}>{coin.name}</Text>
                    <Text size="xs" c="dimmed">{coin.symbol}</Text>
                  </Group>
                  <Text size="sm">{coin.value}</Text>
                  <Group gap={5} mt={5}>
                    {coin.change > 0 ? (
                      <IconArrowUp size={14} style={{ color: 'green' }} />
                    ) : coin.change < 0 ? (
                      <IconArrowDown size={14} style={{ color: 'red' }} />
                    ) : (
                      <IconMinus size={14} style={{ color: 'gray' }} />
                    )}
                    <Text size="sm" c={coin.change > 0 ? 'green' : coin.change < 0 ? 'red' : 'gray'}>
                      {Math.abs(coin.change)}%
                    </Text>
                  </Group>
                </Paper>
              </Link>
            ))}
          </SimpleGrid>
        </Stack>
      </Flex>
    </Container>
  );
}
