'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  BookOpen,
  Bookmark,
  Newspaper,
  SlidersHorizontal,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import Image from 'next/image';

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState({
    username: '',
    avatar: '/default.png',
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data.username) {
          const formattedUser = {
            username: data.username,
            avatar:
              typeof data.avatar === 'string' && data.avatar.startsWith('/')
                ? `http://localhost:5000${data.avatar}`
                : data.avatar || '/default.png',
          };
          console.log('Avatar recibido:', formattedUser.avatar);
          setUser(formattedUser);
          localStorage.setItem('user', JSON.stringify(formattedUser));
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      }
    };

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth');
  };

  const isActive = (path) =>
    pathname === path ? 'text-cyan-400 font-semibold' : 'text-gray-200';

  const NavLinks = () => (
    <>
      <Link
        href='/feed'
        className={`flex items-center gap-1 ${isActive('/feed')}`}
      >
        <Newspaper size={18} />
        Feed
      </Link>
      <Link
        href='/history'
        className={`flex items-center gap-1 ${isActive('/history')}`}
      >
        <BookOpen size={18} />
        Historial
      </Link>
      <Link
        href='/saved'
        className={`flex items-center gap-1 ${isActive('/saved')}`}
      >
        <Bookmark size={18} />
        Guardados
      </Link>
      <Link
        href='/choose-interests'
        className={`flex items-center gap-1 ${isActive('/choose-interests')}`}
      >
        <SlidersHorizontal size={18} />
        Intereses
      </Link>
    </>
  );

  return (
    <nav className='h-16 px-4 md:px-6 fixed top-0 w-full z-50 bg-slate-800/80 backdrop-blur border-b border-slate-700 text-white flex justify-between items-center'>
      <div className='md:hidden'>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className='text-gray-200'
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className='hidden md:flex gap-6'>
        <NavLinks />
      </div>

      <div className='relative'>
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className='flex items-center gap-2 hover:text-cyan-400'
        >
          <Image
            src={user.avatar}
            alt='avatar'
            width={28}
            height={28}
            unoptimized
            className='rounded-full object-cover border'
          />
          <span className='hidden sm:block font-medium truncate max-w-[100px]'>
            {user.username}
          </span>
          <ChevronDown size={16} />
        </button>

        {userMenuOpen && (
          <div className='absolute right-0 mt-2 bg-slate-800 border border-slate-700 rounded shadow-md w-48 z-50 text-white'>
            <button
              onClick={() => router.push('/profile')}
              className='w-full text-left px-4 py-2 hover:bg-slate-700'
            >
              Mi perfil
            </button>
            <button
              onClick={() => router.push('/change-password')}
              className='w-full text-left px-4 py-2 hover:bg-slate-700'
            >
              Cambiar contraseña
            </button>
            <button
              onClick={handleLogout}
              className='w-full text-left px-4 py-2 text-red-400 hover:bg-slate-700'
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

      {mobileMenuOpen && (
        <div className='absolute top-16 left-0 w-full bg-slate-800 border-t border-slate-700 shadow-md flex flex-col gap-4 p-4 md:hidden z-40 text-white'>
          <NavLinks />
        </div>
      )}
    </nav>
  );
};

export default NavBar;
