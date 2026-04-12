'use client';

import { SectionSchema } from '../schema';
import TextInput from './FormFields/TextInput';
import NumberInput from './FormFields/NumberInput';
import TextArea from './FormFields/TextArea';
import ArrayInput from './FormFields/ArrayInput';
import ObjectInput from './FormFields/ObjectInput';

interface DynamicFormProps {
  schema: SectionSchema;
  data: object;
  onChange: (data: Record<string, unknown>) => void;
  nested?: boolean;
}

export default function DynamicForm({ schema, data, onChange, nested }: DynamicFormProps) {
  const safeData = data as Record<string, unknown>;
  const readString = (value: unknown) => (typeof value === 'string' ? value : '');
  const readNumber = (value: unknown) => (typeof value === 'number' ? value : 0);
  const readArray = (value: unknown) => (Array.isArray(value) ? value : []);
  const readObject = (value: unknown): Record<string, unknown> =>
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  const handleFieldChange = (key: string, value: unknown) => {
    onChange({
      ...safeData,
      [key]: value,
    });
  };

  const renderField = (key: string, fieldSchema: SectionSchema['fields'][string]) => {
    const value = safeData[key];

    switch (fieldSchema.type) {
      case 'string':
        return (
          <TextInput
            key={key}
            schema={fieldSchema}
            value={readString(value)}
            onChange={(v) => handleFieldChange(key, v)}
          />
        );

      case 'number':
        return (
          <NumberInput
            key={key}
            schema={fieldSchema}
            value={readNumber(value)}
            onChange={(v) => handleFieldChange(key, v)}
          />
        );

      case 'text':
        return (
          <TextArea
            key={key}
            schema={fieldSchema}
            value={readString(value)}
            onChange={(v) => handleFieldChange(key, v)}
          />
        );

      case 'array':
        return (
          <ArrayInput
            key={key}
            schema={fieldSchema}
            value={readArray(value)}
            onChange={(v) => handleFieldChange(key, v)}
          />
        );

      case 'object':
        return (
          <ObjectInput
            key={key}
            label={fieldSchema.label || key}
            value={readObject(value)}
            onChange={(v) => handleFieldChange(key, v)}
            description={fieldSchema.description}
            required={fieldSchema.required}
            properties={fieldSchema.properties}
          />
        );

      default:
        return (
          <div key={key} className="text-red-400 text-sm">
            不支持的字段类型: {fieldSchema.type}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {!nested && (
        <div className="border-b border-white/10 pb-4">
          <h3 className="text-lg font-semibold text-white">{schema.title}</h3>
          {schema.description && (
            <p className="text-sm text-white/50 mt-1">{schema.description}</p>
          )}
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(schema.fields).map(([key, fieldSchema]) => (
          <div key={key}>
            {renderField(key, fieldSchema)}
          </div>
        ))}
      </div>
    </div>
  );
}
