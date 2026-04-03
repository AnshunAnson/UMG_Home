'use client';

import { FieldSchema } from '../../schema';

interface TextInputProps {
  schema: FieldSchema;
  value: string;
  onChange: (value: string) => void;
}

export default function TextInput({ schema, value, onChange }: TextInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/80">
        {schema.label}
        {schema.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {schema.description && (
        <p className="text-xs text-white/50">{schema.description}</p>
      )}
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={schema.placeholder}
        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white 
                   placeholder:text-white/30 focus:outline-none focus:border-[#00d4aa]/50 
                   focus:ring-1 focus:ring-[#00d4aa]/50 transition-colors"
      />
    </div>
  );
}
