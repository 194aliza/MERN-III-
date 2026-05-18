/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import ThemeToggle from "./component/themeToggle";
import Footer from "./component/footer";

export default function WelcomePage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Loading state add ki hai
  const router = useRouter(); 

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const sessionEmailRaw = getCookie("session");
    const sessionEmail = sessionEmailRaw ? decodeURIComponent(sessionEmailRaw) : null;

    if (sessionEmail?.toLowerCase() === "admin@store.com") {
      setRole("admin");
    } else if (sessionEmail) {
      setRole("user");
    } else {
      setRole(null);
      // Agar session nahi hai to seedha login pe bhej do (Optional)
      // router.push("/auth/login"); 
    }
    setLoading(false);
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    
    // Cookies clear karne ka asaan tareeqa
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/auth/login";
  };

  if (loading) return null; // Jab tak check ho raha hai, khali screen rakho

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300">
      <header className="w-full bg-slate-900 text-white py-4 px-8 flex justify-between items-center shadow-md">
        <Link href="/" className="text-2xl font-bold tracking-tight italic">
          Store<span className="text-blue-500">.</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-8xl font-black mb-8 dark:text-white tracking-tighter">
          Welcome<span className="text-blue-600">.</span>
        </h1>

        <div className="flex flex-col items-center gap-8">
          {!role ? (
            <div className="flex gap-6 scale-110">
              <Link href="/auth/login" className="bg-blue-600 text-white px-10 py-3 rounded-full font-bold hover:bg-blue-700 shadow-lg transition-all">
                Login
              </Link>
              <Link href="/auth/register" className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-10 py-3 rounded-full font-bold hover:bg-blue-50 transition-all">
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <p className="text-gray-500 dark:text-gray-400 italic text-lg">
                Connected as <span className="font-bold text-blue-600 uppercase">{role}</span>
              </p>
              <div className="flex gap-4">
                <Link 
                  href={role === "admin" ? "/admin/dashboard" : "/user/home"} 
                  className="bg-slate-900 dark:bg-white dark:text-slate-950 text-white px-10 py-3 rounded-full font-bold hover:opacity-90 transition shadow-xl"
                >
                  Go to {role === "admin" ? "Dashboard" : "Home"}
                </Link>
                <button onClick={handleLogout} className="text-red-500 font-bold hover:underline px-4">
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}