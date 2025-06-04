import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';

const robotoMono = Roboto({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Github AI Estimator Agent',
  description: 'Welcome to Github AI Estimator Agent!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${robotoMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
