import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-white font-extrabold text-lg tracking-tight mb-3">
              MUSCLE HOUSE <span className="text-primary-500">DZ</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Votre partenaire nutrition sportive en Algérie. Produits authentiques, livraison rapide dans toute l&apos;Algérie.
            </p>
            {/* Socials */}
            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/213560000000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors text-sm flex items-center gap-1"
              >
                <span>📱</span> WhatsApp
              </a>
              <a
                href="https://www.instagram.com/musclehousedz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-colors text-sm flex items-center gap-1"
              >
                <span>📸</span> Instagram
              </a>
              <a
                href="https://www.facebook.com/musclehousedz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center gap-1"
              >
                <span>👥</span> Facebook
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="https://wa.me/213560000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400 transition-colors"
                >
                  📱 WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://share.google/IySlRsGSU7mvHTsgf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors"
                >
                  📍 Notre boutique (Maps)
                </a>
              </li>
              <li>
                <a href="mailto:contact@musclehouse.dz" className="hover:text-primary-400 transition-colors">
                  ✉️ contact@musclehouse.dz
                </a>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/catalogue" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Catalogue
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/suivi" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Suivi commande
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
          © 2025 Muscle House DZ — Tous droits réservés
        </div>
      </div>
    </footer>
  );
}
