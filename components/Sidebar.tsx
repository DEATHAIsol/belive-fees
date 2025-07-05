'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/buy', label: 'Buy $Belive', icon: '💰' },
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/history', label: 'History', icon: '📜' },
    { href: '/about', label: 'About', icon: 'ℹ️' },
  ];

  return (
    <div className="w-64 bg-secondary min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">BeliveJackpot</h1>
        <p className="text-sm text-gray-400">Hourly Lottery</p>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 