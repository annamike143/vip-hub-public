// --- src/app/layout.js (THE DEFINITIVE CLEAN SERVER LAYOUT) ---
import "./globals.css";
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['600', '700'],
  display: 'swap',
});

// This is a SERVER component, so it can correctly handle metadata for the future.
export const metadata = {
  title: "VIP Mentorship Hub",
  description: "Exclusive training portal for Mike Salazar's VIP Team.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable}`}>
        {children}
      </body>
    </html>
  );
}