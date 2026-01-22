type InputProps = {
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
};

export default function Input({ label, placeholder, type = 'text', required = false }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900
                   placeholder:text-slate-400 outline-none transition
                   hover:border-slate-300
                   focus:border-sky-600 focus:ring-4 focus:ring-sky-100"
      />
    </div>
  );
}
