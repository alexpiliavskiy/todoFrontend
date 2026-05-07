'use client';
import { type TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={3}
          className={[
            'w-full rounded-lg border bg-slate-800 px-3 py-2.5 text-sm text-slate-100 resize-none',
            'placeholder:text-slate-500 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
            error ? 'border-red-500' : 'border-slate-600 hover:border-slate-500',
            className,
          ].join(' ')}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
export default Textarea;