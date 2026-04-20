import type {
  HeroContent,
  AboutContent,
  ProjectsContent,
  SkillsContent,
  ContactContent,
  FooterContent,
} from '../types/content';

export type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'text';

export interface FieldSchema {
  type: FieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  // 数组类型特有
  itemType?: 'string' | 'object';
  itemSchema?: Record<string, FieldSchema>;
  // 对象类型特有
  properties?: Record<string, FieldSchema>;
}

export interface SectionSchema<T = unknown> {
  title: string;
  description?: string;
  fields: Record<string, FieldSchema>;
  _type?: T;
}

export const heroSchema: SectionSchema<HeroContent> = {
  title: '首页 Hero',
  description: '配置首屏展示内容',
  fields: {
    badge: {
      type: 'string',
      label: '标签',
      description: '顶部状态标签，如 Available for work',
      placeholder: 'Available for work'
    },
    name: {
      type: 'string',
      label: '主标题',
      description: '大标题文字，支持字母动画',
      placeholder: 'UE4 Developer'
    },
    nameHighlightLength: {
      type: 'number',
      label: '高亮字母数',
      description: '前N个字母使用高亮色',
      placeholder: '3'
    },
    subtitle: {
      type: 'string',
      label: '副标题',
      description: '主标题下方的描述文字',
      placeholder: '汽车渲染 · UMG重构 · 材质动效'
    },
    stats: {
      type: 'array',
      label: '统计标签',
      description: '标签项，如地点、经验',
      itemType: 'object',
      itemSchema: {
        icon: { type: 'string', label: '图标', placeholder: '📍' },
        label: { type: 'string', label: '文字', placeholder: '深圳' }
      }
    },
    cornerLeft: {
      type: 'string',
      label: '左上角文字',
      placeholder: '2024'
    },
    cornerRight: {
      type: 'string',
      label: '右上角文字',
      placeholder: 'PORTFOLIO'
    }
  }
};

export const aboutSchema: SectionSchema<AboutContent> = {
  title: '关于 About',
  description: '配置个人介绍内容',
  fields: {
    sectionTitle: {
      type: 'string',
      label: '区域标题',
      placeholder: '关于我'
    },
    sectionSubtitle: {
      type: 'string',
      label: '区域副标题',
      placeholder: 'About Me'
    },
    bio: {
      type: 'array',
      label: '个人介绍',
      description: '每段介绍文字',
      itemType: 'string'
    },
    age: {
      type: 'number',
      label: '年龄',
      placeholder: '23'
    },
    location: {
      type: 'string',
      label: '所在城市',
      placeholder: '深圳'
    },
    experience: {
      type: 'number',
      label: '工作年限',
      placeholder: '3'
    },
    jobTitle: {
      type: 'string',
      label: '职位',
      placeholder: 'UE4开发'
    },
    coreSkills: {
      type: 'array',
      label: '核心技能',
      description: '核心技能卡片列表',
      itemType: 'object',
      itemSchema: {
        title: { type: 'string', label: '技能标题', placeholder: 'UMG开发' },
        description: { type: 'string', label: '技能描述', placeholder: '复杂的UI系统实现' }
      }
    }
  }
};

export const projectsSchema: SectionSchema<ProjectsContent> = {
  title: '项目经历 Projects',
  description: '配置首页项目经历列表与紧凑预览媒体',
  fields: {
    sectionTitle: {
      type: 'string',
      label: '区域标题',
      placeholder: '项目经历'
    },
    sectionSubtitle: {
      type: 'string',
      label: '区域副标题',
      placeholder: 'Project Experience'
    },
    projects: {
      type: 'array',
      label: '项目列表',
      itemType: 'object',
      itemSchema: {
        id: { type: 'number', label: 'ID' },
        icon: { type: 'string', label: '图标', placeholder: 'Car' },
        title: { type: 'string', label: '项目名称', placeholder: '汽车渲染' },
        period: { type: 'string', label: '时间段', placeholder: '2023.12 - 至今' },
        category: { type: 'string', label: '分类', placeholder: '渲染 / 动效 / UI / 编辑器' },
        description: { type: 'text', label: '项目描述' },
        details: { type: 'array', label: '职责 / 要点', itemType: 'string' },
        achievements: { type: 'array', label: '补充成果', itemType: 'string' },
        tech: { type: 'array', label: '技术栈', itemType: 'string' },
        color: { type: 'string', label: '主题色', placeholder: '#00d4aa' },
        links: {
          type: 'array',
          label: '项目链接',
          description: '项目相关的外部展示、案例或体验链接',
          itemType: 'object',
          itemSchema: {
            label: { type: 'string', label: '链接名称', placeholder: '在线展示' },
            href: { type: 'string', label: '链接地址', placeholder: 'https://example.com' }
          }
        },
        images: {
          type: 'array',
          label: '预览图片 / GIF',
          description: '首页会以紧凑预览带展示项目的全部图片或 GIF',
          itemType: 'object',
          itemSchema: {
            src: { type: 'string', label: '图片路径', placeholder: '/gifs/project/animation.gif', description: '站点 public 目录下的图片或 GIF 路径' },
            alt: { type: 'string', label: '图片描述', placeholder: '动画效果展示', description: '图片的替代文字描述' }
          }
        }
      }
    }
  }
};

