'use client'
import {useSession } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const { data: session } = useSession();

  return (
      <div className="flex justify-center items-center h-screen">
        {
          session?.user ? <Link href="/notes" className="text-blue-600">Go to notes</Link> : <h1 className="text-red-600">You are not logged in</h1>
        }
      </div>
  )
}
