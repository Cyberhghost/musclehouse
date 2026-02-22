'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsLoggedIn(true);
      return;
    }
    const token = localStorage.getItem('admin-token');
    if (!token) {
      router.replace('/admin/login');
    } else {
      setIsLoggedIn(true);
    }
  }, [pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (isLoggedIn === null) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Chargement...</div></div>;

  const navItems = [
    { href: '/admin', label: 'Tableau de Bord', icon: '📊' },
    { href: '/admin/produits', label: 'Produits', icon: '🏋️' },
    { href: '/admin/categories', label: 'Catégories', icon: '📁' },
    { href: '/admin/commandes', label: 'Commandes', icon: '📦' },
    { href: '/admin/livraison', label: 'Livraison', icon: '🚚' },
    { href: '/admin/config-livraison', label: 'Config API', icon: '⚙️' },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('admin-token');
    router.push('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0`}>
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-orange-500">MUSCLE HOUSE DZ</h1>
          <p className="text-xs text-gray-400 mt-1">Administration</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === item.href ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <button onClick={handleLogout} className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors">
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center gap-4 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-300 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="font-semibold text-orange-500">Admin Panel</h2>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