export const skillsSchema: SectionSchema<SkillsContent> = {
  title: '技能 Skills',
  description: '配置技能展示',
  fields: {
    sectionTitle: {
      type: 'string',
      label: '区域标题',
      placeholder: '技能专长'
    },
    sectionSubtitle: {
      type: 'string',
      label: '区域副标题',
      placeholder: 'Skills'
    },
    categories: {
      type: 'array',
      label: '技能分类',
      description: '技能分类列表，每个分类包含多个技能',
      itemType: 'object',
      itemSchema: {
        title: { type: 'string', label: '分类标题', placeholder: '引擎与蓝图' },
        skills: {
          type: 'array',
          label: '技能列表',
          itemType: 'object',
          itemSchema: {
            name: { type: 'string', label: '技能名称', placeholder: 'Unreal Engine 4/5' },
            level: { type: 'number', label: '熟练度 (0-100)', placeholder: '95' }
          }
        }
      }
    },
    techStack: {
      type: 'array',
      label: '技术栈标签',
      description: '底部技术栈标签列表',
      itemType: 'string'
    }
  }
};

export const contactSchema: SectionSchema<ContactContent> = {
  title: '联系 Contact',
  description: '配置联系方式',
  fields: {
    sectionTitle: {
      type: 'string',
      label: '区域标题',
      placeholder: '开始合作'
    },
    sectionSubtitle: {
      type: 'string',
      label: '区域副标题',
      placeholder: 'Contact'
    },
    description: {
      type: 'text',
      label: '描述文字',
      placeholder: '有项目想法或合作意向？欢迎随时联系我...'
    },
    email: {
      type: 'string',
      label: '邮箱',
      placeholder: 'an15073025868@163.com'
    },
    phone: {
      type: 'string',
      label: '电话',
      placeholder: '15073025868'
    },
    location: {
      type: 'string',
      label: '城市',
      placeholder: '深圳'
    }
  }
};

export const footerSchema: SectionSchema<FooterContent> = {
  title: '页脚 Footer',
  description: '配置页脚内容',
  fields: {
    logo: {
      type: 'string',
      label: 'Logo文字',
      placeholder: 'UMG'
    },
    logoHighlight: {
      type: 'string',
      label: 'Logo高亮文字',
      placeholder: 'Developer'
    },
    tagline: {
      type: 'string',
      label: '标语',
      placeholder: '专注于UE4/UE5开发与UMG界面设计'
    },
    navLinks: {
      type: 'array',
      label: '导航链接',
      itemType: 'object',
      itemSchema: {
        label: { type: 'string', label: '标签', placeholder: '关于' },
        href: { type: 'string', label: '链接', placeholder: '#about' }
      }
    },
    socialLinks: {
      type: 'array',
      label: '社交链接',
      itemType: 'object',
      itemSchema: {
        icon: { type: 'string', label: '图标', placeholder: 'Code2', description: 'lucide-react图标名' },
        href: { type: 'string', label: '链接', placeholder: 'https://github.com' },
        label: { type: 'string', label: '标签', placeholder: 'GitHub' }
      }
    },
    copyright: {
      type: 'string',
      label: '版权信息',
      placeholder: '© 2024 UMG Developer'
    }
  }
};

export const allSchemas: Record<string, SectionSchema> = {
  hero: heroSchema,
  about: aboutSchema,
  projects: projectsSchema,
  skills: skillsSchema,
  contact: contactSchema,
  footer: footerSchema
};
