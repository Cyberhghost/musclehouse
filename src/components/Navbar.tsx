"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [cartCount] = useState(0);
  const [search, setSearch] = useState("");
  const [activeLink, setActiveLink] = useState("Accueil");

  const navLinks = [
    { label: "Accueil", href: "#hero" },
    { label: "Catégories", href: "#categories" },
    { label: "Promos", href: "#soldes-section" },
    { label: "Nouveautés", href: "#latest-products" },
  ];

  return (
    <>
      {/* Google Fonts & FontAwesome */}
      <link
        href="https://fonts.googleapis.com/css2?family=Anton&family=Poppins:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />

      {/* Promo Bar */}
      <div style={styles.promoBar}>
        <span style={styles.promoSpan}>
          <b>MUSCLE HOUSE DZ</b> — QUALITÉ AUTHENTIQUE • LIVRAISON 48 WILAYAS •
          SUPPORT WHATSAPP
        </span>
      </div>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          {/* Logo */}
          <Link href="/" style={styles.logo}>
            <span style={styles.logoDot} />
            MUSCLE HOUSE DZ
          </Link>

          {/* Nav */}
          <nav style={styles.navMain}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setActiveLink(link.label)}
                style={{
                  ...styles.navLink,
                  ...(activeLink === link.label ? styles.navLinkActive : {}),
                }}
                onMouseEnter={(e) => {
                  if (activeLink !== link.label) {
                    (e.currentTarget as HTMLElement).style.background = "#0a0a0a";
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeLink !== link.label) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#0a0a0a";
                  }
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right controls */}
          <div style={styles.headerRight}>
            {/* Search */}
            <div style={styles.searchWrap}>
              <input
                type="text"
                placeholder="Rechercher un produit"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
              />
              <button style={styles.searchBtn} aria-label="Rechercher">
                <i className="fa fa-search" />
              </button>
            </div>

            {/* Lang */}
            <button style={styles.langBtn}>
              <i className="fa fa-globe" /> FR / AR
            </button>

            {/* Tracking */}
            <button style={styles.iconBtn} aria-label="Suivi de commande">
              <i className="fa fa-truck" />
            </button>

            {/* Cart */}
            <button style={styles.iconBtn} aria-label="Panier">
              <i className="fa fa-bag-shopping" />
              <span style={styles.cartBadge}>{cartCount}</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  promoBar: {
    background: "#0a0a0a",
    color: "#fff",
    textAlign: "center",
    padding: "10px 20px",
    fontSize: "12px",
    letterSpacing: ".14em",
    fontWeight: 500,
    position: "relative",
    overflow: "hidden",
  },
  promoSpan: {
    position: "relative",
    zIndex: 1,
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 500,
    background: "#fff",
    borderBottom: "1px solid #e5e5e5",
  },
  headerInner: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 32px",
    height: "68px",
    display: "flex",
    alignItems: "center",
    gap: "32px",
  },
  logo: {
    fontFamily: "'Anton', sans-serif",
    fontSize: "26px",
    letterSpacing: ".06em",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textTransform: "uppercase",
    textDecoration: "none",
    color: "#0a0a0a",
  },
  logoDot: {
    width: "8px",
    height: "8px",
    background: "#0a0a0a",
    borderRadius: "50%",
    display: "inline-block",
  },
  navMain: {
    display: "flex",
    gap: "4px",
    flex: 1,
  },
  navLink: {
    fontSize: "13px",
    fontWeight: 600,
    padding: "8px 16px",
    borderRadius: "4px",
    letterSpacing: ".04em",
    textTransform: "uppercase",
    transition: "background .15s, color .15s",
    cursor: "pointer",
    whiteSpace: "nowrap",
    textDecoration: "none",
    color: "#0a0a0a",
    background: "transparent",
  },
  navLinkActive: {
    background: "#0a0a0a",
    color: "#fff",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginLeft: "auto",
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    border: "1.5px solid #e5e5e5",
    borderRadius: "4px",
    overflow: "hidden",
  },
  searchInput: {
    border: "none",
    outline: "none",
    padding: "8px 14px",
    fontSize: "13px",
    fontFamily: "'Poppins', sans-serif",
    background: "transparent",
    width: "200px",
  },
  searchBtn: {
    background: "#0a0a0a",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: "13px",
  },
  langBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    fontWeight: 700,
    padding: "7px 12px",
    border: "1.5px solid #e5e5e5",
    borderRadius: "4px",
    cursor: "pointer",
    letterSpacing: ".08em",
    background: "transparent",
    fontFamily: "'Poppins', sans-serif",
  },
  iconBtn: {
    width: "40px",
    height: "40px",
    border: "1.5px solid #e5e5e5",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    cursor: "pointer",
    position: "relative",
    background: "transparent",
  },
  cartBadge: {
    position: "absolute",
    top: "-6px",
    right: "-6px",
    width: "18px",
    height: "18px",
    background: "#0a0a0a",
    color: "#fff",
    borderRadius: "50%",
    fontSize: "9px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #fff",
  },
};
