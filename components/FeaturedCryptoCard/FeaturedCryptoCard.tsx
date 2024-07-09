import { Group, Paper, Text } from "@mantine/core";
import { IconArrowDown, IconArrowUp, IconMinus } from "@tabler/icons-react";

import { CryptoFeaturedProductData } from "../../types";
import {CURRENCY_PRECISION} from "../../constants";
import Link from "next/link";

export type FeaturedCryptoCardProps = { coin: CryptoFeaturedProductData, fiatCurrency: string }

export default function FeaturedCryptoCard({ coin }: FeaturedCryptoCardProps): JSX.Element {
  const { changePercent24Hr: changePercentage } = coin;
  const localizedPriceDisplay = `$${parseFloat(coin.priceUsd).toFixed(CURRENCY_PRECISION)}`;
  const changePriceColor = changePercentage > 0 ? 'green' : changePercentage === 0 ? 'gray' : 'red';
  return (
    <Link key={coin.symbol} href={`/price/${coin.symbol}`} passHref legacyBehavior>
      <Paper p="md" radius="md" withBorder>
        <Group mb="xs">
          <Text fw={700}>{coin.name}</Text>
          <Text size="xs" c={coin.color}>{coin.code}</Text>
        </Group>
        <Text size="sm">{localizedPriceDisplay}</Text>
        <Group gap={5} mt={5}>
          { changePercentage > 0? (
            <IconArrowUp size={14} style={{ color: 'green' }} />
          ) : changePercentage === 0 ? (
            <IconMinus size={14} style={{ color: 'gray' }} />
          ) : (
            <IconArrowDown size={14} style={{ color: 'red' }} />
          )}
          <Text size="sm" c={ changePriceColor }>
            {Math.abs(changePercentage).toFixed(CURRENCY_PRECISION)}%
          </Text>
        </Group>
      </Paper>
    </Link>
  );
};