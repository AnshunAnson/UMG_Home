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
  "badge": "Personal Technical Homepage",
  "name": "个人技术主页",
  "nameHighlightLength": 2,
  "subtitle": "完整呈现我在 Unreal 开发、界面系统、材质动效、编辑器工具、自动化流程与玩法原型上的技术实践。",
  "stats": [
    {
      "icon": "📍",
      "label": "深圳"
    },
    {
      "icon": "🧩",
      "label": "10+ 项目"
    },
    {
      "icon": "⚙️",
      "label": "3 年技术实践"
    }
  ],
  "cornerLeft": "2026",
  "cornerRight": "TECH LED"
};

// About区域内容
export const aboutContent: AboutContent = {
  "sectionTitle": "关于",
  "sectionSubtitle": "About",
  "bio": [],
  "age": 24,
  "location": "深圳",
  "experience": 3,
  "jobTitle": "Technical Developer",
  "coreSkills": [
    {
      "title": "界面与交互系统",
      "description": "从 UMG 架构、交互流程到组件规范，搭建可迭代的界面系统。"
    },
    {
      "title": "视觉表达",
      "description": "把材质、Niagara 与界面动效组合成可复用的视觉表达能力。"
    },
    {
      "title": "工具与流程",
      "description": "为设计和开发流程补齐生成器、检查器、自动化脚本与编辑器扩展。"
    },
    {
      "title": "工程收敛",
      "description": "在性能、交付效率与维护成本之间做系统性的平衡和收敛。"
    }
  ]
};

