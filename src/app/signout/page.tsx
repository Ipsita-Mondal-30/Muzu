'use client';

import { signOut } from "next-auth/react";

export default function SignOutPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Are you sure you want to sign out?</h1>

      <button
        onClick={() => signOut()}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Yes, sign out
      </button>
    </div>
  );
}
