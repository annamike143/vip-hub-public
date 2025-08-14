// --- src/app/layout.js (THE DEFINITIVE HYBRID ARCHITECTURE) ---
import "./globals.css";
import { Inter, Poppins } from 'next/font/google';
import React from 'react';
import { AppProvider } from './providers'; // We will create this file next

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const poppins = Poppins({ subsets: ['latin'], variable: '--font-heading', weight: ['600', '700'] });

// This is a SERVER component, so it CAN export metadata.
export const metadata = {
  title: "VIP Mentorship Hub",
  description: "Exclusive training portal for Mike Salazar's VIP Team.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable}`}>
        {/* We wrap our children in the new 'AppProvider' client component */}
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}