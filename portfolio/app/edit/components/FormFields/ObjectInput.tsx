'use client';

import React from 'react';
import DynamicForm from '../DynamicForm';
import { SectionSchema, FieldSchema } from '../../schema';

interface ObjectInputProps {
  label: string;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
  description?: string;
  required?: boolean;
  properties?: Record<string, FieldSchema>;
}

export default function ObjectInput({
  label,
  value,
  onChange,
  description,
  required,
  properties = {}
}: ObjectInputProps) {
  // 构建内部schema用于DynamicForm
  const objectSchema: SectionSchema = {
    title: label,
    fields: properties
  };

  return (
    <div className="space-y-3">
      <label className="text-sm text-[#8a8a8a] flex items-center gap-1">
        {label}
        {required && <span className="text-[#00d4aa]">*</span>}
      </label>
      {description && (
        <p className="text-xs text-[#5a5a5a]">{description}</p>
      )}
      <div className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
        <DynamicForm
          schema={objectSchema}
          data={value || {}}
          onChange={onChange}
          nested
        />
      </div>
    </div>
  );
}
