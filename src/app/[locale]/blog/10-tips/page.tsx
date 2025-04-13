'use client'
// app/posts/10-tips-start-llc-california/page.jsx

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function LLCTipsCalifornia() {
  const [tocOpen, setTocOpen] = useState(true);
  const [likes, setLikes] = useState(124);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    if (!liked) {
      setLikes(likes + 1);
      setLiked(true);
    } else {
      setLikes(likes - 1);
      setLiked(false);
    }
  };

  const tips = [
    {
      id: 1,
      title: "Choose a Unique Business Name",
      content: "Your LLC name must be distinguishable from other entities registered with the California Secretary of State. It must include 'Limited Liability Company' or abbreviations like LLC or L.L.C. Check name availability on the state's website before filing.",
      image: "https://fakeimg.pl/600x400/4f46e5/ffffff?text=Choose+Name&font=lora"
    },
    {
      id: 2,
      title: "Appoint a Registered Agent",
      content: "California requires every LLC to have a registered agent with a physical address in the state who can receive legal documents during business hours. You can act as your own agent or hire a professional service.",
      image: "https://fakeimg.pl/600x400/4f46e5/ffffff?text=Registered+Agent&font=lora"
    },
    {
      id: 3,
      title: "File Articles of Organization",
      content: "Submit Form LLC-1 to the California Secretary of State with a $70 filing fee (as of 2023). You can file online, by mail, or in person. This officially creates your LLC.",
      image: "https://fakeimg.pl/600x400/4f46e5/ffffff?text=File+Articles&font=lora"
    },
    {
      id: 4,
      title: "Create an Operating Agreement",
      content: "While not legally required in California, an operating agreement outlines ownership structure, member roles, and operating procedures. It's crucial for multi-member LLCs and helps maintain liability protection.",
      image: "https://fakeimg.pl/600x400/4f46e5/ffffff?text=Operating+Agreement&font=lora"
    },
    {
      id: 5,
      title: "Obtain an EIN from the IRS",
      content: "Apply for an Employer Identification Number (EIN) for free on the IRS website. You'll need this for tax purposes, opening a business bank account, and hiring employees.",
      image: "https://fakeimg.pl/600x400/4f46e5/ffffff?text=Get+EIN&font=lora"
    },
    {
      id: 6,
      title: "Pay the $800 Annual Franchise Tax",
      content: "California imposes an $800 minimum franchise tax on LLCs, due within 4 months of formation and annually thereafter. Budget for this significant expense.",
      image: "https://fakeimg.pl/600x400/4f46e5/ffffff?text=Franchise+Tax&font=lora"
    },
    {
      id: 7,
      title: "Register for State Taxes",
      content: "Depending on your business activities, you may need to register with the California Department of Tax and Fee Administration for sales tax, use tax, or other industry-specific taxes.",
      image: "https://fakeimg.pl/600x400/4f46e5/ffffff?text=State+Taxes&font=lora"
    },
    {
      id: 8,
      title: "Obtain Necessary Business Licenses",
      content: "Check with your city/county for local business license requirements. Some professions require state-level licenses. The CalGold website can help identify requirements.",
      image: "https://fakeimg.pl/600x400/4f46e5/ffffff?text=Business+Licenses&font=lora"
    },
    {
      id: 9,
      title: "Open a Business Bank Account",
      content: "Keep your personal and business finances separate to maintain liability protection. Most banks require your EIN, Articles of Organization, and possibly your Operating Agreement.",
      image: "https://fakeimg.pl/600x400/4f46e5/ffffff?text=Bank+Account&font=lora"
    },
    {
      id: 10,
      title: "Maintain Compliance",
      content: "File a Statement of Information (Form LLC-12) every 2 years with the CA Secretary of State ($20 fee). Keep proper records and hold required meetings to preserve your liability protection.",
      image: "https://fakeimg.pl/600x400/4f46e5/ffffff?text=Maintain+Compliance&font=lora"
    }
  ];

  const relatedPosts = [
    { id: 1, title: "California vs. Delaware LLC: Which is Better for Your Business?", url: "/california-vs-delaware-llc" },
    { id: 2, title: "How to Save Money on California LLC Fees", url: "/save-money-california-llc-fees" },
    { id: 3, title: "The Complete Guide to Small Business Taxes in California", url: "/california-small-business-taxes" }
  ];

  const tags = ["LLC", "California Business", "Entrepreneurship", "Small Business", "Legal Tips", "Startup"];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Image */}
      <div className="relative w-full h-96 rounded-xl overflow-hidden mb-8">
        <Image
          src="https://fakeimg.pl/1200x600/4f46e5/ffffff?text=10+Tips+to+Start+Your+LLC+in+California&font=lora"
          alt="10 Tips to Start Your LLC in California"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Article Header */}
      <header className="mb-12">
        <div className="flex items-center mb-4">
          {tags.slice(0, 3).map(tag => (
            <span key={tag} className="mr-2 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">10 english Essential Tips to Start Your LLC in California</h1>
        <p className="text-xl text-gray-600 mb-8">A step-by-step guide to forming your California LLC the right way and avoiding common mistakes.</p>
        
        {/* Author Info */}
        <div className="flex items-center mb-6">
          <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
            <Image
              src="https://fakeimg.pl/200x200/4f46e5/ffffff?text=JD&font=lora"
              alt="Author John Doe"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center">
              <Link href="/author/john-doe" className="font-medium text-gray-900 hover:text-purple-700">John Doe</Link>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-gray-500">Business Attorney</span>
            </div>
            <div className="text-sm text-gray-500">
              <span>Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="mx-2">•</span>
              <span>8 min read</span>
            </div>
          </div>
        </div>

        {/* Social Sharing and Like Button */}
        <div className="flex items-center justify-between border-t border-b border-gray-200 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-1 ${liked ? 'text-purple-600' : 'text-gray-500 hover:text-purple-600'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span>{likes} Likes</span>
            </button>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500">Share:</span>
            <a href="#" className="text-gray-500 hover:text-blue-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <div>
            <Link href="/author/john-doe" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
              View All Posts by John →
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <article className="lg:w-2/3">
          {/* Introduction */}
          <section className="mb-12">
            <p className="text-lg text-gray-700 mb-4">
              Starting a Limited Liability Company (LLC) in California can be an exciting venture, but it's important to navigate the process correctly to ensure your business gets off to the right start. With over 1.6 million LLCs registered in California, it's a popular choice for entrepreneurs seeking liability protection and flexibility.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              In this comprehensive guide, we'll walk you through 10 essential tips to properly form your California LLC while avoiding common pitfalls that could cost you time and money down the road.
            </p>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 my-6">
              <p className="font-medium text-purple-800">Key Takeaway:</p>
              <p className="text-purple-700">Forming an LLC in California involves more than just filing paperwork. Proper planning for taxes, compliance, and operational structure from the beginning can save you thousands of dollars and countless headaches.</p>
            </div>
          </section>

          {/* Table of Contents */}
          <section className="mb-12 bg-gray-50 rounded-lg p-6">
            <div 
              className="flex justify-between items-center cursor-pointer mb-4" 
              onClick={() => setTocOpen(!tocOpen)}
            >
              <h2 className="text-xl font-bold text-gray-900">Table of Contents</h2>
              <svg 
                className={`w-5 h-5 text-gray-500 transform transition-transform ${tocOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {tocOpen && (
              <ol className="space-y-2 pl-5">
                {tips.map(tip => (
                  <li key={tip.id} className="text-purple-700 hover:text-purple-900">
                    <a href={`#tip-${tip.id}`} className="flex items-start">
                      <span className="mr-2">{tip.id}.</span>
                      <span>{tip.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {/* Tips Content */}
          <section>
            {tips.map(tip => (
              <div key={tip.id} id={`tip-${tip.id}`} className="mb-16 scroll-mt-20">
                <div className="flex items-center mb-6">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-800 font-bold mr-4">
                    {tip.id}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900">{tip.title}</h2>
                </div>
                
                <div className="ml-14">
                  <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-6">
                    <Image
                      src={tip.image}
                      alt={tip.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-gray-700 mb-6">{tip.content}</p>
                  {tip.id === 3 && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                      <p className="font-medium text-yellow-800">Pro Tip:</p>
                      <p className="text-yellow-700">Consider using the California Secretary of State's online filing system for faster processing. Mail-in filings can take several weeks during busy periods.</p>
                    </div>
                  )}
                  {tip.id === 6 && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 my-6">
                      <p className="font-medium text-red-800">Warning:</p>
                      <p className="text-red-700">Failure to pay the $800 franchise tax can result in penalties and eventual suspension of your LLC. Mark your calendar for this recurring obligation.</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>

          {/* Conclusion */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Final Thoughts</h2>
            <p className="text-gray-700 mb-4">
              Forming an LLC in California is a straightforward process when you follow these steps carefully. While it's possible to handle the formation yourself, many entrepreneurs find value in consulting with a business attorney or using a professional formation service, especially for more complex situations.
            </p>
            <p className="text-gray-700">
              Remember that forming your LLC is just the first step - maintaining proper records, staying compliant with state requirements, and operating your business professionally are equally important to maintain your liability protection and set your business up for long-term success.
            </p>
          </section>

          {/* Tags */}
          <div className="mb-12">
            <h3 className="text-sm font-medium text-gray-500 mb-2">TAGS</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Link 
                  key={tag} 
                  href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 text-sm"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Author Bio */}
          <div className="bg-gray-50 rounded-lg p-6 mb-12">
            <div className="flex items-start">
              <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                <Image
                  src="https://fakeimg.pl/200x200/4f46e5/ffffff?text=JD&font=lora"
                  alt="Author John Doe"
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">John Doe</h3>
                <p className="text-sm text-purple-600 mb-2">Business Attorney | 10+ Years Experience</p>
                <p className="text-gray-700 mb-4">
                  John is a California-licensed attorney specializing in business formation and compliance. He's helped over 500 entrepreneurs successfully launch their LLCs and navigate California's regulatory landscape.
                </p>
                <Link 
                  href="/author/john-doe" 
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                >
                  View All Posts by John →
                </Link>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Comments (24)</h3>
            {/* Comment components would go here */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Leave a Comment</h4>
              <form>
                <textarea 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mb-4" 
                  rows={4}
                  placeholder="Share your thoughts..."
                ></textarea>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Post Comment
                </button>
              </form>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:w-1/3">
          {/* Advertisement */}
          <div className="bg-gray-100 rounded-lg p-6 mb-8 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Sponsored</p>
            <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
              <Image
                src="https://fakeimg.pl/300x250/ffffff/4f46e5?text=LLC+Formation+Service&font=lora"
                alt="LLC Formation Service Advertisement"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-sm text-gray-700 mb-2">Let the experts handle your LLC formation</p>
            <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700">
              Learn More
            </button>
          </div>

          {/* Related Posts */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Related Posts</h3>
            <ul className="space-y-4">
              {relatedPosts.map(post => (
                <li key={post.id}>
                  <Link 
                    href={post.url}
                    className="text-purple-600 hover:text-purple-800 font-medium hover:underline"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-purple-900 mb-2">Get More Business Tips</h3>
            <p className="text-purple-700 mb-4">Subscribe to our newsletter for weekly business and legal insights</p>
            <form className="space-y-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
              <button 
                type="submit" 
                className="w-full px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-purple-600 mt-3">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
