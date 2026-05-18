import { cookies } from "next/headers";
import { products } from "@/app/(user)/user/data/product";
import { removeFromcartaction } from "@/app/(user)/user/actions/cartaction";
import Link from "next/link";


interface CartProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  qty: number;
}

export default async function CartPage() {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get("cart");
  
  
  const cartItems: { productId: string; qty: number }[] = cartCookie 
    ? JSON.parse(cartCookie.value) 
    : [];

  
  const cartProducts: CartProduct[] = [];
  
  cartItems.forEach((item) => {
    const p = products.find((product) => product.id === parseInt(item.productId));
    if (p) {
      cartProducts.push({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        qty: item.qty
      });
    }
  });

 
  const totalAmount = cartProducts.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Shopping Cart</h1>
        
        {cartProducts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border dark:border-slate-800">
            <p className="text-slate-500 mb-4 font-medium">Your cart is empty.</p>
            <Link href="/user/home" className="text-blue-600 font-bold hover:underline">
              Go Shopping →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartProducts.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-900 p-5 flex justify-between items-center shadow-sm rounded-2xl border dark:border-slate-800">
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold dark:text-white">{item.name}</h3>
                      <p className="text-sm text-slate-500 font-medium">Qty: {item.qty} x ${item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <p className="font-bold text-blue-600 text-lg">${(item.price * item.qty).toFixed(2)}</p>
                    <form action={async () => {
                      'use server';
                      await removeFromcartaction(item.id);
                    }}>
                      <button className="text-red-500 text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-xl transition-all">
                        Remove
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border dark:border-slate-800 h-fit sticky top-8">
              <h2 className="text-xl font-bold mb-6 dark:text-white">Order Summary</h2>
              <div className="flex justify-between mb-4 dark:text-slate-300">
                <span className="text-slate-500 font-medium">Subtotal:</span>
                <span className="font-bold">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="border-t border-dashed dark:border-slate-800 my-4 pt-4 flex justify-between font-extrabold text-xl dark:text-white">
                <span>Total:</span>
                <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
              </div>
              <Link 
                href={`/user/checkout?total=${totalAmount.toFixed(2)}`} 
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-blue-100 dark:shadow-none"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}