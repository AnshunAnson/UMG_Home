'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { FieldSchema } from '../../schema';
import TextInput from './TextInput';

interface ArrayInputProps {
  schema: FieldSchema;
  value: any[];
  onChange: (value: any[]) => void;
}

export default function ArrayInput({ schema, value = [], onChange }: ArrayInputProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAdd = () => {
    const newItem = schema.itemType === 'object' 
      ? {} 
      : '';
    onChange([...value, newItem]);
  };

  const handleRemove = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const handleItemChange = (index: number, itemValue: any) => {
    const newValue = [...value];
    newValue[index] = itemValue;
    onChange(newValue);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newValue = [...value];
    const draggedItem = newValue[draggedIndex];
    newValue.splice(draggedIndex, 1);
    newValue.splice(index, 0, draggedItem);
    onChange(newValue);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-white/80">
          {schema.label}
          {schema.required && <span className="text-red-400 ml-1">*</span>}
        </label>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-[#00d4aa]/20 text-[#00d4aa] 
                     rounded-lg hover:bg-[#00d4aa]/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加
        </button>
      </div>
      
      {schema.description && (
        <p className="text-xs text-white/50">{schema.description}</p>
      )}

      <div className="space-y-2">
        {value.map((item, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-start gap-2 p-3 bg-white/5 rounded-lg border border-white/10 
                       ${draggedIndex === index ? 'opacity-50' : ''}`}
          >
            <div className="mt-1 cursor-move text-white/30 hover:text-white/50">
              <GripVertical className="w-4 h-4" />
            </div>
            
            <div className="flex-1">
              {schema.itemType === 'string' ? (
                <input
                  type="text"
                  value={item || ''}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white 
                           placeholder:text-white/30 focus:outline-none focus:border-[#00d4aa]/50"
                  placeholder={`项目 ${index + 1}`}
                />
              ) : schema.itemType === 'object' && schema.itemSchema ? (
                <div className="space-y-2">
                  {Object.entries(schema.itemSchema).map(([key, fieldSchema]) => (
                    <div key={key} className="grid grid-cols-3 gap-2 items-center">
                      <span className="text-xs text-white/50">{fieldSchema.label}</span>
                      <input
                        type="text"
                        value={item[key] || ''}
                        onChange={(e) => handleItemChange(index, { ...item, [key]: e.target.value })}
                        className="col-span-2 px-3 py-1 bg-white/5 border border-white/10 rounded text-white 
                                 placeholder:text-white/30 focus:outline-none focus:border-[#00d4aa]/50 text-sm"
                        placeholder={fieldSchema.placeholder}
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <button
              onClick={() => handleRemove(index)}
              className="mt-1 p-1 text-white/30 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {value.length === 0 && (
        <p className="text-sm text-white/30 italic">暂无项目，点击"添加"按钮</p>
      )}
    </div>
  );
}
