export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-white mb-2">Contactez-nous</h1>
      <p className="text-dark-400 mb-10">Nous sommes là pour vous aider. N'hésitez pas à nous contacter.</p>

      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        {/* Phone */}
        <a
          href="tel:0560000000"
          className="group bg-dark-800 rounded-xl border border-dark-700 hover:border-primary-600 p-6 flex items-start gap-4 transition-colors"
        >
          <div className="bg-primary-900/40 text-primary-400 rounded-lg p-3 text-2xl flex-shrink-0">📞</div>
          <div>
            <p className="text-dark-400 text-sm mb-1">Téléphone</p>
            <p className="text-white font-bold group-hover:text-primary-400 transition-colors">0560 00 00 00</p>
            <p className="text-dark-500 text-xs mt-1">Appel direct</p>
          </div>
        </a>

        {/* WhatsApp */}
        <a
          href="https://wa.me/213560000000"
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-dark-800 rounded-xl border border-dark-700 hover:border-green-600 p-6 flex items-start gap-4 transition-colors"
        >
          <div className="bg-green-900/40 text-green-400 rounded-lg p-3 text-2xl flex-shrink-0">💬</div>
          <div>
            <p className="text-dark-400 text-sm mb-1">WhatsApp</p>
            <p className="text-white font-bold group-hover:text-green-400 transition-colors">0560 00 00 00</p>
            <p className="text-dark-500 text-xs mt-1">Message instantané</p>
          </div>
        </a>

        {/* Email */}
        <a
          href="mailto:contact@musclehouse.dz"
          className="group bg-dark-800 rounded-xl border border-dark-700 hover:border-primary-600 p-6 flex items-start gap-4 transition-colors"
        >
          <div className="bg-primary-900/40 text-primary-400 rounded-lg p-3 text-2xl flex-shrink-0">✉️</div>
          <div>
            <p className="text-dark-400 text-sm mb-1">Email</p>
            <p className="text-white font-bold group-hover:text-primary-400 transition-colors">contact@musclehouse.dz</p>
            <p className="text-dark-500 text-xs mt-1">Réponse sous 24h</p>
          </div>
        </a>

        {/* Address */}
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 flex items-start gap-4">
          <div className="bg-primary-900/40 text-primary-400 rounded-lg p-3 text-2xl flex-shrink-0">📍</div>
          <div>
            <p className="text-dark-400 text-sm mb-1">Adresse</p>
            <p className="text-white font-bold">Alger, Algérie</p>
            <p className="text-dark-500 text-xs mt-1">Livraison dans toute l'Algérie</p>
          </div>
        </div>
      </div>

      {/* Google Maps embed */}
      <div className="rounded-xl overflow-hidden border border-dark-700 mb-4">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d205065.4637847547!2d2.9975116!3d36.7372896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb26977ea659f%3A0x3fcc9f8d7f5e7f1c!2sAlger%2C%20Alg%C3%A9rie!5e0!3m2!1sfr!2sdz!4v1700000000000!5m2!1sfr!2sdz"
          width="100%"
          height="350"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Muscle House DZ - Alger"
        />
      </div>

      <a
        href="https://www.google.com/maps/place/Alger,+Alg%C3%A9rie"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm"
      >
        📍 Ouvrir dans Google Maps
      </a>
    </div>
  );
}
