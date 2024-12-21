"use client"

import Container from '@/components/Container'
import { useAuthGuard } from '@/lib/auth/use-auth'
import { Button } from '@mantine/core'
import Link from 'next/link'
import React, { useEffect } from 'react'

export default function page() {
  const { user, mutate } = useAuthGuard({middleware: 'auth'})

  useEffect(() => {
    console.log('Page init', user)
  }, [])

  return (
    <Container size='md'>

      <h1 className='text-2xl font-semibold'>Switch Success</h1>
      <p className='text-lg'>You are now logged in as: {user?.email}</p>

      <div className='mt-4 flex gap-2'>
        {
          user?.authorities.includes('ROLE_PREVIOUS_ADMINISTRATOR') && (
            <a href={"/api/auth/impersonate/exit"}>
              <Button>Exit switch</Button>
            </a>
          )
        }

        <Link href='/'>
          <Button variant='default'>
            Go to home
          </Button>
        </Link>
      </div>
    </Container>
  )
}