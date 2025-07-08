"use client";

import Link from "next/link";
import { FaUser, FaGavel } from "react-icons/fa"; 

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">Family Law Portal</h1>
      <p className="text-center text-muted-foreground max-w-md">
        Please login below as a client or lawyer to access the portal.
      </p>
      <div className="flex flex-col md:flex-row gap-6">
        <Link
          href="/client-login"
          className="w-64 h-40 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl border hover:border-blue-500 transition-all flex flex-col justify-center items-center text-center"
        >
          <FaUser className="text-4xl text-blue-600 mb-2" />
          <span className="text-lg font-medium text-gray-800">Client Login</span>
        </Link>
        <Link
          href="/lawyer-login"
          className="w-64 h-40 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl border hover:border-gray-700 transition-all flex flex-col justify-center items-center text-center"
        >
          <FaGavel className="text-4xl text-gray-700 mb-2" />
          <span className="text-lg font-medium text-gray-800">Lawyer Login</span>
        </Link>
      </div>
    </div>
  );
}
