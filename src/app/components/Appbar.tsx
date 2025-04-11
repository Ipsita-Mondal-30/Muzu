// components/Appbar.tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Appbar() {
  const session = useSession();
  
  return (
    <div className="flex items-center">
      {session.data?.user?.name ? (
        <div className="flex items-center gap-4">
          <span className="text-purple-300 hidden md:inline-block">
            {session.data.user.name}
          </span>
          <button 
            className="px-6 py-2 rounded-full bg-gray-800 border border-purple-600 text-white hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md hover:shadow-purple-600/20"
            onClick={() => signOut()}
          >
            Logout
          </button>
        </div>
      ) : (
        <button 
          className="px-6 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md hover:shadow-purple-600/30"
          onClick={() => signIn()}
        >
          Sign In
        </button>
      )}
    </div>
  );
}