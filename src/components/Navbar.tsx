'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-dark-900 border-b border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-primary-500 font-extrabold text-xl tracking-tight">
              MUSCLE HOUSE DZ
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-dark-200 hover:text-primary-400 transition-colors text-sm font-medium">
              Accueil
            </Link>
            <Link href="/catalogue" className="text-dark-200 hover:text-primary-400 transition-colors text-sm font-medium">
              Catalogue
            </Link>
            <Link href="/contact" className="text-dark-200 hover:text-primary-400 transition-colors text-sm font-medium">
              Contact
            </Link>
            <Link href="/suivi" className="text-dark-200 hover:text-primary-400 transition-colors text-sm font-medium">
              Suivi de commande
            </Link>
          </div>

          {/* Cart + hamburger */}
          <div className="flex items-center gap-4">
            <Link href="/panier" className="relative inline-flex items-center text-dark-200 hover:text-primary-400 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Hamburger */}
            <button
              className="md:hidden text-dark-200 hover:text-primary-400 transition-colors"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-dark-800 border-t border-dark-700 px-4 py-4 flex flex-col gap-4">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-dark-200 hover:text-primary-400 transition-colors font-medium">
            Accueil
          </Link>
          <Link href="/catalogue" onClick={() => setMenuOpen(false)} className="text-dark-200 hover:text-primary-400 transition-colors font-medium">
            Catalogue
          </Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="text-dark-200 hover:text-primary-400 transition-colors font-medium">
            Contact
          </Link>
          <Link href="/suivi" onClick={() => setMenuOpen(false)} className="text-dark-200 hover:text-primary-400 transition-colors font-medium">
            Suivi de commande
          </Link>
          <Link href="/panier" onClick={() => setMenuOpen(false)} className="text-dark-200 hover:text-primary-400 transition-colors font-medium">
            Panier {itemCount > 0 && <span className="ml-1 bg-primary-500 text-white text-xs rounded-full px-2 py-0.5">{itemCount}</span>}
          </Link>
        </div>
      )}
    </nav>
  );
}
