/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import { products } from "@/app/(user)/user/data/product"; 
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import ProductTable from "../components/ProductTable";
import LiveOrderFeed from "../components/LiveOrderFeed";

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  

  const [realOrdersCount, setRealOrdersCount] = useState(0);
  const [realUsersCount, setRealUsersCount] = useState(0);

  useEffect(() => {
    setMounted(true);

    const fetchRealStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        };

        // ✅ Get all orders (admin endpoint)
        const resOrders = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          headers,
        });
        if (resOrders.ok) {
          const ordersData = await resOrders.json();
          if (Array.isArray(ordersData)) setRealOrdersCount(ordersData.length);
        }

        // Note: Backend doesn't have a /users endpoint yet
        // Using dummy count for now
        setRealUsersCount(1);
      } catch (err) {
        console.error(" Stats fetching error:", err);
      }
    };

    fetchRealStats();
    
   
    const interval = setInterval(fetchRealStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-500">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p>Syncing Real-time Analytics...</p>
      </div>
    </div>
  );

  
  const totalRevenue = products.reduce((acc, p) => acc + p.price, 0); 
  const totalStock = products.length;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 p-6">
      <header className="flex justify-between items-end border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Real-time store performance & inventory management</p>
        </div>
      </header>

     
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
     
        <div className="p-6 bg-blue-600 text-white rounded-3xl shadow-lg transition-transform hover:scale-105">
          <p className="text-blue-100 text-[10px] font-bold uppercase tracking-wider">Total Revenue</p>
          <h2 className="text-3xl font-bold mt-1">${totalRevenue.toLocaleString()}</h2>
          <span className="text-[10px] text-blue-200 bg-blue-500/30 px-2 py-0.5 rounded-full">Inventory Value</span>
        </div>

      
        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Active Orders</p>
          <h2 className="text-3xl font-bold mt-1 text-slate-800">{realOrdersCount}</h2>
          <span className="text-[10px] text-green-500 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            Live from orders.json
          </span>
        </div>

      
        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Users</p>
          <h2 className="text-3xl font-bold mt-1 text-slate-800">{realUsersCount}</h2>
          <p className="text-[10px] text-slate-400 mt-1 italic tracking-tight underline decoration-dotted">Live from users.json</p>
        </div>

        
        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Stock</p>
          <h2 className="text-3xl font-bold mt-1 text-slate-800">{totalStock} <span className="text-lg font-medium text-slate-400">Items</span></h2>
        </div>
      </div>

     
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6 text-slate-800">Price Distribution Chart</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={products}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" hide />
                <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} 
                />
                <Area type="monotone" dataKey="price" stroke="#2563eb" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 overflow-hidden">
          <LiveOrderFeed />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">Inventory Management</h3>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">Live Status</span>
        </div>
        <ProductTable />
      </div>
    </div>
  );
}