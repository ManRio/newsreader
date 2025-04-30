'use client';

import { usePathname } from 'next/navigation';
import NavBar from './NavBar';

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const hideNavbar = pathname === '/auth';

  return (
    <>
      {!hideNavbar && <NavBar />}
      <main className={!hideNavbar ? 'pt-14' : ''}>{children}</main>
    </>
  );
}
