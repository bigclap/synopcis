'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell, Burger, Group, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Link href="/" passHref>
            SSG Frontend
          </Link>
          <Link href="/phenomena/create" passHref>
            <Button>+ New Phenomenon</Button>
          </Link>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        Navbar
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default Layout;
