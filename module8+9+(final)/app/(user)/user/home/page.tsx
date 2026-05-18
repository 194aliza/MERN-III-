import Link from "next/link";

export default function UserHomePage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <h1 className="text-5xl font-bold font-playfair mb-6 leading-tight">
        Explore the <br /> 
        <span className="text-blue-600">Type-Safe Collection</span>
      </h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Welcome to user dashboard. Browse our premium products with real-time validation.
      </p>
      <div className="flex gap-4">
        <Link 
          href="/user/products" 
          className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg"
        >
          View All Products
        </Link>
        <Link 
          href="/user/cart" 
          className="bg-white text-black border border-gray-200 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition"
        >
          My Cart
        </Link>
      </div>
    </div>
  );
}