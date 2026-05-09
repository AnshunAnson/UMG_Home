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
  "badge": "Technical Artist / Unreal",
  "name": "安顺",
  "nameHighlightLength": 2,
  "subtitle": "聚焦实时视觉、材质系统、Niagara 特效、编辑器工具与渲染流程，把表现需求收束成可交付的技术方案。",
  "stats": [
    {
      "icon": "🧩",
      "label": "10+ 项目"
    },
    {
      "icon": "⚙️",
      "label": "3 年实时内容实践"
    }
  ],
  "cornerLeft": "2026",
  "cornerRight": "TECH ART"
};

// About区域内容
export const aboutContent: AboutContent = {
  "sectionTitle": "关于",
  "sectionSubtitle": "About",
  "bio": ["技术美术，专注于实时视觉、材质系统和Niagara特效，致力于把创意转化为可交付的技术方案。"],
  "age": 24,
  "location": "",
  "experience": 3,
  "jobTitle": "技术美术 (Technical Artist)",
  "coreSkills": [
    {
      "title": "实时视觉与特效",
      "description": "使用 Niagara、SDF、体积与转场控制，把概念画面落成可实时运行的效果表现。"
    },
    {
      "title": "材质与界面动效",
      "description": "处理 UI Material、Substrate 与参数驱动动画，让界面和表现保持统一质感。"
    },
    {
      "title": "工具与资产流程",
      "description": "为模型整理、批量渲染、资产同步和输出流程补齐工具，降低重复劳动。"
    },
    {
      "title": "整合与性能收敛",
      "description": "在移动端、桌面端和概念验证场景中平衡效果成本、交付速度与可维护性。"
    }
  ]
};

