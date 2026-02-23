import Link from "next/link";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.content}>
          {/* Brand */}
          <div style={styles.section}>
            <h4 style={styles.heading}>Muscle House DZ</h4>
            <p style={styles.text}>
              Votre spécialiste en compléments alimentaires en Algérie. Produits
              100% authentiques, livraison rapide dans les 48 wilayas.
            </p>
          </div>

          {/* Contact */}
          <div style={styles.section}>
            <h4 style={styles.heading}>Contact</h4>
            <div style={styles.contacts}>
              <a href="tel:+213561727883" style={styles.link}>
                📞 0561 72 78 83
              </a>
              <a href="tel:+213557532895" style={styles.link}>
                📞 0557 53 28 95
              </a>
              <a
                href="https://wa.me/213561727883"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                💬 WhatsApp 0561 72 78 83
              </a>
              <a
                href="https://wa.me/213557532895"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                💬 WhatsApp 0557 53 28 95
              </a>
            </div>
          </div>

          {/* Store */}
          <div style={styles.section}>
            <h4 style={styles.heading}>Notre magasin</h4>
            <p style={styles.text}>
              📍{" "}
              <a
                href="https://share.google/IySlRsGSU7mvHTsgf"
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...styles.link, textDecoration: "underline" }}
              >
                Voir sur Google Maps
              </a>
            </p>
          </div>

          {/* Social */}
          <div style={styles.section}>
            <h4 style={styles.heading}>Suivez-nous</h4>
            <div style={styles.social}>
              <a
                href="https://www.facebook.com/share/17foL6TEka/"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.socialLink}
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f" />
              </a>
              <a
                href="https://www.instagram.com/muscle.house_dz"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.socialLink}
                aria-label="Instagram"
              >
                <i className="fab fa-instagram" />
              </a>
            </div>
          </div>
        </div>

        <div style={styles.bottom}>
          © 2025 Muscle House DZ — Tous droits réservés
        </div>
      </div>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    background: "#0a0a0a",
    color: "#fff",
    padding: "60px 0 30px",
    fontFamily: "'Poppins', sans-serif",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 32px",
  },
  content: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "32px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  heading: {
    fontSize: "14px",
    fontWeight: 800,
    letterSpacing: ".1em",
    textTransform: "uppercase",
    marginBottom: "12px",
    color: "#fff",
  },
  text: {
    fontSize: "13px",
    lineHeight: 1.6,
    color: "#f5f5f5",
    margin: 0,
  },
  contacts: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  link: {
    fontSize: "13px",
    lineHeight: 1.6,
    color: "#f5f5f5",
    textDecoration: "none",
  },
  social: {
    display: "flex",
    gap: "12px",
    marginTop: "4px",
  },
  socialLink: {
    fontSize: "18px",
    color: "#f5f5f5",
    textDecoration: "none",
  },
  bottom: {
    textAlign: "center",
    fontSize: "12px",
    color: "#d0d0d0",
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },
};
