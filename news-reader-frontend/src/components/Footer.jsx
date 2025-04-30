const Footer = () => {
  return (
    <footer className='bg-slate-900 text-gray-400 text-sm text-center py-6 border-t border-slate-700'>
      <p>
        &copy; {new Date().getFullYear()} News Reader — Todos los derechos
        reservados.
      </p>
      <div className='mt-2 flex justify-center gap-4 flex-wrap text-xs'>
        <a
          href='https://github.com/ManRio/newsreader'
          target='_blank'
          rel='noopener noreferrer'
          className='hover:text-cyan-400'
        >
          GitHub
        </a>
        <a href='mailto:manureina87@gmail.com' className='hover:text-cyan-400'>
          Contacto
        </a>
        <a href='/legal' className='hover:text-cyan-400'>
          Aviso Legal
        </a>
      </div>
    </footer>
  );
};

export default Footer;
