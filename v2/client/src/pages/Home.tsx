import { Link } from 'wouter';

export default function V2Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            <span className="block">TariffSmart</span>
            <span className="block text-primary mt-2">Education Platform</span>
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500">
            Your comprehensive resource for understanding international trade, tariffs, and global commerce.
          </p>
          <div className="mt-10 flex justify-center gap-3">
            <Link href="/v2/modules">
              <a className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90">
                Browse Modules
              </a>
            </Link>
            <Link href="/v2/dictionary">
              <a className="px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Trade Dictionary
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900">What We Offer</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Educational resources to help you navigate the complex world of tariffs and trade.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Learning Modules */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Learning Modules</h3>
            <p className="mt-2 text-gray-600">Structured courses on tariffs, trade agreements, and international commerce fundamentals.</p>
          </div>

          {/* Trade Dictionary */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Trade Dictionary</h3>
            <p className="mt-2 text-gray-600">Comprehensive glossary of international trade and tariff terminology.</p>
          </div>

          {/* Interactive Quizzes */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" x2="9.01" y1="9" y2="9"></line>
                <line x1="15" x2="15.01" y1="9" y2="9"></line>
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Interactive Quizzes</h3>
            <p className="mt-2 text-gray-600">Test your knowledge with quizzes that reinforce key concepts from each module.</p>
          </div>
        </div>
      </section>

      {/* Featured Modules */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900">Featured Modules</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Start your learning journey with these popular modules
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Module 1 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
            <div className="h-3 bg-blue-500"></div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Beginner
                </span>
                <span className="text-sm text-gray-500">30 min</span>
              </div>
              <h3 className="text-lg font-semibold">Introduction to Tariffs</h3>
              <p className="mt-2 text-gray-600">Learn about the basics of tariffs, their purpose, and how they impact global trade.</p>
              <Link href="/v2/modules/intro-to-tariffs">
                <a className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline">
                  Start Module
                  <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </Link>
            </div>
          </div>

          {/* Module 2 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
            <div className="h-3 bg-green-500"></div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Beginner
                </span>
                <span className="text-sm text-gray-500">45 min</span>
              </div>
              <h3 className="text-lg font-semibold">Trade Agreements Fundamentals</h3>
              <p className="mt-2 text-gray-600">Understand the structure and purpose of international trade agreements and their role in global commerce.</p>
              <Link href="/v2/modules/trade-agreements-fundamentals">
                <a className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline">
                  Start Module
                  <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </Link>
            </div>
          </div>

          {/* Module 3 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
            <div className="h-3 bg-purple-500"></div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Advanced
                </span>
                <span className="text-sm text-gray-500">60 min</span>
              </div>
              <h3 className="text-lg font-semibold">Advanced Tariff Classification</h3>
              <p className="mt-2 text-gray-600">Master the complexities of the Harmonized System and learn how to properly classify goods for customs purposes.</p>
              <Link href="/v2/modules/advanced-tariff-classification">
                <a className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline">
                  Start Module
                  <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-primary rounded-xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 lg:py-16 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
                Ready to enhance your trade knowledge?
              </h2>
              <p className="mt-3 text-lg leading-6 text-indigo-100">
                Sign up to track your progress and earn certificates.
              </p>
            </div>
            <div className="flex flex-shrink-0 justify-center">
              <Link href="/v2/auth/signup">
                <a className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50">
                  Sign Up Free
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}