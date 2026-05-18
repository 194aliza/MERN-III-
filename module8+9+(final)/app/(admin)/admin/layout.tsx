/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/app/component/themeToggle";
import { CommandMenu } from "./components/CommandMenu"; 
import "@/app/Styles/cmdk.css";
import { LayoutDashboard, ShoppingBag, LogOut, Search, Bell } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
   
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
  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/*  Cmd+K Command Palette (Module 9 Requirement) */}
      <CommandMenu />

      {/*  Persistent Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col fixed h-full shadow-2xl z-50">
        <div className="mb-10 px-2">
          <h2 className="text-2xl font-bold text-blue-400 italic tracking-tighter">Admin Pro</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">MERN-II Capstone</p>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-all text-slate-300 hover:text-white group">
            <LayoutDashboard size={20} className="group-hover:text-blue-400" />
            <span className="font-medium">Dashboard</span>
          </Link>
          
          <Link href="/user/home" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-all text-slate-300 hover:text-white group">
            <ShoppingBag size={20} className="group-hover:text-blue-400" />
            <span className="font-medium">View Store</span>
          </Link>

          <div className="mt-8 px-3">
             <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-4">Settings</span>
             <ThemeToggle />
          </div>
        </nav>

        <button 
          onClick={handleLogout} 
          className="mt-auto flex items-center justify-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 py-3 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all active:scale-95"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main Content Area with Persistent Header */}
      <div className="flex-1 ml-64 flex flex-col">
        {/*  Persistent Header (Module 9 Requirement) */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2 text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md cursor-pointer hover:ring-1 ring-slate-300 transition-all" 
               onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', {'key': 'k', 'metaKey': true}))}>
            <Search size={16} />
            <span className="text-sm">Search or <kbd className="font-sans font-bold">⌘K</kbd></span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full cursor-pointer">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        <main className="p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}