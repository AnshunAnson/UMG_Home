// Edit页面表单Schema定义
// 描述每个配置项的数据结构，用于动态生成表单

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

export interface SectionSchema {
  title: string;
  description?: string;
  fields: Record<string, FieldSchema>;
}

// Hero区域Schema
export const heroSchema: SectionSchema = {
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
      description: '三个标签项，如地点、经验、求职意向',
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

// About区域Schema
export const aboutSchema: SectionSchema = {
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
    currentCompany: {
      type: 'string',
      label: '当前公司',
      placeholder: '深圳普修汽车资讯有限公司'
    },
    jobTitle: {
      type: 'string',
      label: '职位',
      placeholder: 'UE4开发'
    }
  }
};

// Projects区域Schema
export const projectsSchema: SectionSchema = {
  title: '项目 Projects',
  description: '配置项目经历',
  fields: {
    sectionTitle: {
      type: 'string',
      label: '区域标题',
      placeholder: '项目经历'
    },
    sectionSubtitle: {
      type: 'string',
      label: '区域副标题',
      placeholder: 'Projects'
    },
    projects: {
      type: 'array',
      label: '项目列表',
      itemType: 'object',
      itemSchema: {
        id: { type: 'number', label: 'ID' },
        icon: { type: 'string', label: '图标', placeholder: 'Car' },
        title: { type: 'string', label: '项目名称', placeholder: '汽车渲染' },
        company: { type: 'string', label: '公司', placeholder: '深圳普修汽车资讯有限公司' },
        period: { type: 'string', label: '时间段', placeholder: '2023.12 - 至今' },
        category: { type: 'string', label: '分类', placeholder: '渲染 / 动效 / UI / 编辑器' },
        description: { type: 'text', label: '项目描述' },
        details: { type: 'array', label: '详细内容', itemType: 'string' },
        achievements: { type: 'array', label: '业绩成果', itemType: 'string' },
        tech: { type: 'array', label: '技术栈', itemType: 'string' },
        color: { type: 'string', label: '主题色', placeholder: '#00d4aa' }
      }
    }
  }
};

// Skills区域Schema
export const skillsSchema: SectionSchema = {
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
    skills: {
      type: 'array',
      label: '技能列表',
      itemType: 'object',
      itemSchema: {
        name: { type: 'string', label: '技能名称', placeholder: 'Unreal Engine 4/5' },
        level: { type: 'number', label: '熟练度 (0-100)', placeholder: '95' },
        category: { type: 'string', label: '分类', placeholder: 'engine' }
      }
    }
  }
};

// Contact区域Schema
export const contactSchema: SectionSchema = {
  title: '联系 Contact',
  description: '配置联系方式',
  fields: {
    sectionTitle: {
      type: 'string',
      label: '区域标题',
      placeholder: '开始合作'
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
    },
    jobTitle: {
      type: 'string',
      label: '求职岗位',
      placeholder: 'UMG重构'
    },
    salary: {
      type: 'string',
      label: '期望薪资',
      placeholder: '11-22K'
    }
  }
};

// 所有Schema汇总
export const allSchemas: Record<string, SectionSchema> = {
  hero: heroSchema,
  about: aboutSchema,
  projects: projectsSchema,
  skills: skillsSchema,
  contact: contactSchema
};
