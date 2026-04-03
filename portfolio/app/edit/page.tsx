'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Save, RotateCcw, ChevronRight } from 'lucide-react';
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
  heroContent,
  aboutContent,
  projectsContent,
  skillsContent,
  contactContent,
};

export default function EditPage() {
  const [data, setData] = useState(initialData);
  const [activeSection, setActiveSection] = useState('hero');
  const [hasChanges, setHasChanges] = useState(false);

  // 处理数据变更
  const sectionKeyMap: Record<string, string> = {
  hero: 'heroContent',
  about: 'aboutContent',
  projects: 'projectsContent',
  skills: 'skillsContent',
  contact: 'contactContent',
};

const reverseKeyMap: Record<string, string> = {
  heroContent: 'hero',
  aboutContent: 'about',
  projectsContent: 'projects',
  skillsContent: 'skills',
  contactContent: 'contact',
};

const handleSectionChange = (section: string, newData: any) => {
  const contentKey = sectionKeyMap[section] || section;
  setData(prev => ({
    ...prev,
    [contentKey]: newData
  }));
  setHasChanges(true);
};

  // 生成TypeScript代码
  const generateCode = () => {
    const code = `// 内容配置文件
// 由Edit页面自动生成

export const heroContent = ${JSON.stringify(data.heroContent, null, 2)};

export const aboutContent = ${JSON.stringify(data.aboutContent, null, 2)};

export const projectsContent = ${JSON.stringify(data.projectsContent, null, 2)};

export const skillsContent = ${JSON.stringify(data.skillsContent, null, 2)};

export const contactContent = ${JSON.stringify(data.contactContent, null, 2)};
`;
    return code;
  };

  // 下载配置文件
  const handleDownload = () => {
    const code = generateCode();
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 重置数据
  const handleReset = () => {
    if (confirm('确定要重置所有更改吗？')) {
      setData(initialData);
      setHasChanges(false);
    }
  };

  // 保存到localStorage
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-content');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved content:', e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('portfolio-content', JSON.stringify(data));
    setHasChanges(false);
    alert('保存成功！');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">内容编辑器</h1>
            <p className="text-sm text-white/50">修改配置后保存并下载 content.ts 文件</p>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && (
              <span className="text-sm text-[#00d4aa]">有未保存的更改</span>
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
              className="flex items-center gap-2 px-4 py-2 text-sm bg-[#00d4aa]/20 text-[#00d4aa] 
                       border border-[#00d4aa]/30 rounded-lg hover:bg-[#00d4aa]/30 transition-colors"
            >
              <Save className="w-4 h-4" />
              保存
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-[#00d4aa] text-black 
                       rounded-lg hover:bg-[#00d4aa]/90 transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              下载配置
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
                data={data[sectionKeyMap[activeSection] as keyof typeof data]}
                onChange={(newData) => handleSectionChange(activeSection, newData)}
              />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
