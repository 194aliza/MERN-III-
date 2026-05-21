/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const res = await fetch(`/api/products`, { cache: 'no-store' });
  const products = await res.json();
  const product = products.find((p: any) => p.id === Number(id));

  if (!product) notFound();

  return (
    <div className="p-10 flex flex-col md:flex-row gap-10 items-center max-w-6xl mx-auto">
      <div className="relative w-full max-w-md h-[400px]">
        <Image src={product.image} alt={product.name} fill className="rounded-2xl object-cover shadow-lg" />
      </div>
      <div className="space-y-6">
        <h1 className="text-5xl font-bold font-playfair text-slate-900">{product.name}</h1>
        <p className="text-3xl text-blue-600 font-bold">${product.price}</p>
        <p className="text-slate-500 leading-relaxed">High quality premium product from our exclusive collection.</p>
        <button className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-all active:scale-95">
          Add to Cart
        </button>
      </div>
    </div>
  );
}