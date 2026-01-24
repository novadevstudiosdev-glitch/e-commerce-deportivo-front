import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

type InputProps = {
  label: string;
  error?: string;
  rightElement?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className, id, rightElement, ...props }, ref) => {
    const inputId = id ?? props.name;
    const hasRight = Boolean(rightElement);

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900
            placeholder:text-slate-400 outline-none transition
            hover:border-slate-300
            focus:border-sky-600 focus:ring-4 focus:ring-sky-100
            ${hasRight ? "pr-12" : ""}
            ${error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200"}
            ${className ?? ""}`}
            {...props}
          />

          {hasRight && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>

        {error && (
          <span id={`${inputId}-error`} className="text-xs text-red-500">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
