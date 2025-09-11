import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube, FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image'; // Import the Image component
import Newsletter from '../newsletter/subscribe';

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
                <Link href="/services" className="text-sm text-gray-300 hover:text-white transition-colors">Services</Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-sm text-gray-300 hover:text-white transition-colors">Portfolio</Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-300 hover:text-white transition-colors">Blog</Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">Contact</Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-300 hover:text-white transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-300 hover:text-white transition-colors">Privacy Notice</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-100">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/business-formations" className="text-sm text-gray-300 hover:text-white transition-colors">Business Formations</Link>
              </li>
              <li>
                <Link href="/services/software-development" className="text-sm text-gray-300 hover:text-white transition-colors">Software Development</Link>
              </li>
              <li>
                <Link href="/services/marketing" className="text-sm text-gray-300 hover:text-white transition-colors">Marketing</Link>
              </li>
              <li>
                <Link href="/services/registered-agent" className="text-sm text-gray-300 hover:text-white transition-colors">Registered Agent</Link>
              </li>
              <li>
                <Link href="/services/compliance" className="text-sm text-gray-300 hover:text-white transition-colors">Compliance</Link>
              </li>
              <li>
                <Link href="/services/concierge-service" className="text-sm text-gray-300 hover:text-white transition-colors">Concierge Service</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription Form */}
          <Newsletter
                        
            title='Newsletter'
          /> 
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-300">
            © {new Date().getFullYear()} Fabiel. All rights reserved.
          </p>
          <p className="text-sm text-gray-300 mt-2">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>{' '}
            |{' '}
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Notice</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}