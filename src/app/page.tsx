"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Data ──────────────────────────────────────────────────────────────────

const categories = [
  { name: "Packs", img: "/image/pack.webp", cta: "Shop now" },
  { name: "Protéines", img: "/image/b01d3b86-c8eb-4abb-9d8b-f8496b46c988_11zon.jpg", cta: "Voir plus" },
  { name: "Créatines", img: "/image/aed9e2d8-73b8-4b20-929e-a1184c185556_11zon.jpg", cta: "Voir plus" },
  { name: "Mass gainer", img: "/image/dd2b9a64-af74-44fa-b79e-bb541c64dc2a_11zon.jpg", cta: "Voir plus" },
  { name: "Pre-workout", img: "/image/ffe375b3-6f93-4e03-9a12-ad23f1fcfae1_11zon.jpg", cta: "Voir plus" },
  { name: "Vitamines", img: "/image/2c936458-3ea8-4c1e-8245-5b3aa22e87e1_11zon.jpg", cta: "Voir plus" },
];

const promoProducts = [
  {
    brand: "Muscle House DZ",
    name: "Pack Performance",
    price: "8 900 DA",
    old: "10 500 DA",
    img: "/image/pack.webp",
    badge: "sale",
    badgeLabel: "Promo",
  },
  {
    brand: "Brûleur",
    name: "Fat burner LIPO",
    price: "6 500 DA",
    old: "7 200 DA",
    img: "/image/lipo6.webp",
    badge: "sale",
    badgeLabel: "Promo",
  },
];

