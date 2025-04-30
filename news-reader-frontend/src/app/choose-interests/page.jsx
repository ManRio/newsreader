'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Monitor,
  Briefcase,
  Dumbbell,
  FlaskConical,
  HeartPulse,
  Clapperboard,
  Landmark,
  Plane,
  Utensils,
} from 'lucide-react';

const iconMap = {
  technology: Monitor,
  business: Briefcase,
  sports: Dumbbell,
  science: FlaskConical,
  health: HeartPulse,
  entertainment: Clapperboard,
  politics: Landmark,
  travel: Plane,
  food: Utensils,
};

const interesesDisponibles = Object.keys(iconMap);

export default function ChooseInterestsPage() {
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleToggle = (interest) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    if (!token) return router.push('/auth');

    try {
      const res = await fetch('http://localhost:5000/api/news/interests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ interests: selected }),
      });

      const data = await res.json();
      if (!res.ok)
        return setError(data.message || 'Error al guardar intereses');

      router.push('/feed');
    } catch (err) {
      console.error(err);
      setError('Error del servidor');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white p-6 sm:p-10 rounded-2xl shadow-2xl'
      >
        <h1 className='text-3xl font-bold text-center mb-6'>
          Selecciona tus Intereses 🧠
        </h1>

        {error && <p className='text-red-400 text-center mb-4'>{error}</p>}

        <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6'>
          {interesesDisponibles.map((interest) => {
            const Icon = iconMap[interest];
            const isSelected = selected.includes(interest);

            return (
              <motion.div
                key={interest}
                onClick={() => handleToggle(interest)}
                whileTap={{ scale: 0.95 }}
                className={`rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center text-center border transition-all duration-200 ${
                  isSelected
                    ? 'bg-cyan-600/80 text-white border-cyan-400 shadow-xl'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
              >
                <Icon size={28} />
                <span className='mt-2 text-sm font-medium capitalize'>
                  {interest}
                </span>
              </motion.div>
            );
          })}
        </div>

        <button
          type='submit'
          disabled={selected.length === 0}
          className={`w-full py-3 rounded-lg text-white font-bold transition ${
            selected.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-cyan-600 hover:bg-cyan-700'
          }`}
        >
          Guardar intereses
        </button>
      </form>
    </div>
  );
}
