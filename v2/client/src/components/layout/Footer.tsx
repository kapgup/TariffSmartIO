import React from 'react';
import { Link } from 'wouter';
import { 
  FOOTER_LINKS, 
  APP_NAME, 
  COPYRIGHT_YEAR, 
  CONTENT_LICENSE, 
  CONTENT_LICENSE_URL,
  SUPPORT_EMAIL
} from '../../lib/constants';

/**
 * Application footer
 */
export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Logo and description */}
          <div className="space-y-8 xl:col-span-1">
            <div>
              <Link href="/">
                <a className="flex items-center">
                  <span className="text-xl font-bold text-blue-600">{APP_NAME}</span>
                  <span className="ml-2 text-xs text-gray-500 font-medium rounded-full bg-blue-50 px-1.5 py-0.5">v2</span>
                </a>
              </Link>
              <p className="mt-4 text-gray-600 text-sm">
                An educational platform providing comprehensive resources on international trade, 
                tariffs, and global economic policies.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://github.com" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Footer sections */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Resources</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/v2/modules">
                      <a className="text-base text-gray-600 hover:text-gray-900">Learning Modules</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/v2/dictionary">
                      <a className="text-base text-gray-600 hover:text-gray-900">Trade Dictionary</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/v2/agreements">
                      <a className="text-base text-gray-600 hover:text-gray-900">Trade Agreements</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/v2/challenge">
                      <a className="text-base text-gray-600 hover:text-gray-900">Daily Challenge</a>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="text-base text-gray-600 hover:text-gray-900">
                      Contact Support
                    </a>
                  </li>
                  <li>
                    <Link href="/v2/faq">
                      <a className="text-base text-gray-600 hover:text-gray-900">FAQs</a>
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-600 hover:text-gray-900">
                      API Documentation
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-4">
                  {FOOTER_LINKS.map((link) => (
                    <li key={link.path}>
                      <Link href={link.path}>
                        <a className="text-base text-gray-600 hover:text-gray-900">{link.name}</a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/v2/terms">
                      <a className="text-base text-gray-600 hover:text-gray-900">Terms of Service</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/v2/privacy">
                      <a className="text-base text-gray-600 hover:text-gray-900">Privacy Policy</a>
                    </Link>
                  </li>
                  <li>
                    <a 
                      href={CONTENT_LICENSE_URL} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-base text-gray-600 hover:text-gray-900"
                    >
                      License
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright section */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-500 xl:text-center">
            &copy; {COPYRIGHT_YEAR} {APP_NAME}. All rights reserved.
            <br />
            <span className="text-sm">
              Content licensed under <a href={CONTENT_LICENSE_URL} className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">{CONTENT_LICENSE}</a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}