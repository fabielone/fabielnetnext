import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube, FaGithub } from 'react-icons/fa';
import Image from 'next/image'; // Import the Image component

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Logo and Social Links */}
          <div className="space-y-4">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src="/darklogo.png" // Path to your logo in the public folder
                alt="Fabiel.Net Logo"
                width={250} // Adjust width as needed
                height={40} // Adjust height as needed
                className="object-contain"
              />
            </div>
            <p className="text-sm text-gray-300">
              We help you form your business and build powerful software solutions to grow your brand.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-100">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/services" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="/portfolio" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="/blog" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/terms" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Privacy Notice
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-100">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="/services/business-formations" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Business Formations
                </a>
              </li>
              <li>
                <a href="/services/software-development" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Software Development
                </a>
              </li>
              <li>
                <a href="/services/marketing" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Marketing
                </a>
              </li>
              <li>
                <a href="/services/registered-agent" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Registered Agent
                </a>
              </li>
              <li>
                <a href="/services/compliance" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Compliance
                </a>
              </li>
              <li>
                <a href="/services/concierge-service" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Concierge Service
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Email Subscription */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-100">Subscribe to Our Newsletter</h3>
            <p className="text-sm text-gray-300">
              Get the latest updates on business formation, software development, and marketing tips.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-300">
            © {new Date().getFullYear()} Fabiel. All rights reserved.
          </p>
          <p className="text-sm text-gray-300 mt-2">
            <a href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>{' '}
            |{' '}
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy Notice
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}