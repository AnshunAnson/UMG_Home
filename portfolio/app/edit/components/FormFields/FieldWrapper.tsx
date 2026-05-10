import type { ReactNode } from 'react';

interface FieldWrapperProps {
  label: string;
  required?: boolean;
  description?: string;
  children: ReactNode;
}

export default function FieldWrapper({ label, required, description, children }: FieldWrapperProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/80">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {description && (
        <p className="text-xs text-white/50">{description}</p>
      )}
      {children}
    </div>
  );
}
