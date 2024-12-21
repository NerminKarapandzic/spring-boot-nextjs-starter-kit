"use client"

import Logo from '@/components/Logo';
import Navbar from '@/components/Navbar';
import { AppShell, Burger, Button, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import React from 'react'

export default function layout({children}: {children: React.ReactNode}) {
  const [opened, { toggle}] = useDisclosure(false);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" className='w-full max-w-screen-xl mx-auto'>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Navbar className='w-full'/>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <Navbar className='w-full' orientation="vertical"/>
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  )
}
