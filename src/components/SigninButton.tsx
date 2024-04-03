"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
const SigninButton = () => {
  const router = useRouter();
  const { data: session, status }:any = useSession();

  if (session && session.user) {
    console.log(session);
    return (
      <div className="flex gap-4 ml-auto items-center">
        <p className="text-sky-600">{session.user.name}</p>
        {
          session.user.image && 
          <Image
            src={session.user.image ?? ""}
            alt={session.user.name ?? ""}
            className=" rounded-full"
            width={32}
            height={32}
          />
        }
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
    <button onClick={() => router.push("/api/auth/signin")} className="text-green-600 ml-auto">
      Sign In
    </button>
  );
};

export default SigninButton;