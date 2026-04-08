import {
  HeroContent,
  AboutContent,
  ProjectsContent,
  SkillsContent,
  ContactContent,
  FooterContent,
} from '../types/content';

// Hero区域内容
export const heroContent: HeroContent = {
  "badge": "Available for work",
  "name": "UE 工程师",
  "nameHighlightLength": 3,
  "subtitle": "汽车渲染 · UMG重构 · 材质动效·工作流搭建·前沿技术预研",
  "stats": [
    {
      "icon": "📍",
      "label": "深圳"
    },
    {
      "icon": "💼",
      "label": "3年经验"
    }
  ],
  "cornerLeft": "2027",
  "cornerRight": "UnrealEngine"
};

// About区域内容
export const aboutContent: AboutContent = {
  "sectionTitle": "关于我",
  "sectionSubtitle": "About Me",
  "bio": [
    "曾主导项目 UMG 系统重构，深度优化 UI 内存管理与渲染响应速度。擅长编写定制化蓝图编辑器工具链，并运用 Harness 工程理念搭建自动化工作流，有效降低技术债务。",
    "具备比亚迪、广汽丰田、德赛西威等HMI项目实战经验。擅长移动端高性能 PBR 材质与半透明动效优化（可解决摩尔纹等痛点），并能独立开发蓝图编辑器工具链提升团队效率。"
  ],
  "age": 24,
  "location": "深圳",
  "experience": 3,
  "currentCompany": "深圳普修汽车资讯有限公司",
  "jobTitle": "UE工程师",
  "stats": [
    {
      "label": "Years",
      "value": 3,
      "suffix": "+"
    },
    {
      "label": "Projects",
      "value": 10,
      "suffix": "+"
    },
    {
      "label": "Skills",
      "value": 15,
      "suffix": "+"
    }
  ],
  "coreSkills": [
    {
      "title": "UMG开发",
      "description": "复杂的UI系统实现"
    },
    {
      "title": "材质动效",
      "description": "高级UI视觉效果"
    },
    {
      "title": "性能优化",
      "description": "移动端适配与优化"
    },
    {
      "title": "工具开发",
      "description": "构建设计师/美术易用的生产工具和流程"
    }
  ]
};

// Projects区域内容
export const projectsContent: ProjectsContent = {
  "sectionTitle": "项目经历",
  "sectionSubtitle": "Projects",
  "projects": [
    {
      "id": 1,
      "icon": "Car",
      "title": "汽车渲染平台",
      "company": "深圳普修汽车资讯有限公司",
      "period": "2023.04 - 至今",
      "category": "UE4开发",
      "description": "基于UE4的汽车可视化渲染平台，支持实时光追渲染和交互式配置",
      "details": [
        "负责UMG界面重构与架构设计",
        "开发蓝图模板和UI组件库",
        "实现复杂的材质系统和动效",
        "优化移动端性能和内存管理"
      ],
      "achievements": [
        "将UI渲染性能提升40%",
        "建立完整的UI开发规范",
        "实现模块化UI架构"
      ],
      "tech": [
        "UE4",
        "UMG",
        "蓝图",
        "材质系统",
        "Niagara"
      ],
      "color": "#00d4aa"
    },
    {
      "id": 2,
      "icon": "Sparkles",
      "title": "Niagara粒子特效",
      "company": "个人项目",
      "period": "2023.01 - 2023.03",
      "category": "特效开发",
      "description": "使用Niagara系统开发的一系列UI粒子特效，包括爆炸、烟雾、火焰等效果",
      "details": [
        "设计Niagara粒子系统架构",
        "开发可复用的粒子模板",
        "实现粒子与UI的交互",
        "优化粒子渲染性能"
      ],
      "achievements": [
        "创建20+可复用粒子模板",
        "实现零代码配置粒子效果",
        "性能优化支持1000+粒子同屏"
      ],
      "tech": [
        "Niagara",
        "UE4",
        "材质系统",
        "蓝图"
      ],
      "color": "#9b59b6",
      "images": [
        {
          "src": "/gifs/niagara/入场_爆破,溅射.gif",
          "alt": "入场爆破溅射动效"
        },
        {
          "src": "/gifs/niagara/IP台来电.gif",
          "alt": "来电"
        },
        {
          "src": "/gifs/niagara/SEQ_Loading01.gif",
          "alt": "Loading"
        },
        {
          "src": "/gifs/niagara/SEQ_Mind.gif",
          "alt": "Mind"
        },
        {
          "src": "/gifs/niagara/SEQ_Music.gif",
          "alt": "Music"
        },
        {
          "src": "/gifs/niagara/SEQ_Scene_Switching.gif",
          "alt": "扫光"
        },
        {
          "src": "/gifs/niagara/IP台开机动效.gif",
          "alt": "开机"
        },
        {
          "src": "/gifs/niagara/audio.gif",
          "alt": "音频可视化"
        },
        {
          "src": "/gifs/niagara/SEQ_Flow7.gif",
          "alt": "入场"
        },
        {
          "src": "/gifs/niagara/Wellness02.gif",
          "alt": "粒子烟雾"
        },
        {
          "src": "/gifs/niagara/SEQ_Render_thm2_prob4.gif",
          "alt": "森林情景"
        }
      ]
    },
    {
      "id": 3,
      "icon": "Zap",
      "title": "UMG重构工具链",
      "company": "深圳普修汽车资讯有限公司",
      "period": "2022.10 - 2022.12",
      "category": "工具开发",
      "description": "开发完整的UMG重构工具链，包括蓝图生成器、UI检查器、自动化测试等",
      "details": [
        "开发蓝图代码生成器",
        "实现UI规范检查工具",
        "建立自动化测试流程",
        "编写完整的技术文档"
      ],
      "achievements": [
        "提升UI开发效率60%",
        "减少UI缺陷率50%",
        "建立团队开发标准"
      ],
      "tech": [
        "Python",
        "UE4",
        "蓝图",
        "编辑器工具"
      ],
      "color": "#3498db"
    },
    {
      "id": 5,
      "icon": "Gamepad2",
      "title": "局域网FPS游戏",
      "company": "个人项目",
      "period": "2022.01 - 2022.05",
      "category": "游戏开发",
      "description": "使用UE4开发的局域网多人FPS游戏，包含完整的游戏系统和网络同步",
      "details": [
        "实现网络同步和多人对战",
        "开发武器系统和伤害计算",
        "设计游戏UI和交互",
        "优化网络延迟和性能"
      ],
      "achievements": [
        "支持8人同时在线",
        "网络延迟低于50ms",
        "完整的游戏循环"
      ],
      "tech": [
        "UE4",
        "C++",
        "网络同步",
        "UMG"
      ],
      "color": "#f39c12"
    }
  ]
};

