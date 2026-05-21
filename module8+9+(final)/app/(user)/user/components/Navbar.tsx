/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/app/component/themeToggle"; 

export default function Navbar() {

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const sessionEmail = getCookie("session");
    if (sessionEmail && decodeURIComponent(sessionEmail).toLowerCase() === "admin@store.com") {
      setRole("admin");
    } else if (sessionEmail) {
      setRole("user");
    }
  }, []);

 const handleLogout = async () => {
    // No backend logout endpoint is required here; clear client-side session state.
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/user;`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/admin;`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/auth;`;
    }

    localStorage.clear();
    sessionStorage.clear();

    window.location.href = "/auth/login";
  };

  return (
    <nav className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
      <Link href="/" className="text-2xl font-bold text-blue-400 italic tracking-tight">
        Store.
      </Link>
      
      <div className="flex gap-8 items-center font-medium">
        {/*  PATH FIX: Root se start karein taake nesting ka masla na ho */}
        <Link href="/user/home" className="hover:text-blue-400 transition-colors">Home</Link>
        <Link href="/user/products" className="hover:text-blue-400 transition-colors">Products</Link>
        <Link href="/user/cart" className="hover:text-blue-400 transition-colors">Cart</Link>

        {role === "admin" && (
          <Link 
            href="/admin/dashboard" 
            className="bg-amber-500 text-white px-4 py-1.5 rounded font-bold hover:bg-amber-600 transition-all shadow-lg"
          >
            Dashboard ⚙️
          </Link>
        )}

        <button 
          onClick={handleLogout} 
          className="bg-red-600/10 text-red-400 px-4 py-1.5 rounded border border-red-500/50 hover:bg-red-600 hover:text-white transition-all active:scale-95"
        >
          Logout
        </button>
        
        <div className="border-l border-slate-700 pl-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}