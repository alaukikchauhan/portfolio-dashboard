'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './globals.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      router.push('/auth');
    }
  }, [router]);

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
