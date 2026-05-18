export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white px-6 py-8 mt-20 text-center">
      <p className="mb-4 font-semibold">© 2026 Online Store. All rights reserved.</p>
      <div className="flex justify-center gap-6 flex-wrap mb-4">
        <a href="#" className="text-blue-400 hover:text-black transition-colors duration-300 text-sm">
          About Us
        </a>
        <a href="#" className="text-blue-400 hover:text-black transition-colors duration-300 text-sm">
          Contact
        </a>
        <a href="#" className="text-blue-400 hover:text-black transition-colors duration-300 text-sm">
          Privacy Policy
        </a>
      </div>
      <p className="text-gray-400 text-xs border-t border-gray-700 pt-4"></p>
    </footer>
  );
}