// Projects区域内容
export const projectsContent: ProjectsContent = {
  "sectionTitle": "技术项目",
  "sectionSubtitle": "Technical Art Projects",
  "projects": [
    {
      "id": 1,
      "icon": "Wrench",
      "title": "汽车渲染工作流工具链",
      "period": "2023.12 - 至今",
      "category": "Technical Art Tools / Asset Pipeline / Rendering Workflow",
      "tech": [
        "UE5",
        "Blueprint",
        "Editor Tools",
        "OpenUSD",
        "Material",
        "Automation"
      ],
      "color": "#7ce7d0",
      "images": [
        {
          "src": "/images/tools/maya-material-naming-tool.png",
          "alt": "Maya 材质与模型命名工具界面截图"
        }
      ]
    },
    {
      "id": 2,
      "icon": "ScanSearch",
      "title": "特效作品",
      "period": "未单独标注",
      "category": "Technical Art FX / Niagara / SDF / Sequencer",
      "tech": [
        "UE",
        "Niagara",
        "SDF",
        "Sequencer",
        "FX"
      ],
      "color": "#88a8ff",
      "links": [],
      "subProjects": [
        {
          "title": "比亚迪概念展示特效",
          "period": "2023.10 - 2023.11",
          "images": [
            {
              "src": "/gifs/Niagara_Materials/比亚迪入场动画.gif",
              "alt": "比亚迪概念展示项目的入场特效"
            }
          ]
        },
        {
          "title": "DesaySV 智能座舱",
          "period": "2024.12 - 2025.04",
          "images": [
            {
              "src": "/gifs/DesaysvFX/SEQ_Render_thm2_prob4.gif",
              "alt": "智能座舱主题场景渲染氛围效果"
            },
            {
              "src": "/gifs/DesaysvFX/SEQ_Scene_Switching.gif",
              "alt": "智能座舱场景切换粒子效果"
            },
            {
              "src": "/gifs/DesaysvFX/Wellness02.gif",
              "alt": "智能座舱烟雾与氛围层特效"
            },
            {
              "src": "/gifs/DesaysvFX/入场_爆破_溅射.gif",
              "alt": "智能座舱入场爆破与溅射特效"
            },
            {
              "src": "/gifs/DesaysvFX/audio.gif",
              "alt": "智能座舱音波扰动与音频可视化效果"
            },
            {
              "src": "/gifs/DesaysvFX/IP台开机动效.gif",
              "alt": "智能座舱 IP 台开机过场动画"
            },
            {
              "src": "/gifs/DesaysvFX/IP台来电.gif",
              "alt": "智能座舱 IP 台来电提醒效果"
            },
            {
              "src": "/gifs/DesaysvFX/SEQ_Flow7.gif",
              "alt": "智能座舱流体入场动效"
            },
            {
              "src": "/gifs/DesaysvFX/SEQ_Loading01.gif",
              "alt": "智能座舱加载序列动画"
            },
            {
              "src": "/gifs/DesaysvFX/SEQ_Mind.gif",
              "alt": "智能座舱心智切换过场效果"
            },
            {
              "src": "/gifs/DesaysvFX/SEQ_Music.gif",
              "alt": "智能座舱音乐界面动效"
            }
          ]
        }
      ]
    },
    {
      "id": 3,
      "icon": "Car",
      "title": "汽车可视化与多端展示",
      "period": "未单独标注",
      "category": "Real-time Rendering / Automotive Visualization / Multi-platform",
      "tech": [
        "UE",
        "HTML",
        "UMG",
        "Material",
        "Niagara",
        "DataTable",
        "PBR"
      ],
      "color": "#d7c77a",
      "subProjects": [
        {
          "title": "UE Web 端汽车展示",
          "period": "未单独标注",
          "links": [
            {
              "label": "保时捷在线展示",
              "href": "https://www.autoy.co/porsche/#/"
            },
            {
              "label": "奥迪在线展示",
              "href": "https://www.autoy.co/2025_audi_rs_e_tron_gt/index/"
            }
          ]
        },
        {
          "title": "Windows 汽车配置器",
          "period": "未单独标注",
          "links": [
            {
              "label": "Audi RS Q8 WEB3D设计与研发",
              "href": "https://www.autoxyz.cn/information/detail/37446"
            }
          ],
          "images": [
            {
              "src": "/gifs/ProjectNotes/audi.gif",
              "alt": "Windows 端汽车配置器的机位切换与展示效果"
            }
          ]
        },
        {
          "title": "Android 汽车配置器",
          "period": "未单独标注"
        }
      ]
    },
    {
      "id": 4,
      "icon": "PanelsTopLeft",
      "title": "UI 材质动画作品",
      "period": "未单独标注",
      "category": "UI Technical Art / Material Animation / Motion",
      "tech": [
        "UE",
        "UMG",
        "UI Material",
        "Sequencer",
        "Material Animation"
      ],
      "color": "#62d8c8",
      "links": [
        {
          "label": "UI 材质动画项目链接",
          "href": "https://www.autoxyz.cn/information/detail/26652"
        }
      ]
    },
    {
      "id": 5,
      "icon": "LayoutPanelTop",
      "title": "DeltaForce 实时界面技术框架",
      "period": "未单独标注",
      "category": "Interface Tech / UI Systems / Methodology",
      "tech": [
        "UE5",
        "UMG",
        "Blueprint",
        "UI Material",
        "UI Architecture"
      ],
      "color": "#7ce7d0",
      "links": [
        {
          "label": "实时界面技术白皮书",
          "href": "https://www.bilibili.com/opus/1190448420615094281/?from=readlist"
        }
      ]
    },
    {
      "id": 6,
      "icon": "Sparkles",
      "title": "概念交互验证项目",
      "period": "2023.10 - 2025.04",
      "category": "Concept Interaction / Prototype / Presentation",
      "tech": [
        "UE5",
        "Material",
        "Sequencer",
        "Blueprint",
        "UMG",
        "Prototype"
      ],
      "color": "#59c8ff",
      "links": [
        {
          "label": "3D HMI 概念设计",
          "href": "https://www.autoxyz.cn/information/detail/32714"
        },
        {
          "label": "福特烈马3D_HMI设计&汽车渲染",
          "href": "https://www.autoxyz.cn/information/detail/34563"
        },
        {
          "label": "兰博基尼自动驾驶用户体验设计",
          "href": "https://www.autoxyz.cn/information/detail/30369"
        },
        {
          "label": "Benz EQS680 Maybach的SR与ADAS用户体验设计",
          "href": "https://www.autoxyz.cn/information/detail/31254"
        },
        {
          "label": "3D仪表HMI创新设计",
          "href": "https://www.autoxyz.cn/information/detail/25064"
        }
      ],
      "subProjects": [
        {
          "title": "广汽丰田 POC 台架",
          "period": "2024.7 - 2024.11",
          "description": "3D HMI 概念设计与台架验证，推进移动端天气系统与材质表现测试。",
          "details": [
            "推进 POC 台架中的交互验证。",
            "验证移动端天气系统与视差冰材质表现。",
            "完成 3D HMI 概念设计与整体视觉呈现。"
          ],
          "images": [
            {
              "src": "/images/projects/guangfeng-poc/1.png",
              "alt": "广汽丰田 POC 3D HMI 概念设计图1"
            },
            {
              "src": "/images/projects/guangfeng-poc/2.png",
              "alt": "广汽丰田 POC 3D HMI 概念设计图2"
            },
            {
              "src": "/images/projects/guangfeng-poc/3.png",
              "alt": "广汽丰田 POC 3D HMI 概念设计图3"
            },
            {
              "src": "/images/projects/guangfeng-poc/4.png",
              "alt": "广汽丰田 POC 3D HMI 概念设计图4"
            }
          ],
          "links": [
            {
              "label": "3D HMI 概念设计",
              "href": "https://www.autoxyz.cn/information/detail/32714"
            }
          ]
        },
        {
          "title": "福特烈马3D_HMI设计&汽车渲染",
          "period": "未单独标注",
          "description": "负责福特烈马项目的材质和特效实现，以及不同界面的动效过渡逻辑实现。",
          "details": [
            "实现高质量汽车渲染材质与特效。",
            "设计并实现不同界面间的动效过渡逻辑。",
            "优化HMI界面的视觉表现与交互体验。"
          ],
          "images": [
            {
              "src": "/images/projects/ford/1.png",
              "alt": "福特烈马3D_HMI设计图1"
            },
            {
              "src": "/images/projects/ford/2.png",
              "alt": "福特烈马3D_HMI设计图2"
            },
            {
              "src": "/images/projects/ford/3.png",
              "alt": "福特烈马3D_HMI设计图3"
            },
            {
              "src": "/images/projects/ford/4.png",
              "alt": "福特烈马3D_HMI设计图4"
            }
          ],
          "links": [
            {
              "label": "福特烈马项目",
              "href": "https://www.autoxyz.cn/information/detail/34563"
            }
          ]
        },
        {
          "title": "兰博基尼自动驾驶用户体验设计",
          "period": "未单独标注",
          "description": "负责兰博基尼项目的材质和特效实现，以及不同界面的动效过渡逻辑实现。",
          "details": [
            "打造高端汽车品牌的材质与视觉效果。",
            "实现自动驾驶场景下的特效与动效。",
            "设计流畅的用户体验界面过渡效果。"
          ],
          "images": [
            {
              "src": "/images/projects/lamborghini/1.png",
              "alt": "兰博基尼自动驾驶用户体验设计图"
            }
          ],
          "links": [
            {
              "label": "兰博基尼项目",
              "href": "https://www.autoxyz.cn/information/detail/30369"
            }
          ]
        },
        {
          "title": "Benz EQS680 Maybach的SR与ADAS用户体验设计",
          "period": "未单独标注",
          "description": "负责SR与ADAS项目的材质和特效实现，以及不同界面的动效过渡逻辑实现。",
          "details": [
            "实现超级分辨率(SR)与高级驾驶辅助系统(ADAS)界面特效。",
            "设计安全、直观的用户体验动效。",
            "优化高端车型的材质表现与视觉层次。"
          ],
          "images": [
            {
              "src": "/images/projects/sr-adas/1.png",
              "alt": "Benz EQS680 Maybach SR与ADAS设计图1"
            },
            {
              "src": "/images/projects/sr-adas/2.png",
              "alt": "Benz EQS680 Maybach SR与ADAS设计图2"
            },
            {
              "src": "/images/projects/sr-adas/3.png",
              "alt": "Benz EQS680 Maybach SR与ADAS设计图3"
            },
            {
              "src": "/images/projects/sr-adas/4.png",
              "alt": "Benz EQS680 Maybach SR与ADAS设计图4"
            },
            {
              "src": "/images/projects/sr-adas/5.png",
              "alt": "Benz EQS680 Maybach SR与ADAS设计图5"
            },
            {
              "src": "/images/projects/sr-adas/6.png",
              "alt": "Benz EQS680 Maybach SR与ADAS设计图6"
            },
            {
              "src": "/images/projects/sr-adas/7.png",
              "alt": "Benz EQS680 Maybach SR与ADAS设计图7"
            }
          ],
          "links": [
            {
              "label": "SR与ADAS项目",
              "href": "https://www.autoxyz.cn/information/detail/31254"
            }
          ]
        },
        {
          "title": "极星3D仪表HMI创新设计",
          "period": "未单独标注",
          "description": "负责极星3D仪表项目的材质和特效实现，以及不同界面的动效过渡逻辑实现。",
          "details": [
            "打造创新的3D仪表HMI界面。",
            "实现仪表界面的材质与动态特效。",
            "设计多场景下的流畅动效过渡。"
          ],
          "images": [
            {
              "src": "/images/projects/polestar-3d/1.png",
              "alt": "极星3D仪表HMI设计图1"
            },
            {
              "src": "/images/projects/polestar-3d/2.png",
              "alt": "极星3D仪表HMI设计图2"
            },
            {
              "src": "/images/projects/polestar-3d/3.png",
              "alt": "极星3D仪表HMI设计图3"
            },
            {
              "src": "/images/projects/polestar-3d/4.png",
              "alt": "极星3D仪表HMI设计图4"
            }
          ],
          "links": [
            {
              "label": "极星3D仪表项目",
              "href": "https://www.autoxyz.cn/information/detail/25064"
            }
          ]
        },
        {
          "title": "郑州日产概念表现",
          "period": "未单独标注",
          "links": [
            {
              "label": "郑州日产项目介绍",
              "href": "https://www.autoxyz.cn/information/detail/34604"
            }
          ],
          "images": [
            {
              "src": "/gifs/ProjectNotes/Dog.gif",
              "alt": "郑州日产项目中的 Metahuman 车载宠物效果"
            }
          ]
        },
        {
          "title": "移动端 POC",
          "period": "未单独标注",
          "images": [
            {
              "src": "/gifs/Mobile_terminal/UMG_1080.gif",
              "alt": "移动端 POC 的交互界面与角色特效整合效果"
            }
          ]
        }
      ]
    },
    {
      "id": 7,
      "icon": "Gamepad2",
      "title": "局域网 FPS 对战原型",
      "period": "2022.09 - 2022.12",
      "category": "Gameplay Prototype / Networking / Blueprint",
      "tech": [
        "UE4",
        "Blueprint",
        "Networking",
        "Gameplay"
      ],
      "color": "#f0b562",
      "images": [
        {
          "src": "/gifs/FPS.high.gif",
          "alt": "局域网 FPS 原型的实机对战画面"
        }
      ]
    },
    {
      "id": 0,
      "icon": "Car",
      "title": "BenZ 汽车实时展示",
      "period": "未单独标注",
      "category": "Web 端汽车实时渲染",
      "tech": [
        "Unreal Engine 4",
        "HTML5",
        "WebGL",
        "Emscripten",
        "JavaScript",
        "IndexedDB",
        "GitHub Pages"
      ],
      "color": "#7ce7d0",
      "links": [
        {
          "label": "BenZ_Html",
          "href": "https://anshunanson.github.io/BenZ/BenZ-HTML5-Shipping.html"
        }
      ]
    }
  ]
};

