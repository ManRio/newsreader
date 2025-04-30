'use client';
import { useEffect, useState } from 'react';
import ImageWithFallback from '@/components/ImageWithFallback';

export default function ProfilePage() {
  const [user, setUser] = useState({
    username: '',
    email: '',
    avatar: '/default.png',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const formatted = {
            username: data.username || '',
            email: data.email || '',
            avatar:
              typeof data.avatar === 'string' && data.avatar.startsWith('/')
                ? `http://localhost:5000${data.avatar}`
                : data.avatar || '/default.png',
          };
          setUser(formatted);
        } else {
          setError(data.message || 'Error al cargar perfil');
        }
      } catch {
        setError('Error de red');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    setError('');
    setMessage('');

    try {
      const resProfile = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: user.username,
          email: user.email,
        }),
      });

      const profileData = await resProfile.json();
      if (!resProfile.ok) {
        setError(profileData.message || 'Error actualizando perfil');
        return;
      }

      let avatarURL = profileData.avatar;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('avatar', selectedFile);

        const resAvatar = await fetch(
          'http://localhost:5000/api/profile/upload-avatar',
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        const avatarData = await resAvatar.json();
        if (!resAvatar.ok) {
          setError(avatarData.message || 'Error al subir avatar');
          return;
        }

        avatarURL = avatarData.avatar;
      }

      const updated = {
        username: profileData.username || '',
        email: profileData.email || '',
        avatar:
          typeof avatarURL === 'string' && avatarURL.startsWith('/')
            ? `http://localhost:5000${avatarURL}`
            : avatarURL || '/default.png',
      };

      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setMessage('Perfil actualizado ✅');
    } catch {
      setError('Error de red');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-transparent p-6'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-lg bg-white/10 border border-white/20 backdrop-blur rounded-xl p-6 sm:p-10 shadow-xl text-white'
      >
        <h1 className='text-2xl font-bold text-center mb-6'>Tu Perfil 👤</h1>

        {error && <p className='text-red-400 mb-2 text-center'>{error}</p>}
        {message && (
          <p className='text-green-400 mb-2 text-center'>{message}</p>
        )}

        <div className='flex justify-center mb-4'>
          <ImageWithFallback
            src={user.avatar}
            alt='Avatar'
            width={100}
            height={100}
            className='rounded-full border object-cover'
          />
        </div>

        <div className='space-y-4'>
          <div>
            <label className='block mb-1'>Usuario</label>
            <input
              type='text'
              name='username'
              value={user.username}
              onChange={handleChange}
              className='w-full p-2 rounded bg-white/20 border border-white/30 placeholder-gray-200 text-white'
              required
            />
          </div>
          <div>
            <label className='block mb-1'>Email</label>
            <input
              type='email'
              name='email'
              value={user.email}
              onChange={handleChange}
              className='w-full p-2 rounded bg-white/20 border border-white/30 placeholder-gray-200 text-white'
              required
            />
          </div>
          <div>
            <label className='block mb-1'>Avatar</label>
            <input
              type='file'
              accept='image/*'
              onChange={handleFileChange}
              className='w-full p-2 rounded bg-white/20 border border-white/30 text-white file:bg-cyan-600 file:text-white file:rounded file:border-none'
            />
          </div>
        </div>

        <button
          type='submit'
          className='w-full bg-cyan-600 hover:bg-cyan-700 text-white mt-6 py-2 rounded font-semibold transition'
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
