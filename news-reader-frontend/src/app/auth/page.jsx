'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DynamicBackground from '@/components/DynamicBackground';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const url = isLogin
        ? 'http://localhost:5000/api/login'
        : 'http://localhost:5000/api/register';

      const body = isLogin
        ? { email, password }
        : { username, email, password };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error');
        return;
      }

      if (isLogin) {
        localStorage.setItem('token', data.token);
        router.push('/feed');
      } else {
        alert('Registro exitoso, ahora inicia sesión.');
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err);
      setError('Error de servidor.');
    }
  };

  return (
    <div className='relative min-h-screen bg-[#0f0c29] overflow-hidden flex items-center justify-center'>
      <DynamicBackground />

      <div className='relative z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between p-6 md:p-12'>
        {/* Columna de presentación */}
        <div className='w-full md:w-1/2 text-white space-y-6 mb-10 md:mb-0'>
          <h1 className='text-4xl sm:text-5xl font-bold leading-tight'>
            Tu lector de noticias personalizado
          </h1>
          <p className='text-gray-300'>
            Explora artículos según tus intereses, guarda tus favoritos y
            mantente siempre informado con una interfaz moderna y adaptable.
          </p>
          <ul className='text-gray-400 space-y-1 text-sm'>
            <li>✅ IA para personalizar el contenido</li>
            <li>✅ Historial y guardados</li>
            <li>✅ Perfil editable y seguro</li>
          </ul>
        </div>

        {/* Columna del formulario */}
        <form
          onSubmit={handleSubmit}
          className='w-full md:w-[400px] bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl text-white space-y-6'
        >
          <h2 className='text-2xl font-semibold text-center'>
            {isLogin ? 'Inicia Sesión' : 'Regístrate'}
          </h2>

          {error && <p className='text-red-400 text-center text-sm'>{error}</p>}

          {!isLogin && (
            <div>
              <label className='text-sm font-medium'>Usuario</label>
              <input
                type='text'
                className='w-full p-2 mt-1 bg-white/20 border border-white/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className='text-sm font-medium'>Email</label>
            <input
              type='email'
              className='w-full p-2 mt-1 bg-white/20 border border-white/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className='text-sm font-medium'>Contraseña</label>
            <input
              type='password'
              className='w-full p-2 mt-1 bg-white/20 border border-white/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type='submit'
            className='w-full bg-cyan-600 hover:bg-cyan-700 transition text-white font-bold py-2 rounded mt-2'
          >
            {isLogin ? 'Entrar' : 'Registrarme'}
          </button>

          <div className='text-center text-sm mt-3'>
            <button
              type='button'
              className='text-indigo-300 hover:underline'
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? '¿No tienes cuenta? Regístrate'
                : '¿Ya tienes cuenta? Inicia sesión'}
            </button>

            <p className='mt-2 text-xs text-gray-400'>
              ¿Olvidaste tu contraseña?{' '}
              <span
                className='cursor-pointer text-indigo-300 hover:underline'
                onClick={() =>
                  alert('Función de recuperación aún no disponible')
                }
              >
                Recuperar
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
