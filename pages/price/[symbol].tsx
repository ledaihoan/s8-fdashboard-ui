import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import {
  Accordion,
  ActionIcon,
  Badge,
  Button,
  Container,
  Grid,
  Group,
  Loader,
  Paper,
  Select,
  Text,
  Title
} from "@mantine/core";

import {IconChevronRight, IconDownload, IconStar} from "@tabler/icons-react";

import {useGetCryptoCandles} from "../../http/coinbase";
import {MAIN_CURRENCY} from "../../constants";
import {CANDLES_GRANULARITY} from "../../constants/candles";
import {getDefaultTimeRange} from "../../utils/timestamp-utils";
import {CryptoProductData, SpotPrice, TradingPair} from "../../types";
import {CryptoMarketData} from "../../types/crypto-market-data";
import {formatCandleData} from "../../utils/candle-data-utils";
import AreaChart from "../../components/ApexChart/AreaChart";


export default function PricePage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const cryptoCode = router.query.symbol as string;
  const [currency, setCurrency] = useState(MAIN_CURRENCY);
  const [granularity, setGranularity] = useState(CANDLES_GRANULARITY.ONE_DAY);
  const { defaultStart, defaultEnd } = getDefaultTimeRange(CANDLES_GRANULARITY.ONE_DAY);
  const [startTs, setStartTs] = useState(defaultStart);
  const [endTs, setEndTs] = useState(defaultEnd);
  const results = useGetCryptoCandles(cryptoCode, currency, granularity, startTs, endTs);
  const [
    cryptoListData,
    cryptoListMarketData,
    cryptoCandleData,
  ] = results;
  useEffect(() => {
    const allLoaded = results.every(result => !result.isLoading);
    setIsLoading(!allLoaded);
  }, [results]);
  if (!cryptoCode || isLoading) {
    return (
      <Container>
        <Loader />
        <Text>Loading data...</Text>
      </Container>
    );
  }
  if (cryptoListData.isError || cryptoListMarketData.isError || cryptoCandleData.isError) {
    return <Text>An error occurred while fetching data.</Text>;
  }

  const cryptoList = [...(cryptoListData.data.data as CryptoProductData[])];
  const cryptoMarketDataList = [...(cryptoListMarketData.data.data as CryptoMarketData[])];
  const cryptoCandleList = [...(cryptoCandleData.data as number[][])];
  const cryptoCandles = formatCandleData(cryptoCandleList);
  const cryptoCandleSeries = [
    { name: 'Open', data: cryptoCandles.map(candle => [candle.timestamp * 1000, candle.open]) },
    { name: 'Close', data: cryptoCandles.map(candle => [candle.timestamp * 1000, candle.close]) },
    { name: 'Low', data: cryptoCandles.map(candle => [candle.timestamp * 1000, candle.low]) },
    { name: 'High', data: cryptoCandles.map(candle => [candle.timestamp * 1000, candle.high]) },
  ];
  return (
    <Container size="xl">
      <Group mb="xl">
        <Group>
          <Text size="xl" fw={700}>₿ BitcoinBTC</Text>
        </Group>
        <Group>
          <ActionIcon variant="default"><IconStar size={18} /></ActionIcon>
          <ActionIcon variant="default"><IconDownload size={18} /></ActionIcon>
          <Select
            placeholder="USD"
            data={[
              { value: 'USD', label: 'USD' },
              { value: 'EUR', label: 'EUR' },
              { value: 'GBP', label: 'GBP' },
            ]}
            styles={{ root: { width: 80 } }}
          />
        </Group>
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper p="md" withBorder>
            <Text size="sm" c="dimmed">BTC Price</Text>
            <Title order={2}>₫1,463,683,135.89</Title>
            <Text c="green">₫29,120,682.78 (2.03%)</Text>
            <Group mt="md" gap="xs">
              {['1H', '1D', '1W', '1M', '1Y', 'ALL'].map((period) => (
                <Button key={period} variant="default" size="xs">{period}</Button>
              ))}
            </Group>
            {/* Placeholder for chart */}
            <Paper h={400} mt="md" bg="gray.1">
              <div>
                <AreaChart series={cryptoCandleSeries} height={350} />
              </div>
            </Paper>
            <Text size="xs" mt="sm" c="dimmed">Last updated: 4:20 PM, Jul 7, 2024</Text>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper p="md" withBorder>
            <Group align="flex-start">
              <div>
                <Title order={4}>Trade Bitcoin today</Title>
                <Text size="sm" c="dimmed">Create a Coinbase account to buy and sell Bitcoin on the most secure crypto exchange.</Text>
              </div>
              <img src="/images/products/btc.svg" alt="Bitcoin trade" width={80} height={80} />
            </Group>
            <Button fullWidth rightSection={<IconChevronRight size={14} />} mt="md">
              Buy Bitcoin
            </Button>
          </Paper>
        </Grid.Col>
      </Grid>

      <Accordion mt="xl">
        <Accordion.Item value="about">
          <Accordion.Control>
            <Title order={3}>About Bitcoin</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Text>The world&apos;s first cryptocurrency, Bitcoin is stored and exchanged securely on the internet through a digital ledger known as a blockchain. Bitcoins are divisible into smaller units known as satoshis — each satoshi is worth 0.00000001 bitcoin.</Text>
            <Title order={4} mt="md">Resources</Title>
            <Group mt="xs">
              <Badge variant="outline">Whitepaper</Badge>
              <Badge variant="outline">Official website</Badge>
            </Group>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};