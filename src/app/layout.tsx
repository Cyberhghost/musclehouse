import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Muscle House DZ',
  description: 'Votre boutique de suppléments sportifs en Algérie',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
