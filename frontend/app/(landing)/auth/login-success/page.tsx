"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'
import { IoShieldCheckmark } from "react-icons/io5";

export default function page() {
  const [counter, setCounter] = React.useState(3)
  const router = useRouter()

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev - 1)
      if (counter === 1) {
        router.push('/profile')
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [counter])

  return (
    <div className='flex h-screen w-full justify-center items-center flex-col gap-8 mt-4 md:mt-0'>
      <IoShieldCheckmark className='text-9xl text-primary' />
      <h2 className='text-4xl font-bold'>You're logged in!</h2>
      <p className='text-lg'>Redirecting to your profile in {counter} seconds...</p>
      <Link href={"/"} className='text-primary underline'>Take me home</Link>
    </div>
  )
}
