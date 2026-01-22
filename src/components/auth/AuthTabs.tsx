type Props = {
  mode: 'login' | 'register';
  onChange: (mode: 'login' | 'register') => void;
};

export default function AuthTabs({ mode, onChange }: Props) {
  return (
    <div className="mt-6 flex rounded-full bg-slate-100 p-1">
      <button
        onClick={() => onChange('login')}
        className={`flex-1 rounded-full py-2 text-sm font-semibold transition
          ${
            mode === 'login'
              ? 'bg-white text-sky-600 shadow'
              : 'text-slate-500 hover:text-slate-700'
          }`}
      >
        Iniciar sesión
      </button>

      <button
        onClick={() => onChange('register')}
        className={`flex-1 rounded-full py-2 text-sm font-semibold transition
          ${
            mode === 'register'
              ? 'bg-white text-sky-600 shadow'
              : 'text-slate-500 hover:text-slate-700'
          }`}
      >
        Registrarse
      </button>
    </div>
  );
}
