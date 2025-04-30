import ClientWrapper from '@/components/ClientWrapper';
import Footer from '@/components/Footer';
import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata = {
  title: 'News Reader',
  description: 'Lector de noticias personalizadas con IA',
};

export default function RootLayout({ children }) {
  return (
    <html lang='es'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100`}
      >
        <ClientWrapper>
          <div className='min-h-screen pt-16 flex flex-col'>
            <main className='flex-1'>{children}</main>
            <Footer />
          </div>
        </ClientWrapper>
      </body>
    </html>
  );
}
