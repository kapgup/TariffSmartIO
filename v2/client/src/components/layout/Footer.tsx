import { Link } from 'wouter';
import { 
  APP_FULL_NAME, 
  CONTENT_LICENSE, 
  CONTENT_LICENSE_URL, 
  SUPPORT_EMAIL 
} from '../../lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and tagline */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/v2">
              <a className="flex items-center">
                <span className="text-white font-bold text-xl">{APP_FULL_NAME}</span>
              </a>
            </Link>
            <p className="mt-2 text-sm text-neutral-400">
              Your educational resource for understanding international trade and tariffs.
            </p>
          </div>
          
          {/* Quick links */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Learn</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/v2/modules">
                  <a className="text-base text-neutral-300 hover:text-white">
                    Learning Modules
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/v2/dictionary">
                  <a className="text-base text-neutral-300 hover:text-white">
                    Trade Dictionary
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/v2/agreements">
                  <a className="text-base text-neutral-300 hover:text-white">
                    Trade Agreements
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/v2/challenge">
                  <a className="text-base text-neutral-300 hover:text-white">
                    Daily Challenge
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/v2/about">
                  <a className="text-base text-neutral-300 hover:text-white">
                    About Us
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/v2/faq">
                  <a className="text-base text-neutral-300 hover:text-white">
                    FAQs
                  </a>
                </Link>
              </li>
              <li>
                <a 
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-base text-neutral-300 hover:text-white"
                >
                  Contact Support
                </a>
              </li>
              <li>
                <Link href="/v2/privacy">
                  <a className="text-base text-neutral-300 hover:text-white">
                    Privacy Policy
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal and version */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href={CONTENT_LICENSE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-neutral-300 hover:text-white"
                >
                  {CONTENT_LICENSE}
                </a>
              </li>
              <li>
                <Link href="/v2/terms">
                  <a className="text-base text-neutral-300 hover:text-white">
                    Terms of Service
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-base text-neutral-300 hover:text-white">
                    TariffSmart v1
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-neutral-700 pt-8">
          <p className="text-base text-neutral-400 text-center">
            &copy; {currentYear} TariffSmart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}