// Skills区域内容
export const skillsContent: SkillsContent = {
  "sectionTitle": "技能专长",
  "sectionSubtitle": "Skills",
  "categories": [
    {
      "title": "引擎与蓝图",
      "skills": [
        {
          "name": "Unreal Engine 4/5",
          "level": 95
        },
        {
          "name": "蓝图开发",
          "level": 90
        },
        {
          "name": "C++ 开发",
          "level": 75
        },
        {
          "name": "编辑器工具",
          "level": 85
        }
      ]
    },
    {
      "title": "UMG与UI",
      "skills": [
        {
          "name": "UMG界面开发",
          "level": 95
        },
        {
          "name": "LyraUI框架",
          "level": 88
        },
        {
          "name": "UI架构设计",
          "level": 85
        },
        {
          "name": "蓝图模板开发",
          "level": 90
        }
      ]
    },
    {
      "title": "材质与动效",
      "skills": [
        {
          "name": "UI材质制作",
          "level": 92
        },
        {
          "name": "Substrate材质",
          "level": 80
        },
        {
          "name": "Niagara粒子",
          "level": 85
        },
        {
          "name": "UI动效实现",
          "level": 90
        }
      ]
    },
    {
      "title": "性能与工具",
      "skills": [
        {
          "name": "UI性能优化",
          "level": 88
        },
        {
          "name": "移动端适配",
          "level": 82
        },
        {
          "name": "Python自动化",
          "level": 75
        }
      ]
    }
  ],
  "techStack": [
    "UE4",
    "UE5",
    "蓝图",
    "C++",
    "UMG",
    "LyraUI",
    "Niagara",
    "材质系统",
    "Python",
    "Git",
    "Maya",
    "Blender",
    "Substance"
  ]
};

// Contact区域内容
export const contactContent: ContactContent = {
  "sectionTitle": "开始合作",
  "sectionSubtitle": "Get In Touch",
  "description": "专注于UE4/UE5开发，寻找志同道合的团队\n期待与您一起打造卓越的游戏体验",
  "email": "an15073025868@163.com",
  "phone": "15073025868",
  "location": "深圳"
};

// Footer区域内容
export const footerContent: FooterContent = {
  logo: "UMG",
  logoHighlight: "Developer",
  tagline: "专注于UE4/UE5开发与UMG界面设计",
  navLinks: [
    { label: "首页", href: "#hero" },
    { label: "关于", href: "#about" },
    { label: "项目", href: "#projects" },
    { label: "技能", href: "#skills" },
    { label: "联系", href: "#contact" }
  ],
  socialLinks: [
    { icon: "github", href: "https://github.com", label: "GitHub" },
    { icon: "linkedin", href: "https://linkedin.com", label: "LinkedIn" },
    { icon: "email", href: "mailto:contact@example.com", label: "Email" }
  ],
  copyright: "© 2024 UMG Developer. All rights reserved."
};
