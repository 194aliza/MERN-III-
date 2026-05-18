import Navbar from "./components/Navbar";
import ThemeToggle from "@/app/component/themeToggle";
import Footer from "@/app/component/footer";
import { CartProvider } from "./context/CartContext";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Navbar />
      <span className="text-sm text-gray-400">Theme</span>
            <ThemeToggle />
      <main className="min-h-[80vh]">{children}</main>
      <Footer />
    </CartProvider>
  );
}