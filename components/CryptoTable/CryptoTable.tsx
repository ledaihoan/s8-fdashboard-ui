import { Table, Text, Group, Image, Button, ScrollArea } from '@mantine/core';

import classes from './CryptoTable.module.css';
import {useState} from "react";
import {CryptoFeaturedData} from "../../types";

export default function CryptoTable({ data }: { data: CryptoFeaturedData[]}) {
  const [scrolled, setScrolled] = useState(false);

  const rows = data.map((item) => (
    <tr key={item.name}>
      <td>
        <Group gap="sm">
          <Image src={item.icon} width={24} height={24} />
          <Text size="sm" fw={500}>
            {item.name}
          </Text>
          <Text size="xs" c="dimmed">
            {item.symbol}
          </Text>
        </Group>
      </td>
      <td>{item.value}</td>
      <td>
        <Text c={item.change < 0 ? 'red' : 'green'}>
          {item.change} {'%'}
        </Text>
      </td>
      <td>{item.marketCap}</td>
      <td>{item.volume}</td>
      <td>{item.supply}</td>
      <td>
        {item.tradeAble && (<Button variant="light" size="xs">
          Trade
        </Button>)}
      </td>
    </tr>
  ));

  return (
    // <ScrollArea h={1000} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table striped="odd" stripedColor="indigo.3" cellSpacing="5" withTableBorder={true} withColumnBorders={true} withRowBorders={true}>
        <thead className={`${classes.header} ${scrolled ? classes.scrolled : ''}`}>
        <tr>
          <th className={classes.th}>Name</th>
          <th className={classes.th}>Price</th>
          <th className={classes.th}>Change</th>
          <th className={classes.th}>Market Cap</th>
          <th className={classes.th}>Volume (24h)</th>
          <th className={classes.th}>Supply</th>
          <th className={classes.th}>Trade</th>
        </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    // </ScrollArea>
  );
}