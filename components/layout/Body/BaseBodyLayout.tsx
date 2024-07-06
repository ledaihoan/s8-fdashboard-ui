import {Anchor, AppShell, Burger, Group, Text, UnstyledButton} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './BaseBodyLayout.module.css';

export type AppMenu = {href: string; name: string};
export default function BaseBodyLayout({ Component, pageProps }: any) {
  const [opened, { toggle }] = useDisclosure();
  const appMenus: AppMenu[] = [
    { href: '/', name: 'Home' },
    { href: '/explore', name: 'Explore' },
    { href: '#', name: 'Learn' },
    { href: '#', name: 'Individuals' },
    { href: '#', name: 'Businesses' },
    { href: '#', name: 'Developers' },
  ];

  const menuElements =  appMenus.map(menu => (
      <UnstyledButton key={menu.name} className={classes.control}>
        <Anchor c="black" inherit={true} href={menu.href}>{menu.name}</Anchor>
      </UnstyledButton>
    ));
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <Text size="lg" fw={700}>Silver8</Text>
            <Group ml="xl" gap={0} visibleFrom="sm">
              { menuElements }
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        { menuElements }
      </AppShell.Navbar>

      <AppShell.Main><Component {...pageProps} /></AppShell.Main>
    </AppShell>
  );
};