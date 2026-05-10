'use client';

import { FieldSchema } from '../../schema';
import FieldWrapper from './FieldWrapper';

interface TextInputProps {
  schema: FieldSchema;
  value: string;
  onChange: (value: string) => void;
}

export default function TextInput({ schema, value, onChange }: TextInputProps) {
  return (
    <FieldWrapper label={schema.label} required={schema.required} description={schema.description}>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={schema.placeholder}
        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white 
                   placeholder:text-white/30 focus:outline-none focus:border-[#00d4aa]/50 
                   focus:ring-1 focus:ring-[#00d4aa]/50 transition-colors"
      />
    </FieldWrapper>
  );
}
