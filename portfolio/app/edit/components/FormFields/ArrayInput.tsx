'use client';

import NextImage from 'next/image';
import { useRef, useState } from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Image as ImageIcon, X } from 'lucide-react';
import { FieldSchema } from '../../schema';

type ObjectItem = Record<string, unknown>;
type ArrayItem = string | ObjectItem;

interface ArrayInputProps {
  schema: FieldSchema;
  value: ArrayItem[];
  onChange: (value: ArrayItem[]) => void;
}

function asObjectItem(value: unknown): ObjectItem {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as ObjectItem) : {};
}

function asArrayItems(value: unknown): ArrayItem[] {
  return Array.isArray(value) ? (value as ArrayItem[]) : [];
}

function asText(value: unknown) {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return String(value);
  }
  return '';
}

function FileUpload({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const isDataUrl = value.startsWith('data:');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/') && !file.name.endsWith('.gif')) {
      alert('请选择图片文件（支持 GIF、PNG、JPG）');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (value.includes('/')) {
        const lastSlash = value.lastIndexOf('/');
        formData.append('targetPath', value.substring(0, lastSlash + 1));
      }

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data: { success?: boolean; src?: string; error?: string } = await res.json();

      if (data.success && data.src) {
        onChange(data.src);
      } else {
        alert(data.error || '上传失败');
      }
    } catch (error) {
      alert(`上传出错：${String(error)}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
          <NextImage
            src={value}
            alt="预览图"
            width={96}
            height={96}
            unoptimized
            className="max-h-24 w-auto rounded border border-white/10"
          />
          <button
            onClick={() => {
              onChange('');
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/80 transition-colors hover:bg-red-500"
          >
            <X className="h-3 w-3 text-white" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded px-3 py-2 text-sm text-[#00d4aa] transition-colors hover:bg-[#00d4aa]/30 disabled:opacity-50"
          >
            <ImageIcon className="h-4 w-4" />
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
            className="flex-1 rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#00d4aa]/50 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}

function ObjectItemForm({
  itemSchema,
  item,
  onChange,
}: {
  itemSchema: Record<string, FieldSchema>;
  item: ObjectItem;
  onChange: (value: ObjectItem) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  const handleFieldChange = (key: string, value: unknown) => {
    onChange({
      ...item,
      [key]: value,
    });
  };

  const getSummary = () => {
    const parts: string[] = [];
    if (typeof item.title === 'string') parts.push(item.title);
    if (typeof item.name === 'string') parts.push(item.name);
    const images = asArrayItems(item.images);
    if (images.length) parts.push(`${images.length} 张图片`);
    return parts.join(' · ') || '未命名项目';
  };

  const renderNestedField = (key: string, fieldSchema: FieldSchema) => {
    const rawValue = item[key];

    if (fieldSchema.type === 'string' || fieldSchema.type === 'text') {
      const value = asText(rawValue);
      const isAssetField = key === 'src' || key.includes('image') || key.includes('path');

      if (isAssetField) {
        return (
          <div key={key} className="space-y-1">
            <span className="text-xs text-white/50">{fieldSchema.label}</span>
            <FileUpload
              value={value}
              onChange={(nextValue) => handleFieldChange(key, nextValue)}
              placeholder={fieldSchema.placeholder}
            />
          </div>
        );
      }

      return (
        <div key={key} className="grid grid-cols-3 items-center gap-2">
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
            className="col-span-2 rounded border border-white/10 bg-white/5 px-3 py-1 text-sm text-white placeholder:text-white/30 focus:border-[#00d4aa]/50 focus:outline-none"
            placeholder={fieldSchema.placeholder}
          />
        </div>
      );
    }

    if (fieldSchema.type === 'number') {
      return (
        <div key={key} className="grid grid-cols-3 items-center gap-2">
          <span className="text-xs text-white/50">{fieldSchema.label}</span>
          <input
            type="number"
            value={typeof rawValue === 'number' ? rawValue : ''}
            onChange={(e) => handleFieldChange(key, Number(e.target.value))}
            draggable={false}
            onDragOver={(e) => e.stopPropagation()}
            onDragStart={(e) => e.stopPropagation()}
            onDragEnd={(e) => e.stopPropagation()}
            onDrop={(e) => e.stopPropagation()}
            className="col-span-2 rounded border border-white/10 bg-white/5 px-3 py-1 text-sm text-white placeholder:text-white/30 focus:border-[#00d4aa]/50 focus:outline-none"
            placeholder={fieldSchema.placeholder}
          />
        </div>
      );
    }

    if (fieldSchema.type === 'array') {
      const items = asArrayItems(rawValue);
      const isImageArray =
        key === 'images' ||
        fieldSchema.label?.includes('图片') ||
        fieldSchema.label?.includes('GIF');

      return (
        <div
          key={key}
          className={`mt-2 rounded border p-3 ${isImageArray ? 'border-[#00d4aa]/30 bg-[#00d4aa]/5' : 'border-white/10'}`}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className={`text-xs ${isImageArray ? 'text-[#00d4aa]' : 'text-white/70'}`}>
              {fieldSchema.label}
              {isImageArray ? <span className="ml-1 text-white/50">({items.length})</span> : null}
            </span>
            <button
              onClick={() => {
                const newItem: ArrayItem = fieldSchema.itemType === 'object' ? {} : '';
                handleFieldChange(key, [...items, newItem]);
              }}
              className="rounded bg-[#00d4aa]/20 px-2 py-1 text-xs text-[#00d4aa] hover:bg-[#00d4aa]/30"
            >
              + 添加
            </button>
          </div>

          {items.map((subItem, subIndex) => (
            <div key={subIndex} className="mb-2 flex items-start gap-2 rounded bg-white/5 p-2">
              {fieldSchema.itemType === 'object' && fieldSchema.itemSchema ? (
                <div className="flex-1 space-y-2">
                  {Object.entries(fieldSchema.itemSchema).map(([subKey, subFieldSchema]) => {
                    const subItemObject = asObjectItem(subItem);
                    const subValue = subItemObject[subKey];
                    const isAssetField =
                      subKey === 'src' || subKey.includes('image') || subKey.includes('path');

                    if (isAssetField) {
                      return (
                        <div key={subKey} className="space-y-1">
                          <span className="text-xs text-white/40">{subFieldSchema.label}</span>
                          <FileUpload
                            value={asText(subValue)}
                            onChange={(nextValue) => {
                              const nextItems = [...items];
                              nextItems[subIndex] = {
                                ...subItemObject,
                                [subKey]: nextValue,
                              };
                              handleFieldChange(key, nextItems);
                            }}
                            placeholder={subFieldSchema.placeholder}
                          />
                        </div>
                      );
                    }

                    return (
                      <div key={subKey} className="grid grid-cols-4 items-center gap-1">
                        <span className="text-xs text-white/40">{subFieldSchema.label}</span>
                        <input
                          type="text"
                          value={asText(subValue)}
                          onChange={(e) => {
                            const nextItems = [...items];
                            nextItems[subIndex] = {
                              ...subItemObject,
                              [subKey]: e.target.value,
                            };
                            handleFieldChange(key, nextItems);
                          }}
                          draggable={false}
                          onDragOver={(e) => e.stopPropagation()}
                          onDragStart={(e) => e.stopPropagation()}
                          onDragEnd={(e) => e.stopPropagation()}
                          onDrop={(e) => e.stopPropagation()}
                          className="col-span-3 rounded border border-white/10 bg-white/5 px-2 py-1 text-sm text-white"
                          placeholder={subFieldSchema.placeholder}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <input
                  type="text"
                  value={typeof subItem === 'string' ? subItem : ''}
                  onChange={(e) => {
                    const nextItems = [...items];
                    nextItems[subIndex] = e.target.value;
                    handleFieldChange(key, nextItems);
                  }}
                  draggable={false}
                  onDragOver={(e) => e.stopPropagation()}
                  onDragStart={(e) => e.stopPropagation()}
                  onDragEnd={(e) => e.stopPropagation()}
                  onDrop={(e) => e.stopPropagation()}
                  className="flex-1 rounded border border-white/10 bg-white/5 px-2 py-1 text-sm text-white"
                />
              )}

              <button
                onClick={() => {
                  handleFieldChange(
                    key,
                    items.filter((_, itemIndex) => itemIndex !== subIndex),
                  );
                }}
                className="p-1 text-xs text-white/30 hover:text-red-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          {!items.length ? (
            <p className="py-2 text-xs italic text-white/30">
              {isImageArray ? '暂无图片，点击“添加”上传' : '暂无项目'}
            </p>
          ) : null}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 text-sm text-white/70 hover:text-white"
      >
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        <span className="truncate">{getSummary()}</span>
      </button>
      {expanded ? (
        <div className="space-y-3 border-l-2 border-white/10 pl-2">
          {Object.entries(itemSchema).map(([key, fieldSchema]) => renderNestedField(key, fieldSchema))}
        </div>
      ) : null}
    </div>
  );
}

export default function ArrayInput({ schema, value = [], onChange }: ArrayInputProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<'before' | 'after' | null>(null);

  const handleAdd = () => {
    const newItem: ArrayItem = schema.itemType === 'object' ? {} : '';
    onChange([...value, newItem]);
  };

  const handleRemove = (index: number) => {
    const nextValue = [...value];
    nextValue.splice(index, 1);
    onChange(nextValue);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDragOverIndex(null);
      setDragOverPosition(null);
      return;
    }

    if (!e.dataTransfer.types.includes('text/plain')) {
      return;
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const position = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
    setDragOverIndex(index);
    setDragOverPosition(position);
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      setDragOverPosition(null);
      return;
    }

    const nextValue = [...value];
    const draggedItem = nextValue[draggedIndex];
    nextValue.splice(draggedIndex, 1);

    let nextIndex = index;
    if (draggedIndex < index && dragOverPosition === 'before') {
      nextIndex = index - 1;
    } else if (draggedIndex > index && dragOverPosition === 'after') {
      nextIndex = index + 1;
    }

    nextIndex = Math.max(0, Math.min(nextIndex, nextValue.length));
    nextValue.splice(nextIndex, 0, draggedItem);
    onChange(nextValue);

    setDraggedIndex(null);
    setDragOverIndex(null);
    setDragOverPosition(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-white/80">
          {schema.label}
          {schema.required ? <span className="ml-1 text-red-400">*</span> : null}
        </label>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 rounded-lg bg-[#00d4aa]/20 px-3 py-1 text-sm text-[#00d4aa] transition-colors hover:bg-[#00d4aa]/30"
        >
          <Plus className="h-4 w-4" />
          添加
        </button>
      </div>

      {schema.description ? <p className="text-xs text-white/50">{schema.description}</p> : null}

      <div className="space-y-1">
        {value.map((item, index) => (
          <div key={index} className="relative">
            {dragOverIndex === index && dragOverPosition === 'before' && draggedIndex !== index ? (
              <div className="absolute -top-1 left-0 right-0 z-10 h-1 rounded-full bg-[#00d4aa] shadow-[0_0_10px_rgba(0,212,170,0.8)]" />
            ) : null}

            <div
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={() => {
                setDragOverIndex(null);
                setDragOverPosition(null);
              }}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={() => {
                setDraggedIndex(null);
                setDragOverIndex(null);
                setDragOverPosition(null);
              }}
              className={`flex items-start gap-2 rounded-lg border bg-white/5 p-3 transition-all ${
                draggedIndex === index ? 'border-white/5 opacity-50' : 'border-white/10 hover:border-white/20'
              } ${dragOverIndex === index && draggedIndex !== index ? 'bg-[#00d4aa]/5' : ''}`}
            >
              <div
                className="mt-1 cursor-move select-none text-white/30 transition-colors hover:text-[#00d4aa]"
                draggable
                onDragStart={(e) => {
                  e.stopPropagation();
                  e.dataTransfer.setData('text/plain', index.toString());
                  setDraggedIndex(index);
                }}
              >
                <GripVertical className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                {schema.itemType === 'string' ? (
                  <input
                    type="text"
                    value={typeof item === 'string' ? item : ''}
                    onChange={(e) => {
                      const nextValue = [...value];
                      nextValue[index] = e.target.value;
                      onChange(nextValue);
                    }}
                    draggable={false}
                    onDragOver={(e) => e.stopPropagation()}
                    onDragStart={(e) => e.stopPropagation()}
                    onDragEnd={(e) => e.stopPropagation()}
                    onDrop={(e) => e.stopPropagation()}
                    className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/30 focus:border-[#00d4aa]/50 focus:outline-none"
                    placeholder={`项目 ${index + 1}`}
                  />
                ) : schema.itemType === 'object' && schema.itemSchema ? (
                  <ObjectItemForm
                    itemSchema={schema.itemSchema}
                    item={asObjectItem(item)}
                    onChange={(nextItem) => {
                      const nextValue = [...value];
                      nextValue[index] = nextItem;
                      onChange(nextValue);
                    }}
                  />
                ) : null}
              </div>

              <button
                onClick={() => handleRemove(index)}
                className="mt-1 p-1 text-white/30 transition-colors hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {dragOverIndex === index && dragOverPosition === 'after' && draggedIndex !== index ? (
              <div className="absolute -bottom-1 left-0 right-0 z-10 h-1 rounded-full bg-[#00d4aa] shadow-[0_0_10px_rgba(0,212,170,0.8)]" />
            ) : null}
          </div>
        ))}
      </div>

      {!value.length ? <p className="text-sm italic text-white/30">暂无项目，点击“添加”按钮</p> : null}
    </div>
  );
}
