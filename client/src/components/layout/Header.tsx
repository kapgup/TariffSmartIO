import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { UserMenu } from '@/components/auth/UserMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFeatureFlag } from '@/lib/featureFlags';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { Separator } from '@/components/ui/separator';
import { Menu, X } from 'lucide-react';

const navItems = [
  { title: 'Home', href: '/' },
  { title: 'Calculator', href: '/calculator' },
  { title: 'Products', href: '/products' },
  { title: 'Countries', href: '/countries' },
  { title: 'Timeline', href: '/timeline' },
  { title: 'About', href: '/about' },
];

export function Header() {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const authEnabled = useFeatureFlag('authentication');
  const [isOpen, setIsOpen] = useState(false);
  
  // Close mobile menu when navigation happens
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const renderNavItems = () => (
    <>
      {navItems.map((item) => (
        <NavigationMenuItem key={item.href}>
          <Link href={item.href}>
            <NavigationMenuLink
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground/80 hover:text-foreground hover:bg-accent'
              }`}
            >
              {item.title}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <span className="flex items-center space-x-2">
              <span className="text-xl font-bold">TariffSmart</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex gap-1">
              {renderNavItems()}
            </NavigationMenuList>
          </NavigationMenu>
        )}

        <div className="flex items-center gap-2">
          {/* User Menu / Auth Buttons */}
          {authEnabled && <UserMenu />}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col">
                <SheetHeader>
                  <SheetTitle>TariffSmart</SheetTitle>
                  <SheetDescription>
                    Navigate through our tariff tracking platform
                  </SheetDescription>
                </SheetHeader>
                <Separator className="my-4" />
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={location === item.href ? "default" : "ghost"}
                        className="w-full justify-start"
                      >
                        {item.title}
                      </Button>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}