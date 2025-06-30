import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple navigation for auth pages */}
      <nav className="absolute top-0 left-0 right-0 z-10 p-6">
        <Link href="/" className="inline-flex items-center space-x-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Quoralyze</span>
        </Link>
      </nav>

      {/* Auth content */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
} 