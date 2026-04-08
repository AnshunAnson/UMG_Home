'use client';

import { useState, useRef } from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Image, X } from 'lucide-react';
import { FieldSchema } from '../../schema';

interface ArrayInputProps {
  schema: FieldSchema;
  value: any[];
  onChange: (value: any[]) => void;
}

// 文件上传组件
function FileUpload({
  value,
  onChange,
  placeholder
}: {
  value: string;
  onChange: (value: string | ((prev: string) => string)) => void;
  placeholder?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const isDataUrl = value && value.startsWith('data:');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.name.endsWith('.gif')) {
      alert('请选择图片文件（支持 GIF、PNG、JPG）');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (value && value.includes('/')) {
        const lastSlash = value.lastIndexOf('/');
        formData.append('targetPath', value.substring(0, lastSlash + 1));
      }
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.src) {
        onChange(data.src);
      } else {
        alert(data.error || '上传失败');
      }
    } catch (err) {
      alert('上传出错：' + String(err));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      {isDataUrl ? (
        <div className="relative inline-block">
          <img src={value} alt="Preview" className="max-h-24 rounded border border-white/10" />
          <button
            onClick={handleClear}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500/80 rounded-full flex items-center justify-center
                     hover:bg-red-500 transition-colors"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-3 py-2 bg-[#00d4aa]/20 text-[#00d4aa] rounded
                     hover:bg-[#00d4aa]/30 transition-colors text-sm disabled:opacity-50"
          >
            <Image className="w-4 h-4" />
            {uploading ? '上传中...' : '选择文件'}
          </button>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || '或输入路径 /gifs/...'}
            draggable={false}
            onDragOver={(e) => e.stopPropagation()}
            onDragStart={(e) => e.stopPropagation()}
            onDragEnd={(e) => e.stopPropagation()}
            onDrop={(e) => e.stopPropagation()}
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm
                     placeholder:text-white/30 focus:outline-none focus:border-[#00d4aa]/50"
          />
        </div>
      )}
    </div>
  );
}

