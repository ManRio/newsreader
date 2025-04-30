'use client';
import { useState } from 'react';

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(
        'http://localhost:5000/api/profile/change-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );
      const data = await res.json();
      if (res.ok) setMessage('Contraseña actualizada ✅');
      else setError(data.message || 'Error al actualizar contraseña');
    } catch {
      setError('Error de red');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-transparent p-6'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-md bg-white/10 border border-white/20 backdrop-blur rounded-xl p-6 sm:p-10 shadow-xl text-white'
      >
        <h1 className='text-2xl font-bold text-center mb-6'>
          Cambiar Contraseña 🔒
        </h1>

        {error && <p className='text-red-400 mb-2 text-center'>{error}</p>}
        {message && <p className='text-green-400 mb-2 text-center'>{message}</p>}

        <div className='space-y-4'>
          <div>
            <label className='block mb-1'>Contraseña actual</label>
            <input
              type='password'
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className='w-full p-2 rounded bg-white/20 border border-white/30 placeholder-gray-200 text-white'
            />
          </div>
          <div>
            <label className='block mb-1'>Nueva contraseña</label>
            <input
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className='w-full p-2 rounded bg-white/20 border border-white/30 placeholder-gray-200 text-white'
            />
          </div>
        </div>

        <button
          type='submit'
          className='w-full bg-cyan-600 hover:bg-cyan-700 text-white mt-6 py-2 rounded font-semibold transition'
        >
          Actualizar Contraseña
        </button>
      </form>
    </div>
  );
}