// Skills区域内容
export const skillsContent: SkillsContent = {
  "sectionTitle": "技术能力",
  "sectionSubtitle": "Technical Art Capabilities",
  "categories": [
    {
      "title": "引擎与整合",
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
          "name": "Sequencer 集成",
          "level": 84
        }
      ]
    },
    {
      "title": "材质与实时视觉",
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
          "name": "实时渲染表现",
          "level": 88
        }
      ]
    },
    {
      "title": "工具与资产流程",
      "skills": [
        {
          "name": "编辑器工具",
          "level": 85
        },
        {
          "name": "资产流程搭建",
          "level": 86
        },
        {
          "name": "Python自动化",
          "level": 75
        },
        {
          "name": "移动端适配",
          "level": 82
        }
      ]
    },
    {
      "title": "界面技术",
      "skills": [
        {
          "name": "UMG界面开发",
          "level": 95
        },
        {
          "name": "UI架构设计",
          "level": 85
        },
        {
          "name": "UI动效实现",
          "level": 90
        },
        {
          "name": "蓝图模板开发",
          "level": 90
        }
      ]
    }
  ],
  "techStack": [
    "UE4",
    "UE5",
    "Niagara",
    "Material",
    "UI Material",
    "Substrate",
    "Sequencer",
    "Blueprint",
    "C++",
    "Editor Tools",
    "OpenUSD",
    "Python",
    "Performance Profiling",
    "Automation Harness"
  ]
};

