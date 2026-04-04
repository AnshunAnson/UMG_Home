'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw, ChevronRight } from 'lucide-react';
import { allSchemas } from './schema';
import DynamicForm from './components/DynamicForm';
import { 
  heroContent, 
  aboutContent, 
  projectsContent, 
  skillsContent, 
  contactContent 
} from '../config/content';

const initialData = {
  hero: heroContent,
  about: aboutContent,
  projects: projectsContent,
  skills: skillsContent,
  contact: contactContent,
};

export default function EditPage() {
  const [data, setData] = useState(initialData);
  const [activeSection, setActiveSection] = useState('hero');
  const [hasChanges, setHasChanges] = useState(false);

  const handleSectionChange = (section: string, newData: any) => {
    setData(prev => ({
      ...prev,
      [section]: newData
    }));
    setHasChanges(true);
  };

  const handleReset = () => {
    if (confirm('确定要重置所有更改吗？这将恢复到代码中的默认配置。')) {
      setData(initialData);
      setHasChanges(false);
    }
  };

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    setSaveStatus('saving');
    setSaveMessage('');
    
    const saveData = {
      heroContent: data.hero,
      aboutContent: data.about,
      projectsContent: data.projects,
      skillsContent: data.skills,
      contactContent: data.contact,
    };

    try {
      // 同时保存到 content.ts 和 content.json
      const [tsResult, jsonResult] = await Promise.all([
        fetch('/api/save-ts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: saveData }),
        }),
        fetch('/api/save-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: saveData }),
        }),
      ]);

      const tsData = await tsResult.json();
      const jsonData = await jsonResult.json();

      if (tsData.success && jsonData.success) {
        setHasChanges(false);
        setSaveStatus('success');
        setSaveMessage(`已保存 (${tsData.size + jsonData.size} bytes)`);
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        const errors = [];
        if (!tsData.success) errors.push('content.ts: ' + tsData.error);
        if (!jsonData.success) errors.push('content.json: ' + jsonData.error);
        setSaveStatus('error');
        setSaveMessage(errors.join('; '));
      }
    } catch (err: any) {
      setSaveStatus('error');
      setSaveMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">内容编辑器</h1>
            <p className="text-sm text-white/50">修改后保存，同时更新 content.ts 和 content.json</p>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && saveStatus === 'idle' && (
              <span className="text-sm text-[#00d4aa]">有未保存的更改</span>
            )}
            {saveStatus === 'saving' && (
              <span className="text-sm text-white/50">保存中...</span>
            )}
            {saveStatus === 'success' && (
              <span className="text-sm text-green-400">{saveMessage}</span>
            )}
            {saveStatus === 'error' && (
              <span className="text-sm text-red-400" title={saveMessage}>保存失败</span>
            )}
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white 
                       border border-white/10 rounded-lg hover:border-white/20 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              重置
            </button>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-[#00d4aa] text-black 
                       rounded-lg hover:bg-[#00d4aa]/90 transition-colors font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saveStatus === 'saving' ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </header>

      <div className="pt-20 flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-20 bottom-0 w-64 bg-[#0a0a0f] border-r border-white/10 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {Object.entries(allSchemas).map(([key, schema]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                  ${activeSection === key 
                    ? 'bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <span className="font-medium">{schema.title}</span>
                <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${
                  activeSection === key ? 'rotate-90' : ''
                }`} />
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 border border-white/10 rounded-xl p-8"
            >
              <DynamicForm
                schema={allSchemas[activeSection]}
                data={data[activeSection as keyof typeof data] || {}}
                onChange={(newData) => handleSectionChange(activeSection, newData)}
              />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
