"use client";
import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import "@/app/Styles/cmdk.css"; 

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigate = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-slate-950/50 backdrop-blur-sm p-4">
      <Command className="w-full max-w-[640px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center border-b p-4">
          <Command.Input placeholder="Search admin sections..." className="w-full outline-none text-slate-800" />
        </div>
        <Command.List className="p-2 max-h-[300px] overflow-y-auto">
          <Command.Empty className="p-4 text-sm text-slate-500">No results found.</Command.Empty>
          
          <Command.Group heading="Navigation" className="text-xs font-bold text-slate-400 p-2">
            <Command.Item onSelect={() => navigate("/admin/dashboard")} className="p-3 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-700 flex gap-2">
               Dashboard
            </Command.Item>
            <Command.Item onSelect={() => navigate("/user/home")} className="p-3 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-700 flex gap-2">
               View Store
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Actions" className="text-xs font-bold text-slate-400 p-2">
            <Command.Item className="p-3 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer">
               Logout
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}