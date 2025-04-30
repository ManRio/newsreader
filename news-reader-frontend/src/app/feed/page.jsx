'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FeedPage() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchNews = async () => {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/auth');

      try {
        const res = await fetch('http://localhost:5000/api/news', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Error al cargar noticias');
        const data = await res.json();
        setArticles(data.articles);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las noticias.');
      }
    };

    fetchNews();
  }, [router]);

  const handleSaveArticle = async (url) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/news/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ articleId: url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al guardar');
      alert('Artículo guardado correctamente ✅');
    } catch (err) {
      console.error(err);
      alert('Error al guardar artículo');
    }
  };

  if (error) {
    return (
      <div className='flex justify-center items-center h-screen text-red-600 font-semibold'>
        {error}
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-transparent backdrop-blur p-6'>
      <h1 className='text-3xl font-bold mb-6 text-center text-white'>
        Tu Feed de Noticias 📰
      </h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {articles.length === 0 ? (
          <p className='text-center col-span-3 text-gray-400'>
            Cargando noticias...
          </p>
        ) : (
          articles.map((article, index) => (
            <div
              key={index}
              className='rounded-xl bg-white/10 border border-white/20 backdrop-blur p-4 flex flex-col shadow-md transition hover:scale-[1.02]'
            >
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className='w-full h-48 object-cover rounded-md mb-4'
                />
              )}
              <h2 className='text-lg font-semibold text-white line-clamp-2 mb-2'>
                {article.title}
              </h2>
              <p className='text-sm text-gray-300 mb-4 line-clamp-3'>
                {article.description || 'Sin descripción disponible.'}
              </p>
              <div className='flex justify-between items-center mt-auto'>
                <a
                  href={article.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={() => {
                    const token = localStorage.getItem('token');
                    if (!token) return;
                    fetch('http://localhost:5000/api/news/history', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ articleId: article.url }),
                    }).catch((err) =>
                      console.error('Error al guardar historial:', err)
                    );
                  }}
                  className='text-cyan-400 hover:underline text-sm'
                >
                  Leer más →
                </a>
                <button
                  onClick={() => handleSaveArticle(article.url)}
                  className='bg-cyan-600 text-white px-3 py-1 text-xs rounded-full hover:bg-cyan-700 transition'
                >
                  Guardar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
