// app/blog/layout.jsx
import { FaTwitter, FaGithub, FaLinkedin, FaHome, FaBook, FaUser } from 'react-icons/fa';
import Link from 'next/link';

export default function BlogLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              <Link href="/blog" className="hover:text-purple-600 transition-colors">My Blog</Link>
            </h1>
            <nav className="flex space-x-4 md:space-x-8">
              <Link href="/" className="text-gray-500 hover:text-purple-600 transition-colors flex items-center">
                <FaHome className="mr-1" /> Home
              </Link>
              <Link href="/blog" className="text-gray-500 hover:text-purple-600 transition-colors flex items-center">
                <FaBook className="mr-1" /> Posts
              </Link>
              <Link href="/about" className="text-gray-500 hover:text-purple-600 transition-colors flex items-center">
                <FaUser className="mr-1" /> About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} My Blog. All rights reserved.
              </p>
            </div>
            <div className="flex justify-center md:justify-end space-x-6">
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}