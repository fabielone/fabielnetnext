// app/privacy/page.tsx
import { 
  RiShieldLine, 
  RiTimeLine, 
  RiUserLine, 
  RiLockLine,
  RiGlobalLine,
  RiMailLine,
  RiQuestionLine
} from 'react-icons/ri';

import {BiCookie} from 'react-icons/bi'
  
export const metadata = {
  title: 'Privacy Policy | Fabiel.net',
  description: 'Learn how we protect and handle your personal information.',
};
  
const lastUpdated = 'December 15, 2023';
  
export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-amber-100 rounded-full">
                <RiShieldLine className="h-12 w-12 text-amber-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Your privacy is important to us. This policy describes how we collect, 
              use, and protect your personal information.
            </p>
            <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
              <RiTimeLine className="h-5 w-5 mr-2" />
              Last updated: {lastUpdated}
            </div>
          </div>
        </div>
      </div>
  
      {/* Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1 sticky top-8">
              {[
                { id: 'collection', icon: RiUserLine, text: 'Information Collection' },
                { id: 'use', icon: RiGlobalLine, text: 'Information Use' },
                { id: 'protection', icon: RiLockLine, text: 'Data Protection' },
                { id: 'cookies', icon: BiCookie, text: 'Cookies' },
                { id: 'communications', icon: RiMailLine, text: 'Communications' },
                { id: 'rights', icon: RiShieldLine, text: 'Your Rights' },
                { id: 'contact', icon: RiQuestionLine, text: 'Contact' },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="group flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-white hover:shadow-md transition-all"
                >
                  <item.icon className="mr-3 h-5 w-5 text-amber-600" />
                  <span className="text-gray-900">{item.text}</span>
                </a>
              ))}
            </nav>
          </div>
  
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section id="collection" className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Information Collection
              </h2>
              <div className="prose prose-amber max-w-none">
                <p>
                  We collect information that you provide directly to us when:
                </p>
                <ul className="space-y-2 list-disc pl-5 text-gray-600">
                  <li>You create an account on our platform</li>
                  <li>You make a purchase or transaction</li>
                  <li>You communicate with our support team</li>
                  <li>You subscribe to our newsletter</li>
                  <li>You participate in surveys or promotions</li>
                </ul>
              </div>
            </section>
  
            <section id="use" className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Information Use
              </h2>
              <div className="prose prose-amber max-w-none">
                <p>
                  We use the collected information to:
                </p>
                <ul className="space-y-2 list-disc pl-5 text-gray-600">
                  <li>Provide and maintain our services</li>
                  <li>Process your transactions</li>
                  <li>Send administrative communications</li>
                  <li>Improve our services</li>
                  <li>Prevent fraudulent activities</li>
                </ul>
              </div>
            </section>
  
            <section id="protection" className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Data Protection
              </h2>
              <div className="prose prose-amber max-w-none">
                <p>
                  We implement technical and organizational security measures to protect your information:
                </p>
                <ul className="space-y-2 list-disc pl-5 text-gray-600">
                  <li>Encryption of sensitive data</li>
                  <li>Restricted access to personal information</li>
                  <li>Continuous security monitoring</li>
                  <li>Regular backups</li>
                </ul>
              </div>
            </section>
  
            <section id="cookies" className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Cookies
              </h2>
              <div className="prose prose-amber max-w-none">
                <p>
                  We use cookies and similar technologies to:
                </p>
                <ul className="space-y-2 list-disc pl-5 text-gray-600">
                  <li>Keep your session active</li>
                  <li>Remember your preferences</li>
                  <li>Analyze the use of our services</li>
                  <li>Personalize your experience</li>
                </ul>
              </div>
            </section>
  
            <section id="communications" className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Communications
              </h2>
              <div className="prose prose-amber max-w-none">
                <p>
                  You may receive communications from us related to:
                </p>
                <ul className="space-y-2 list-disc pl-5 text-gray-600">
                  <li>Service updates</li>
                  <li>Policy changes</li>
                  <li>Newsletters (if you subscribed)</li>
                  <li>Special offers (with your consent)</li>
                </ul>
              </div>
            </section>
  
            <section id="rights" className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your Rights
              </h2>
              <div className="prose prose-amber max-w-none">
                <p>
                  You have the right to:
                </p>
                <ul className="space-y-2 list-disc pl-5 text-gray-600">
                  <li>Access your personal information</li>
                  <li>Rectify incorrect data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to data processing</li>
                  <li>Withdraw your consent</li>
                </ul>
              </div>
            </section>
  
            <section id="contact" className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Contact
              </h2>
              <div className="prose prose-amber max-w-none">
                <p>
                  For any questions about this policy or your rights, you can contact us:
                </p>
                <ul className="space-y-2 list-disc pl-5 text-gray-600">
                  <li>Email: privacy@fabiel.net</li>
                  <li>Phone: +1 (555) 123-4567</li>
                  <li>Address: 123 Privacy Street, Tech City, TC 12345</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
  
      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            {new Date().getFullYear()} Fabiel.net. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}