import {
  HeroContent,
  AboutContent,
  ProjectsContent,
  SkillsContent,
  ContactContent,
  FooterContent,
} from '../types/content';

export const heroContent: HeroContent = {
  "badge": "Technical Artist / Unreal",
  "name": "技术美术",
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

export const aboutContent: AboutContent = {
  "sectionTitle": "关于",
  "sectionSubtitle": "About",
  "bio": [],
  "age": 24,
  "location": "",
  "experience": 3,
  "jobTitle": "Technical Artist",
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
      "description": "以汽车渲染工作流为核心，围绕模型整理、资产同步和渲染输出搭建一组编辑器工具，把重复的人工作业收敛成标准化 TA 流水线。",
      "details": [
        "开发汽车模型整理插件，批量处理命名、枢轴点和资产归档。",
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
      "description": "聚焦 Niagara、材质扰动和实时氛围表达的一组技术美术项目，覆盖比赛展示、座舱氛围动效和转场节奏设计。",
      "details": [
        "把比亚迪概念展示特效和 DesaySV 智能座舱统一收口为特效方向展示。",
        "覆盖粒子形态、SDF 波纹、音频可视化和空间氛围等不同特效类型。",
        "强调从概念展示到座舱氛围表达的完整能力，而不是混在交互项目里。"
      ],
      "achievements": [
        "形成从座舱氛围到入场过场的特效案例集合。",
        "把特效能力从交互叙事中独立出来，归类更清晰。",
        "保留了可直接对外展示的项目入口和实机效果素材。"
      ],
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
          "description": "以设计比赛为目标制作概念展示特效与视频输出，重点放在入场节奏、粒子形态和视觉记忆点上。",
          "details": [
            "围绕界面概念展示制作入场特效和整体节奏设计。",
            "完成 Niagara 粒子自定义变换与半透明描边材质结合。",
            "使用 UMG 与 Sequencer 完成整体展示输出。"
          ],
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
          "description": "为智能座舱概念展示制作一整组粒子氛围、状态切换和音波反馈特效。",
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
        }
      ]
    },
    {
      "id": 3,
      "icon": "Car",
      "title": "汽车可视化与多端展示",
      "period": "未单独标注",
      "category": "Real-time Rendering / Automotive Visualization / Multi-platform",
      "description": "围绕 Web、Windows 和 Android 三端推进汽车实时展示能力，验证材质、灯光、动画与交互在多端场景中的落地。",
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
          "period": "未单独标注",
          "description": "在移动端持续收敛材质成本与动态效果表现。",
          "details": [
            "完成材质优化。",
            "保留 Niagara 动态表现并控制移动端成本。"
          ]
        }
      ]
    },
    {
      "id": 4,
      "icon": "PanelsTopLeft",
      "title": "UI 材质动画作品",
      "period": "未单独标注",
      "category": "UI Technical Art / Material Animation / Motion",
      "description": "围绕 UI 材质、参数驱动和状态转场整理的一组技术美术案例，重点展示界面层的节奏、质感和连续反馈。",
      "details": [
        "把界面材质变化、参数动画和转场组织成独立项目表达。",
        "重点展示 UI 材质在状态反馈、层级切换和动态质感上的控制能力。",
        "用单独案例说明我在界面技术与技术美术交叉位置上的方法和结果。"
      ],
      "achievements": [
        "补齐了个人主页里 UI 材质动画方向的独立项目样本。",
        "让界面动态与材质表现成为可单独展示的技术美术能力。",
        "形成一个可以直接对外引用的 UI 材质动画案例入口。"
      ],
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
      "description": "围绕《虚幻引擎5模块化UI架构白皮书》整理一套实时界面技术方法论，把 Common UI、MVVM、路由分层和样式资产化收束成可复用框架实践。",
      "details": [
        "输出《虚幻引擎5模块化UI架构白皮书》，把框架设计抽象成可复用方法论。",
        "梳理 Primary Layout、Shell Layout 与行为基类，明确界面容器和交互分层。",
        "把数据与表现解耦、组合优于继承、树状路由与焦点垄断等核心原则整理成统一框架语言。",
        "引入样式数据资产、UI Material 与软引用加载思路，保证多端 UI 的一致性和可维护性。",
        "把方法论落到实际样例中，验证布局、行为和资产层级的可操作性。"
      ],
      "achievements": [
        "完成模块化界面技术白皮书与详细样例沉淀。",
        "把界面技术讨论从零散经验收束成可复用结构。",
        "为后续 UI 项目的组件拆分和布局复用提供统一基线。"
      ],
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
      "description": "围绕 POC 台架、概念展示和移动端验证，推进材质、交互流程与展示链路在实时场景中的整合落地。",
      "details": [
        "把项目聚焦到 POC 台架、移动端验证和多车型概念展示等交互场景。",
        "重点处理界面结构、材质表现、功能验证和展示链路之间的协同。",
        "在概念验证与展示交付场景里兼顾交互可读性、实现效率和整体完成度。"
      ],
      "achievements": [
        "形成覆盖台架验证、移动端展示和概念演示的交互项目链路。",
        "打通 UMG、材质和交互状态在概念项目中的整合方式。",
        "沉淀了适合概念验证与展示交付的组合流程。"
      ],
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
          "description": "围绕台架验证推进移动端天气系统与材质表现测试。",
          "details": [
            "推进 POC 台架中的交互验证。",
            "验证移动端天气系统与视差冰材质表现。"
          ]
        },
        {
          "title": "郑州日产概念表现",
          "period": "未单独标注",
          "description": "负责概念演示中的情景效果渲染、多车型展示和车载宠物表现扩展。",
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
          "description": "整合交互界面、角色与特效，验证移动端一体化表现。",
          "details": [
            "完成交互界面、角色与特效整合验证。"
          ],
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
      "description": "基于现有游戏资源完成一套局域网多人 FPS 蓝图原型，重点验证多人同步、核心战斗循环和游戏内反馈的完整协作。",
      "details": [
        "使用 UE4 蓝图系统开发局域网对战功能，实现多人实时对战体验。",
        "搭建稳定的多人网络架构，处理同步机制与延迟问题。",
        "完成角色控制、武器系统和得分机制等核心模块开发与调试。",
        "补齐游戏内 HUD、菜单与交互界面，验证玩法反馈联动。",
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
        "Gameplay"
      ],
      "color": "#f0b562",
      "images": [
        {
          "src": "/gifs/FPS.high.gif",
          "alt": "局域网 FPS 原型的实机对战画面"
        }
      ]
    }
  ]
};

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

export const contactContent: ContactContent = {
  "sectionTitle": "开始合作",
  "sectionSubtitle": "Contact",
  "description": "如果你需要一个能把实时视觉、材质特效、渲染工具链和项目落地串起来的人，我愿意直接参与问题推进与交付。",
  "email": "an15073025868@163.com",
  "phone": "15073025868",
  "location": ""
};

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
