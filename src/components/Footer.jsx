export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600">© {new Date().getFullYear()} Meer Shoes. All rights reserved.</p>
        <nav className="text-sm text-gray-600 flex items-center gap-4">
          <a href="/about" className="hover:text-gray-900">About</a>
          <a href="/shop" className="hover:text-gray-900">Shop</a>
          <a href="/test" className="hover:text-gray-900">System</a>
        </nav>
      </div>
    </footer>
  )
}
