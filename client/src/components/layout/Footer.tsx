import { Link } from "wouter";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-800 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-medium mb-4">{APP_NAME}</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/about#contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/about#careers" className="hover:text-white">Careers</Link></li>
              <li><Link href="/about#press" className="hover:text-white">Press</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Features</h3>
            <ul className="space-y-2">
              <li><Link href="/calculator" className="hover:text-white">Impact Calculator</Link></li>
              <li><Link href="/products" className="hover:text-white">Product Database</Link></li>
              <li><Link href="/timeline" className="hover:text-white">Tariff Timeline</Link></li>
              <li><Link href="/products#alternatives" className="hover:text-white">Savings Tips</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/about#help" className="hover:text-white">Help Center</Link></li>
              <li><Link href="/about#data-sources" className="hover:text-white">Data Sources</Link></li>
              <li><Link href="/about#api" className="hover:text-white">API Documentation</Link></li>
              <li><Link href="/about#privacy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">Twitter</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a></li>
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-neutral-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">© {currentYear} {APP_NAME}. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/about#privacy" className="text-neutral-400 hover:text-white">
              <span className="sr-only">Privacy</span>
              Privacy Policy
            </Link>
            <Link href="/about#terms" className="text-neutral-400 hover:text-white">
              <span className="sr-only">Terms</span>
              Terms of Service
            </Link>
            <Link href="/about#cookies" className="text-neutral-400 hover:text-white">
              <span className="sr-only">Cookies</span>
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