// Contact区域内容
export const contactContent: ContactContent = {
  "sectionTitle": "开始合作",
  "sectionSubtitle": "Contact",
  "description": "如果你需要一个能把实时视觉、材质特效、渲染工具链和项目落地串起来的人，我愿意直接参与问题推进与交付。",
  "email": "an15073025868@163.com",
  "phone": "15073025868",
  "location": ""
};

// Footer区域内容
export const footerContent: FooterContent = {
  "logo": "Tech",
  "logoHighlight": "Art",
  "tagline": "Technical art work across visuals, materials and workflow",
  "navLinks": [
    {
      "label": "首页",
      "href": "#hero"
    },
    {
      "label": "技术项目",
      "href": "#projects"
    },
    {
      "label": "关于",
      "href": "#about"
    },
    {
      "label": "能力",
      "href": "#skills"
    },
    {
      "label": "联系",
      "href": "#contact"
    }
  ],
  "socialLinks": [
    {
      "icon": "github",
      "href": "https://github.com",
      "label": "GitHub"
    },
    {
      "icon": "linkedin",
      "href": "https://linkedin.com",
      "label": "LinkedIn"
    },
    {
      "icon": "email",
      "href": "mailto:an15073025868@163.com",
      "label": "Email"
    }
  ],
  "copyright": "© 2026 Technical Art Homepage. All rights reserved."
};