// Projects区域内容
export const projectsContent: ProjectsContent = {
  "sectionTitle": "项目经历",
  "sectionSubtitle": "Project Experience",
  "projects": [
    {
      "id": 1,
      "icon": "LayoutPanelTop",
      "title": "DeltaForce UMG 模块化框架",
      "period": "未单独标注",
      "category": "UI 架构 / 方法论 / Vibe Coding",
      "description": "围绕《虚幻引擎5模块化UI架构白皮书》整理一套适用于中大型项目的 UMG 方法论，把 Common UI、MVVM、路由分层和样式资产化收束成可落地的框架实践。",
      "details": [
        "输出《虚幻引擎5模块化UI架构白皮书》，把框架设计抽象成可复用方法论。",
        "梳理 Primary Layout、Shell Layout 与行为基类，明确界面容器和交互分层。",
        "把数据与表现解耦、组合优于继承、树状路由与焦点垄断等核心原则整理成统一框架语言。",
        "引入样式数据资产、UI Material 与软引用加载思路，保证多端 UI 的一致性和可维护性。",
        "把方法论落到实际样例中，验证布局、行为和资产层级的可操作性。",
        "结合 Vibe Coding 过程整理一套更适合快速迭代的框架工作方式。"
      ],
      "achievements": [
        "完成模块化 UI 架构白皮书与详细样例沉淀。",
        "把 UMG 框架讨论从零散经验收束成可复用结构。",
        "为后续 UI 项目的组件拆分和布局复用提供统一基线。"
      ],
      "tech": [
        "UE5",
        "UMG",
        "Blueprint",
        "UI Architecture"
      ],
      "color": "#7ce7d0",
      "links": [
        {
          "label": "DeltaForce UI 白皮书",
          "href": "https://www.bilibili.com/opus/1190448420615094281/?from=readlist"
        }
      ]
    },
    {
      "id": 2,
      "icon": "Wrench",
      "title": "汽车渲染工作流工具链",
      "period": "2023.12 - 至今",
      "category": "编辑器工具 / 工作流 / Blueprint",
      "description": "以汽车渲染工作流为核心，围绕模型整理、资产同步和渲染输出搭建一组 Blueprint 编辑器工具，把重复的人工作业收敛成标准化流水线。",
      "details": [
        "开发汽车模型整理插件，批量处理命名、枢轴点和资产整理。",
        "搭建渲染输出流水线，串联 Runtime Blueprint 与可扩展流程。",
        "结合 OpenUSD、UsdAssetCache 和 DataAsset 组织模型资产与汽车蓝图解耦。",
        "补齐模型资产同步、材质替换和性能优化工具，降低多车渲染维护成本。",
        "把 Maya 侧预处理、Unreal 侧批处理和最终输出串成完整工具链。"
      ],
      "achievements": [
        "将多车型渲染中的重复操作转为可复用工具链。",
        "把 Maya 到 Unreal 的渲染准备流程收敛为标准化步骤。",
        "让设计和渲染同事可以基于统一流程交付多车型内容。"
      ],
      "tech": [
        "UE5",
        "Blueprint",
        "Editor Tools",
        "OpenUSD",
        "UMG",
        "Material",
        "Runtime Blueprint"
      ],
      "color": "#7ce7d0",
      "images": []
    },
    {
      "id": 3,
      "icon": "Gamepad2",
      "title": "局域网 FPS 对战原型",
      "period": "2022.09 - 2022.12",
      "category": "多人玩法 / Networking / UMG",
      "description": "基于现有游戏资源完成一套局域网多人 FPS 蓝图原型，重点验证多人同步、核心战斗循环和游戏内 HUD 的完整协作。",
      "details": [
        "使用 UE4 蓝图系统开发局域网对战功能，实现多人实时对战体验。",
        "搭建稳定的多人网络架构，处理同步机制与延迟问题。",
        "完成角色控制、武器系统和得分机制等核心模块开发与调试。",
        "补齐游戏内 HUD、菜单与交互界面，验证玩法 UI 联动。",
        "围绕 RPC、动画蓝图和基础 Gameplay 循环完成实机联调。"
      ],
      "achievements": [
        "完成多人射击循环的可玩验证。",
        "打通网络同步、角色控制和界面反馈的完整链路。",
        "为后续多人玩法和战斗反馈系统积累了一套蓝图实现经验。"
      ],
      "tech": [
        "UE4",
        "Blueprint",
        "Networking",
        "UMG",
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
      "id": 4,
      "icon": "Sparkles",
      "title": "UE HMI 概念界面项目",
      "period": "2023.10 - 2025.04",
      "category": "HMI / Niagara / 材质动效",
      "description": "围绕设计比赛、POC 台架和概念座舱展示，持续推进 Niagara、材质、UMG 与 Sequencer 在 HMI 场景中的整合落地。",
      "details": [
        "把 HMI 相关工作拆成设计比赛、POC 台架、智能座舱氛围动效和多车型概念展示等不同子项目推进。",
        "持续沉淀 Niagara 粒子、半透明描边、SDF 波纹、音频可视化和移动端界面整合等可复用能力。",
        "在展示交付与概念验证场景里同时兼顾效果表达、实现成本与复用效率。"
      ],
      "achievements": [
        "把 Niagara、材质、UMG 与 Sequencer 串成可复用的 HMI 表现链路。",
        "覆盖设计比赛、台架验证和多车型座舱表现等多类场景。",
        "沉淀了可直接复用的 HMI 粒子、音波和过场动效素材。"
      ],
      "tech": [
        "UE5",
        "Niagara",
        "SDF",
        "Material",
        "UMG",
        "Sequencer",
        "Blueprint",
        "HMI"
      ],
      "color": "#59c8ff",
      "subProjects": [
        {
          "title": "比亚迪 HMI 设计比赛",
          "period": "2023.10 - 2023.11",
          "description": "以设计比赛为目标制作概念展示效果与视频输出。",
          "details": [
            "基于 UI 需求制作 HMI 概念效果。",
            "完成 Niagara 粒子自定义变换与半透明描边材质结合。",
            "使用 UMG 与 Sequencer 完成整体展示输出。"
          ],
          "images": [
            {
              "src": "/gifs/Niagara_Materials/比亚迪入场动画.gif",
              "alt": "比亚迪 HMI 设计比赛的入场概念动效"
            }
          ]
        },
        {
          "title": "广汽丰田 POC 台架",
          "period": "2024.7 - 2024.11",
          "description": "围绕台架验证推进移动端天气系统与材质表现测试。",
          "details": [
            "推进 POC 台架中的 HMI 交互验证。",
            "验证移动端天气系统与视差冰材质表现。"
          ]
        },
        {
          "title": "DesaySV 智能座舱",
          "period": "2024.12 - 2025.04",
          "description": "为智能座舱概念展示制作一整组粒子氛围与状态动效。",
          "details": [
            "围绕 UI 创意图制作粒子氛围动效。",
            "实现 SDF 距离场波纹、音波扰动与音频可视化效果。",
            "覆盖场景切换、开机、来电、加载、音乐等多类状态动画。"
          ],
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
        },
        {
          "title": "郑州日产概念表现",
          "period": "未单独标注",
          "description": "负责情景效果渲染、多车型展示和车载宠物表现扩展。",
          "details": [
            "推进情景效果渲染与多车型展示。",
            "配合汽车渲染工具搭建表现链路。",
            "整合 Metahuman 车载宠物效果。"
          ],
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
          "description": "整合 HMI 交互界面、角色与特效，验证移动端一体化表现。",
          "details": [
            "完成 UMG 界面、角色与特效整合验证。"
          ],
          "images": [
            {
              "src": "/gifs/Mobile_terminal/UMG_1080.gif",
              "alt": "移动端 POC 的 HMI 交互与角色特效整合效果"
            }
          ]
        }
      ]
    },
    {
      "id": 5,
      "icon": "Car",
      "title": "汽车可视化与多端展示",
      "period": "未单独标注",
      "category": "汽车展示 / PBR / 多端适配",
      "description": "围绕 Web、Windows 和 Android 三端分别推进汽车展示能力，验证网页展示、桌面配置器和移动端效果优化的完整链路。",
      "details": [
        "统一围绕多端汽车展示、材质表现、数据驱动和交互模板展开。",
        "把 Web 展示、Windows 配置器与 Android 优化拆成独立子项目推进。",
        "在不同平台上分别处理性能、材质和交互结构问题。"
      ],
      "achievements": [
        "完成 HTML、Windows 与 Android 三类展示形态的验证。",
        "把材质、动画和 UI 交互整合到同一套汽车展示链路。",
        "形成了可复用的跨平台汽车展示与配置验证方案。"
      ],
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
          "description": "面向网页展示场景验证轻量化材质与动画表现。",
          "details": [
            "实现基于 Unlit 的 PBR 材质。",
            "完成材质动画、敞篷动画和贴图优化。"
          ],
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
          "description": "围绕桌面端配置流程搭建数据驱动的展示与交互框架。",
          "details": [
            "实现基于 DataTable 的摄像机机位切换系统。",
            "搭建 UMG 模板框架。",
            "完成 UI 材质动画表现。"
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
          "period": "未单独标注",
          "description": "在移动端持续收敛材质成本与动态效果表现。",
          "details": [
            "完成材质优化。",
            "保留 Niagara 动态表现并控制移动端成本。"
          ]
        }
      ]
    }
  ]
};

// Skills区域内容
export const skillsContent: SkillsContent = {
  "sectionTitle": "能力地图",
  "sectionSubtitle": "Capabilities",
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
      "title": "界面与体验",
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
      "title": "性能与流程",
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
    "UMG",
    "Blueprint",
    "C++",
    "Niagara",
    "Material",
    "Python",
    "Performance Profiling",
    "Editor Tools",
    "LyraUI",
    "Automation Harness"
  ]
};

// Contact区域内容
export const contactContent: ContactContent = {
  "sectionTitle": "开始合作",
  "sectionSubtitle": "Contact",
  "description": "如果你需要一个能同时处理项目实现、界面系统、视觉表现、工具链和技术验证的人，我愿意直接参与问题推进与交付。",
  "email": "an15073025868@163.com",
  "phone": "15073025868",
  "location": "深圳、广州"
};

// Footer区域内容
export const footerContent: FooterContent = {
  "logo": "Tech",
  "logoHighlight": "Home",
  "tagline": "Personal technical work across systems, visuals and workflow",
  "navLinks": [
    {
      "label": "首页",
      "href": "#hero"
    },
    {
      "label": "项目经历",
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
  "copyright": "© 2026 Personal Technical Homepage. All rights reserved."
};
