import {useCallback, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Box, Code, Container, Group, Loader, Text} from "@mantine/core";
import io, {Socket} from 'socket.io-client';

export default function PriceWsPage () {
  const [isLoading, setIsLoading] = useState(true);

  const [socket, setSocket] = useState<Socket | null>(null);

  const [currentData, setCurrentData] = useState<any>(null);
  const router = useRouter();
  const cryptoCode = router.query.symbol as string;

  // Create a memoized subscribe function
  const subscribeProductPrice = (socket: Socket) => {
    if (socket && socket.connected) {
      const subscriptionData = {
        productIds: [`${cryptoCode.toUpperCase()}-USD`]
      };
      console.log('subscribing', JSON.stringify(subscriptionData))
      socket.emit('subscribe', JSON.stringify(subscriptionData));
    } else {
      console.warn('Socket is not connected. Unable to subscribe.');
    }
  };

  // Create a memoized unsubscribe function
  const unsubscribeProductPrice = () => {
    if (socket != null) {
      const subscriptionData = {
        productIds: [`${cryptoCode.toUpperCase()}-USD`]
      };
      socket.emit('unsubscribe', JSON.stringify(subscriptionData));
    }
  };


  useEffect(() => {

    setIsLoading(!cryptoCode);
    if (!!cryptoCode) {
      const ws = io('https://s8-ws-server.technoma.tech/socket.io', {
        transports: ['websocket'],
        upgrade: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        forceNew: true
      });
      ws.on('connect', ()=>{
        console.log('connected to ws');
        subscribeProductPrice(ws);
      });

      ws.on('update', (event) => {
        setCurrentData(JSON.stringify(event));
      });

      ws.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });

      setSocket(ws);
    }

    return () => {
      if (socket) {
        unsubscribeProductPrice();
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [cryptoCode]);

  if (isLoading) {
    return (
      <Container>
        <Loader />
        <Text>Loading data...</Text>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Group mb="xl">
        <Group>
          <Text size="xl" fw={700}>{ cryptoCode }</Text>
        </Group>
        <Group>
          <Box>
            <Code>{ currentData }</Code>
          </Box>
        </Group>
      </Group>
    </Container>
  )
}