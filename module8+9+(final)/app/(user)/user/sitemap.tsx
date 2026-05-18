import { MetadataRoute } from 'next';
import { products } from "@/app/(user)/user/data/product"; 

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "http://localhost:3000"; 

  
  const routes = ["", "/products", "/cart", "/auth/login"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));


  const productEntries = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(),
  }));

  return [...routes, ...productEntries];
}