const latestProducts = [
  {
    brand: "Boisson",
    name: "Boisson énergétique",
    price: "1 200 DA",
    img: "/image/boisson.png",
    badge: "new",
    badgeLabel: "New",
  },
  {
    brand: "Snacks",
    name: "Barres protéinées",
    price: "900 DA",
    img: "/image/snacks.jpg",
    badge: "new",
    badgeLabel: "New",
  },
  {
    brand: "Acides aminés",
    name: "BCAA Recovery",
    price: "3 400 DA",
    img: "/image/acide-amine.jpg",
    badge: "new",
    badgeLabel: "New",
  },
  {
    brand: "Booster",
    name: "Pre-workout X",
    price: "4 900 DA",
    img: "/image/booster.jpg",
    badge: "new",
    badgeLabel: "New",
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────

function ProductCard({
  brand,
  name,
  price,
  old,
  img,
  badge,
  badgeLabel,
}: {
  brand: string;
  name: string;
  price: string;
  old?: string;
  img: string;
  badge: "new" | "sale";
  badgeLabel: string;
}) {
  return (
    <div style={s.productCard}>
      <div style={s.pcImg}>
        <div style={{ ...s.pcImgBg, backgroundImage: `url('${img}')` }} />
        <span
          style={{
            ...s.pcBadge,
            background: badge === "sale" ? "#ff3333" : "#0a0a0a",
          }}
        >
          {badgeLabel}
        </span>
      </div>
      <div style={s.pcBody}>
        <div style={s.pcBrand}>{brand}</div>
        <div style={s.pcName}>{name}</div>
        <div style={s.pcPriceWrap}>
          <div style={s.pcPrice}>{price}</div>
          {old && <div style={s.pcOld}>{old}</div>}
        </div>
        <button style={s.pcAdd}>
          <i className="fa fa-plus" /> Ajouter
        </button>
      </div>
    </div>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section style={s.hero} id="hero">
      <div style={s.slide}>
        <div
          style={{
            ...s.slideBg,
            backgroundImage: "url('/image/381511be-0146-4bc0-b5f0-e6983025f30e_11zon.jpg')",
          }}
        />
        <div style={s.slideOverlay} />
        <div style={s.slideContent}>
          <div style={s.slideBadge}>Performance authentique</div>
          <h1 style={s.slideTitle}>
            POUSSE TES LIMITES{" "}
            <em style={s.slideTitleEm}>LA PERFORMANCE COMMENCE ICI</em>
          </h1>
          <p style={s.slideDesc}>
            Muscle House DZ — Compléments 100% authentiques, livraison rapide
            dans les 48 wilayas, support direct WhatsApp.
          </p>
          <div style={s.slideBtns}>
            <a href="#categories" style={{ ...s.btn, ...s.btnWhite }}>
              Découvrir
            </a>
            <a href="#latest-products" style={{ ...s.btn, ...s.btnOutlineWhite }}>
              Nouveautés
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Anton&family=Poppins:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: #fff; color: #0a0a0a; font-family: 'Poppins', sans-serif; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #0a0a0a; }
        img { display: block; max-width: 100%; }
        a { text-decoration: none; color: inherit; }
      `}</style>

      <Navbar />

      <main>
        {/* HERO */}
        <Hero />

        {/* CATEGORIES */}
        <section style={{ ...s.section, background: "#f7f7f5" }} id="categories">
          <div style={s.container}>
            <div style={s.secHead}>
              <div>
                <div style={s.secEy}>Muscle House DZ</div>
                <div style={s.secTitle}>
                  Catégories <em style={s.secTitleEm}>phares</em>
                </div>
              </div>
              <div style={s.secLink}>
                Voir tout <i className="fa fa-arrow-right" />
              </div>
            </div>

            <div style={s.catsScroll}>
              {categories.map((cat) => (
                <div key={cat.name} style={s.catCard}>
                  <div style={s.catImg}>
                    <div
                      style={{
                        ...s.catImgBg,
                        backgroundImage: `url('${cat.img}')`,
                      }}
                    />
                  </div>
                  <div style={s.catBody}>
                    <div style={s.catName}>{cat.name}</div>
                    <div style={s.catCta}>
                      {cat.cta} <i className="fa fa-arrow-right" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROMOS */}
        <section style={s.section} id="soldes-section">
          <div style={s.container}>
            <div style={s.secHead}>
              <div>
                <div style={s.secEy}>Muscle House DZ</div>
                <div style={s.secTitle}>
                  Offres <em style={s.secTitleEm}>en cours</em>
                </div>
              </div>
              <div style={s.secLink}>
                Voir les promos <i className="fa fa-arrow-right" />
              </div>
            </div>
            <div style={s.prodsGrid}>
              {promoProducts.map((p) => (
                <ProductCard key={p.name} {...p} />
              ))}
            </div>
          </div>
        </section>

        {/* LATEST PRODUCTS */}
        <section
          style={{ ...s.section, background: "#f7f7f5" }}
          id="latest-products"
        >
          <div style={s.container}>
            <div style={s.secHead}>
              <div>
                <div style={s.secEy}>Nouveautés</div>
                <div style={s.secTitle}>
                  Derniers produits{" "}
                  <em style={s.secTitleEm}>Muscle House DZ</em>
                </div>
              </div>
              <div style={s.secLink}>
                Voir tout <i className="fa fa-arrow-right" />
              </div>
            </div>
            <div style={s.prodsGrid}>
              {latestProducts.map((p) => (
                <ProductCard key={p.name} {...p} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  // Layout
  section: { padding: "80px 0", background: "#fff" },
  container: { maxWidth: "1400px", margin: "0 auto", padding: "0 48px" },

  // Section header
  secHead: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: "48px",
    gap: "20px",
  },
  secEy: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: ".2em",
    color: "#555",
    textTransform: "uppercase",
    marginBottom: "8px",
  },
  secTitle: {
    fontFamily: "'Anton', sans-serif",
    fontSize: "clamp(36px, 4vw, 56px)",
    letterSpacing: ".02em",
    textTransform: "uppercase",
    lineHeight: 0.95,
  },
  secTitleEm: { color: "#555", fontStyle: "normal" },
  secLink: {
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: ".14em",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  // Hero
  hero: {
    position: "relative",
    height: "88vh",
    maxHeight: "720px",
    overflow: "hidden",
    background: "#0a0a0a",
  },
  slide: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
  },
  slideBg: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  slideOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(105deg,rgba(0,0,0,.75) 0%,rgba(0,0,0,.25) 60%,transparent 100%)",
  },
  slideContent: {
    position: "relative",
    zIndex: 1,
    padding: "0 80px",
    maxWidth: "700px",
  },
  slideBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255,255,255,.12)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,.2)",
    color: "#fff",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: ".2em",
    textTransform: "uppercase",
    padding: "7px 16px",
    borderRadius: "2px",
    marginBottom: "20px",
  },
  slideTitle: {
    fontFamily: "'Anton', sans-serif",
    fontSize: "clamp(56px, 8vw, 100px)",
    lineHeight: 0.92,
    letterSpacing: ".02em",
    color: "#fff",
    textTransform: "uppercase",
    marginBottom: "16px",
  },
  slideTitleEm: {
    display: "block",
    WebkitTextStroke: "2px rgba(255,255,255,.4)",
    color: "transparent",
    fontStyle: "normal",
  },
  slideDesc: {
    fontSize: "16px",
    color: "rgba(255,255,255,.75)",
    lineHeight: 1.6,
    marginBottom: "32px",
    maxWidth: "460px",
  },
  slideBtns: { display: "flex", gap: "12px" },
  btn: {
    padding: "14px 32px",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: ".1em",
    textTransform: "uppercase",
    borderRadius: "4px",
    cursor: "pointer",
    border: "2px solid transparent",
    fontFamily: "'Poppins', sans-serif",
    display: "inline-block",
  },
  btnWhite: { background: "#fff", color: "#0a0a0a" },
  btnOutlineWhite: {
    background: "transparent",
    borderColor: "rgba(255,255,255,.5)",
    color: "#fff",
  },

  // Categories
  catsScroll: {
    display: "flex",
    gap: "16px",
    overflowX: "auto",
    paddingBottom: "8px",
  },
  catCard: {
    flexShrink: 0,
    width: "200px",
    border: "1.5px solid #e5e5e5",
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "pointer",
    background: "#fff",
  },
  catImg: {
    height: "140px",
    background: "#f7f7f5",
    position: "relative",
    overflow: "hidden",
  },
  catImgBg: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.15,
  },
  catBody: { padding: "16px" },
  catName: {
    fontSize: "13px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: ".06em",
    marginBottom: "8px",
  },
  catCta: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: ".1em",
    textTransform: "uppercase",
    background: "#0a0a0a",
    color: "#fff",
    padding: "7px 12px",
    borderRadius: "3px",
  },

  // Product card
  productCard: {
    background: "#fff",
    border: "1.5px solid #e5e5e5",
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "pointer",
  },
  pcImg: {
    aspectRatio: "1",
    background: "#f7f7f5",
    position: "relative",
    overflow: "hidden",
  },
  pcImgBg: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  pcBadge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: ".1em",
    padding: "4px 10px",
    borderRadius: "3px",
    textTransform: "uppercase",
    color: "#fff",
  },
  pcBody: { padding: "16px 18px 18px" },
  pcBrand: {
    fontSize: "10px",
    fontWeight: 700,
    color: "#555",
    letterSpacing: ".14em",
    textTransform: "uppercase",
    marginBottom: "5px",
  },
  pcName: { fontSize: "14px", fontWeight: 700, lineHeight: 1.3, marginBottom: "10px" },
  pcPriceWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "14px",
  },
  pcPrice: {
    fontSize: "18px",
    fontWeight: 800,
    fontFamily: "'Anton', sans-serif",
    letterSpacing: ".04em",
  },
  pcOld: { fontSize: "13px", color: "#aaa", textDecoration: "line-through" },
  pcAdd: {
    width: "100%",
    padding: "11px",
    background: "#0a0a0a",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: ".1em",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  prodsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "16px",
  },
};
