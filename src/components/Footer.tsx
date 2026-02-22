import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-dark-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-primary-500 font-extrabold text-lg tracking-tight mb-3">MUSCLE HOUSE DZ</h3>
            <p className="text-dark-400 text-sm leading-relaxed">
              Votre partenaire nutrition sportive en Algérie. Produits authentiques, livraison rapide.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-dark-100 font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-dark-400">
              <li>
                <a href="tel:0560000000" className="hover:text-primary-400 transition-colors">
                  📞 0560 00 00 00
                </a>
              </li>
              <li>
                <a href="mailto:contact@musclehouse.dz" className="hover:text-primary-400 transition-colors">
                  ✉️ contact@musclehouse.dz
                </a>
              </li>
              <li className="text-dark-400">📍 Alger, Algérie</li>
              <li className="text-dark-500 text-xs">NIF: —</li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-dark-100 font-semibold mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-dark-400 hover:text-primary-400 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/catalogue" className="text-dark-400 hover:text-primary-400 transition-colors">
                  Catalogue
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-dark-400 hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/suivi" className="text-dark-400 hover:text-primary-400 transition-colors">
                  Suivi commande
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-8 pt-6 text-center text-dark-500 text-sm">
          © 2024 Muscle House DZ — Tous droits réservés
        </div>
      </div>
    </footer>
  );
}
