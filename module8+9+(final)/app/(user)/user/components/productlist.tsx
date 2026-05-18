import ProductCard from "./productcard";
import { Product } from "@/app/(user)/user/types";


export default function ProductList({ initialProducts }: { initialProducts: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center p-6">
      {initialProducts.map((item) => (
        <ProductCard key={item.id} {...item} />
      ))}
    </div>
  );
}