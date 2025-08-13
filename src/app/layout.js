// --- src/app/layout.js (The Clean, Correct Version) ---
import "./globals.css";
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const poppins = Poppins({ subsets: ['latin'], variable: '--font-heading', weight: ['600', '700'] });

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