// 嵌套对象表单组件
function ObjectItemForm({ 
  itemSchema, 
  item, 
  onChange,
  title
}: { 
  itemSchema: Record<string, FieldSchema>; 
  item: any; 
  onChange: (value: any) => void;
  title?: string;
}) {
  const [expanded, setExpanded] = useState(true);
  
  const handleFieldChange = (key: string, value: any) => {
    onChange((prevItem: any) => {
      const resolvedValue = typeof value === 'function' ? value(prevItem) : value;
      return {
        ...prevItem,
        [key]: resolvedValue
      };
    });
  };

  // 生成摘要信息
  const getSummary = () => {
    const parts: string[] = [];
    if (item?.title) parts.push(item.title);
    if (item?.name) parts.push(item.name);
    if (item?.company) parts.push(item.company);
    if (item?.images?.length) parts.push(`${item.images.length} 张图片`);
    return parts.join(' · ') || '未命名项目';
  };

  const renderNestedField = (key: string, fieldSchema: FieldSchema) => {
    const value = item?.[key] ?? '';
    
    switch (fieldSchema.type) {
      case 'string':
      case 'text':
        // 检查是否是图片路径字段
        if (key === 'src' || key.includes('image') || key.includes('path')) {
          return (
            <div key={key} className="space-y-1">
              <span className="text-xs text-white/50">{fieldSchema.label}</span>
              <FileUpload
                value={value}
                onChange={(v) => handleFieldChange(key, v)}
                placeholder={fieldSchema.placeholder}
              />
            </div>
          );
        }
        return (
          <div key={key} className="grid grid-cols-3 gap-2 items-center">
            <span className="text-xs text-white/50">{fieldSchema.label}</span>
            <input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              draggable={false}
              onDragOver={(e) => e.stopPropagation()}
              onDragStart={(e) => e.stopPropagation()}
              onDragEnd={(e) => e.stopPropagation()}
              onDrop={(e) => e.stopPropagation()}
              className="col-span-2 px-3 py-1 bg-white/5 border border-white/10 rounded text-white 
                       placeholder:text-white/30 focus:outline-none focus:border-[#00d4aa]/50 text-sm"
              placeholder={fieldSchema.placeholder}
            />
          </div>
        );
      case 'number':
        return (
          <div key={key} className="grid grid-cols-3 gap-2 items-center">
            <span className="text-xs text-white/50">{fieldSchema.label}</span>
            <input
              type="number"
              value={value}
              onChange={(e) => handleFieldChange(key, Number(e.target.value))}
              draggable={false}
              onDragOver={(e) => e.stopPropagation()}
              onDragStart={(e) => e.stopPropagation()}
              onDragEnd={(e) => e.stopPropagation()}
              onDrop={(e) => e.stopPropagation()}
              className="col-span-2 px-3 py-1 bg-white/5 border border-white/10 rounded text-white 
                       placeholder:text-white/30 focus:outline-none focus:border-[#00d4aa]/50 text-sm"
              placeholder={fieldSchema.placeholder}
            />
          </div>
        );
      case 'array':
        const isImageArray = key === 'images' || fieldSchema.label?.includes('图片') || fieldSchema.label?.includes('GIF');
        return (
          <div key={key} className={`border rounded p-3 mt-2 ${isImageArray ? 'border-[#00d4aa]/30 bg-[#00d4aa]/5' : 'border-white/10'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs ${isImageArray ? 'text-[#00d4aa]' : 'text-white/70'}`}>
                {fieldSchema.label}
                {isImageArray && <span className="ml-1 text-white/50">({(item?.[key] || []).length})</span>}
              </span>
              <button
                onClick={() => {
                  const currentArray = item?.[key] || [];
                  const newItem = fieldSchema.itemType === 'object' ? {} : '';
                  handleFieldChange(key, [...currentArray, newItem]);
                }}
                className="text-xs px-2 py-1 bg-[#00d4aa]/20 text-[#00d4aa] rounded hover:bg-[#00d4aa]/30"
              >
                + 添加
              </button>
            </div>
            {(item?.[key] || []).map((subItem: any, subIndex: number) => (
              <div key={subIndex} className="flex items-start gap-2 mb-2 p-2 bg-white/5 rounded">
                {fieldSchema.itemType === 'object' && fieldSchema.itemSchema ? (
                  <div className="flex-1 space-y-2">
                    {Object.entries(fieldSchema.itemSchema).map(([subKey, subFieldSchema]) => {
                      const subValue = subItem?.[subKey] ?? '';
                      // 图片路径字段使用文件上传
                      if (subKey === 'src' || subKey.includes('image') || subKey.includes('path')) {
                        return (
                          <div key={subKey} className="space-y-1">
                            <span className="text-xs text-white/40">{subFieldSchema.label}</span>
                            <FileUpload
                              value={subValue}
                              onChange={(v) => {
                                handleFieldChange(key, (prev: any) => {
                                  const arr = prev?.[key] || [];
                                  return arr.map((img: any, i: number) =>
                                    i === subIndex ? { ...img, [subKey]: v } : img
                                  );
                                });
                              }}
                              placeholder={subFieldSchema.placeholder}
                            />
                          </div>
                        );
                      }
                      return (
                        <div key={subKey} className="grid grid-cols-4 gap-1 items-center">
                          <span className="text-xs text-white/40">{subFieldSchema.label}</span>
                          <input
                            type="text"
                            value={subValue}
                            onChange={(e) => {
                              handleFieldChange(key, (prev: any) => {
                                const arr = prev?.[key] || [];
                                return arr.map((img: any, i: number) =>
                                  i === subIndex ? { ...img, [subKey]: e.target.value } : img
                                );
                              });
                            }}
                            draggable={false}
                            onDragOver={(e) => e.stopPropagation()}
                            onDragStart={(e) => e.stopPropagation()}
                            onDragEnd={(e) => e.stopPropagation()}
                            onDrop={(e) => e.stopPropagation()}
                            className="col-span-3 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm"
                            placeholder={subFieldSchema.placeholder}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={subItem || ''}
                    onChange={(e) => {
                      handleFieldChange(key, (prev: any) => {
                        const arr = prev?.[key] || [];
                        return arr.map((item: any, i: number) =>
                          i === subIndex ? e.target.value : item
                        );
                      });
                    }}
                    draggable={false}
                    onDragOver={(e) => e.stopPropagation()}
                    onDragStart={(e) => e.stopPropagation()}
                    onDragEnd={(e) => e.stopPropagation()}
                    onDrop={(e) => e.stopPropagation()}
                    className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm"
                  />
                )}
                <button
                  onClick={() => {
                    handleFieldChange(key, (prev: any) => {
                      const arr = prev?.[key] || [];
                      return arr.filter((_: any, i: number) => i !== subIndex);
                    });
                  }}
                  className="text-white/30 hover:text-red-400 text-xs p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {(item?.[key] || []).length === 0 && (
              <p className="text-xs text-white/30 italic py-2">
                {isImageArray ? '暂无图片，点击"添加"上传' : '暂无项目'}
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-white/70 hover:text-white w-full"
      >
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        <span className="truncate">{getSummary()}</span>
      </button>
      {expanded && (
        <div className="space-y-3 pl-2 border-l-2 border-white/10">
          {Object.entries(itemSchema).map(([key, fieldSchema]) => renderNestedField(key, fieldSchema))}
        </div>
      )}
    </div>
  );
}

export default function ArrayInput({ schema, value = [], onChange }: ArrayInputProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<'before' | 'after' | null>(null);

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
    if (typeof itemValue === 'function') {
      const newValue = [...value];
      newValue[index] = itemValue(newValue[index]);
      onChange(newValue);
    } else {
      const newValue = [...value];
      newValue[index] = itemValue;
      onChange(newValue);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDragOverIndex(null);
      setDragOverPosition(null);
      return;
    }
    
    if (!e.dataTransfer.types || !e.dataTransfer.types.includes('text/plain')) {
      return;
    }
    
    if (e.dataTransfer.effectAllowed !== 'move' && e.dataTransfer.effectAllowed !== 'copy') {
      return;
    }
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position = e.clientY < midY ? 'before' : 'after';
    
    setDragOverIndex(index);
    setDragOverPosition(position);
    
    e.preventDefault();
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
    setDragOverPosition(null);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      setDragOverPosition(null);
      return;
    }
    
    const newValue = [...value];
    const draggedItem = newValue[draggedIndex];
    newValue.splice(draggedIndex, 1);
    
    // 根据放置位置计算新索引
    let newIndex = index;
    if (draggedIndex < index && dragOverPosition === 'before') {
      newIndex = index - 1;
    } else if (draggedIndex > index && dragOverPosition === 'after') {
      newIndex = index + 1;
    }
    newIndex = Math.max(0, Math.min(newIndex, newValue.length));
    
    newValue.splice(newIndex, 0, draggedItem);
    onChange(newValue);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDragOverPosition(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDragOverPosition(null);
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

      <div className="space-y-1">
        {value.map((item, index) => (
          <div key={index} className="relative">
            {/* 上方放置指示器 */}
            {dragOverIndex === index && dragOverPosition === 'before' && draggedIndex !== index && (
              <div className="absolute -top-1 left-0 right-0 h-1 bg-[#00d4aa] rounded-full z-10 
                            shadow-[0_0_10px_rgba(0,212,170,0.8)]" />
            )}
            
            <div
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-start gap-2 p-3 bg-white/5 rounded-lg border transition-all
                         ${draggedIndex === index 
                           ? 'opacity-50 border-white/5' 
                           : 'border-white/10 hover:border-white/20'
                         }
                         ${dragOverIndex === index && draggedIndex !== index 
                           ? 'bg-[#00d4aa]/5' 
                           : ''
                         }`}
            >
              <div className="mt-1 cursor-move text-white/30 hover:text-[#00d4aa] select-none 
                            transition-colors"
                   draggable
                   onDragStart={(e) => {
                     e.stopPropagation();
                     e.dataTransfer.setData('text/plain', index.toString());
                     setDraggedIndex(index);
                   }}>
                <GripVertical className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                {schema.itemType === 'string' ? (
                  <input
                    type="text"
                    value={item || ''}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    draggable={false}
                    onDragOver={(e) => e.stopPropagation()}
                    onDragStart={(e) => e.stopPropagation()}
                    onDragEnd={(e) => e.stopPropagation()}
                    onDrop={(e) => e.stopPropagation()}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white 
                             placeholder:text-white/30 focus:outline-none focus:border-[#00d4aa]/50"
                    placeholder={`项目 ${index + 1}`}
                  />
                ) : schema.itemType === 'object' && schema.itemSchema ? (
                  <ObjectItemForm
                    itemSchema={schema.itemSchema}
                    item={item}
                    onChange={(newItem) => handleItemChange(index, newItem)}
                  />
                ) : null}
              </div>

              <button
                onClick={() => handleRemove(index)}
                className="mt-1 p-1 text-white/30 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            {/* 下方放置指示器 */}
            {dragOverIndex === index && dragOverPosition === 'after' && draggedIndex !== index && (
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-[#00d4aa] rounded-full z-10 
                            shadow-[0_0_10px_rgba(0,212,170,0.8)]" />
            )}
          </div>
        ))}
      </div>

      {value.length === 0 && (
        <p className="text-sm text-white/30 italic">暂无项目，点击"添加"按钮</p>
      )}
    </div>
  );
}
