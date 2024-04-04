"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
const SigninButton = () => {
  const router = useRouter();
  const { data: session }:any = useSession();

  if (session && session.user) {
    console.log(session);
    return (
      <div className="flex gap-4 ml-auto items-center ps-3 py-2 shadow shadow-gray-500">
        <p className="text-sky-600">{session.user.name}</p>
        <Image
          src={session.user.picture ?? "https://cdn1.iconfinder.com/data/icons/social-object-set-5-3/74/15-512.png"}
          alt={session.user.name ?? "User"}
          className=" rounded-full"
          width={32}
          height={32}
        />
        <button onClick={async() => {
          try {
            await axios.post('/api/auth/logout',{},{
              headers: {
                'Authorization': `Token ${session.user.accessToken}`
              }
            })
            await signOut({callbackUrl: "/"}) 
          } catch (error) {
            console.log(error)
          }
        }} className="text-red-600">
          Sign Out
        </button>
      </div>
    );
  }
  return (
    <Link href="/api/auth/signin" className="text-green-600 ml-auto">
      Sign In
    </Link>
  );
};

export default SigninButton;