"use client"

import Link from "next/link"

export default function Logo() {
  return (
    <Link href={"/"}>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-4 to-primary-9 inline-block text-transparent bg-clip-text">app.name</h1>
    </Link>
  )
}
