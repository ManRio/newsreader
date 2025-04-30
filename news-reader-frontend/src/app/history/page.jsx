'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/auth');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/news/history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        setHistory(data.read_history);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar tu historial.');
      }
    };

    fetchHistory();
  }, [router]);

  return (
    <div className='min-h-screen bg-transparent backdrop-blur p-6'>
      <h1 className='text-3xl font-bold text-center mb-8'>
        Historial de Lectura 📚
      </h1>

      {error && <p className='text-center text-red-600'>{error}</p>}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {history.length === 0 ? (
          <p className='col-span-3 text-center'>
            No has leído ningún artículo aún.
          </p>
        ) : (
          history.map((url, index) => (
            <div
              key={index}
              className='rounded-xl bg-white/10 border border-white/20 backdrop-blur p-4 flex flex-col shadow-md transition hover:scale-[1.02]'
            >
              <img
                src={`https://www.google.com/s2/favicons?domain=${
                  new URL(url).hostname
                }&sz=128`}
                alt='preview'
                className='w-full h-32 object-contain bg-gray-100'
              />
              <div className='p-4 flex flex-col flex-1 justify-between'>
                <p className='text-sm text-gray-700 mb-2 truncate'>{url}</p>
                <a
                  href={url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 font-semibold hover:underline mt-auto'
                >
                  Leer de nuevo →
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
