/* =========================================================================
   Translation dictionary — Chinese (zh-CN)
   -------------------------------------------------------------------------
   English lives in index.html and is captured at runtime, so this file only
   has to maintain the non-primary language. Keys map 1:1 to `data-i18n`,
   `data-i18n-html` and `data-i18n-aria` attributes in the markup.
   ========================================================================= */

window.PORTFOLIO_I18N = {
  meta: {
    en: {
      title: "Jinxiao (Johnny) Zhou — Software & Data Engineer",
      description:
        "Portfolio of Jinxiao (Johnny) Zhou — Master of Engineering candidate at the University of Toronto, working across software engineering, data analytics and applied machine learning."
    },
    zh: {
      title: "周津霄 Johnny Zhou — 软件与数据工程师",
      description:
        "周津霄（Johnny Zhou）个人作品集 —— 多伦多大学工程硕士在读，方向为数据分析与机器学习，专注软件工程、数据挖掘与后端开发。"
    }
  },

  zh: {
    /* ---------- Accessibility ---------- */
    "a11y.skip": "跳转到主要内容",
    "a11y.theme": "切换深浅色主题",
    "a11y.menu": "打开导航菜单",
    "a11y.top": "返回顶部",

    /* ---------- Brand & nav ---------- */
    "brand.sub": "软件与数据",
    "nav.about": "关于我",
    "nav.education": "教育背景",
    "nav.experience": "实习经历",
    "nav.projects": "项目经历",
    "nav.skills": "技能特长",
    "nav.contact": "联系方式",

    /* ---------- Hero ---------- */
    "hero.name": '周津霄 <span class="hero-nick">(Johnny Zhou)</span>',
    "hero.badge": "加拿大·多伦多 · 开放 2027 届校招岗位",
    "hero.role": "多伦多大学工程硕士在读，方向为数据分析与机器学习。",
    "hero.summary":
      "具备扎实后端功底的软件工程师，熟悉 Java；目前延伸至数据分析、离散事件仿真与应用机器学习。我偏爱可度量、有测试、真正能上线的系统。",
    "hero.cta.projects": "查看项目",
    "hero.cta.resume": "下载中文简历",
    "hero.cta.email": "联系我",
    "hero.stat1.k": "实习经历",
    "hero.stat2.k": "工程项目",
    "hero.stat3.k": "语言能力",
    "hero.stat4.k": "预计毕业",

    /* ---------- About ---------- */
    "about.title": "关于我",
    "about.sub": "在软件工程与数据之间工作。",
    "about.p1":
      "我是周津霄（Johnny）。目前就读于多伦多大学机械与工业工程专业攻读工程硕士，方向为数据分析与机器学习；本科毕业于约克大学，获信息技术荣誉文学学士学位。",
    "about.p2":
      "我的工作横跨软件工程与数据两侧：曾用 Java 为 VoIP 开放平台开发后端服务，与 C++ 核心函数建立低延迟 RPC 链路；也曾实地交付宇树人形机器人与四足机器狗，并用全英文为韩方工程师开展二次开发培训。在数据侧，我用 Python 构建客户流失预测模型，用 Java 编写离散事件仿真，并用 SQL 设计关系型与对象关系型数据库结构。",
    "about.p3":
      "我看重清晰：可读的代码、有测试的行为，以及非技术同事也能直接据此决策的报告与看板。",
    "about.facts.title": "快速了解",
    "about.fact.location": "所在地",
    "about.fact.focus": "专注方向",
    "about.fact.focus.v": "数据分析 · 机器学习 · 后端开发",
    "about.fact.degree": "当前学位",
    "about.fact.degree.v": "多伦多大学 工程硕士",
    "about.fact.status": "求职状态",
    "about.fact.status.v": "开放实习与校招岗位",

    /* ---------- Education ---------- */
    "edu.title": "教育背景",
    "edu.sub": "两个学位，一个方向：从信息技术延伸到应用数据科学。",
    "edu.u1.degree": "机械与工业工程 · 工程硕士",
    "edu.u1.emphasis": "专业方向：数据分析与机器学习",
    "edu.u1.gpa": "综合成绩 3.43 / 4.0",
    "edu.u1.c3": "数据科学导论（B+）",
    "edu.u1.c4": "人工智能在金融中的应用（B+）",
    "edu.u2.degree": "信息技术 · 荣誉文学学士",
    "edu.u2.gpa": "专业 GPA 7.20 / 9.0",
    "edu.u2.c1": "数据挖掘",
    "edu.u2.c2": "模型优化",
    "edu.u2.c3": "面向对象设计与编程",
    "edu.u2.c4": "数据库设计",
    "edu.u2.c5": "响应式 Web 应用",
    "edu.u2.c6": "分布式系统设计",

    /* ---------- Experience ---------- */
    "exp.title": "实习经历",
    "exp.sub": "后端服务、机器人实地交付，以及跨语言的技术培训。",
    "exp.e1.role": "初级软件工程师",
    "exp.e1.org": "浙江宇蓝智能应急机器人研究院有限公司",
    "exp.e1.b1":
      "实地交付宇树 G1 人形机器人与 Go2 四足机器狗，在紧张的项目周期内完成算力背包的物理安装与软硬件联调。",
    "exp.e1.b2":
      "搭建基于 Ubuntu 的开发环境，配置 Unitree SDK 2 与 CycloneDDS 节点，打通低延迟的端到端控制链路。",
    "exp.e1.b3":
      "针对设备延误制定应急替代方案，并使用全英文指导韩方工程师开展二次开发。",
    "exp.e2.role": "Java 开发实习生",
    "exp.e2.org": "宁波菊风系统软件有限公司",
    "exp.e2.b1":
      "使用 Java 在 VoIP 开放平台上开发核心后端功能，处理结构化 JSON 数据，并与底层 C++ 核心函数建立低延迟 RPC 连接。",
    "exp.e2.b2":
      "使用 Postman 模拟客户端网络请求，开展集成测试、验证 API 接口并排查跨模块调用问题。",
    "exp.e2.b3":
      "保障平台生态内的跨平台兼容性与系统稳定性，支撑服务的可靠交付。",

    /* ---------- Projects ---------- */
    "proj.title": "项目经历",
    "proj.sub": "课程作品与个人实践 —— 建模、仿真与数据库设计。",
    "proj.viewRepo": "查看代码仓库",
    "proj.p1.kind": "机器学习",
    "proj.p1.title": "信用卡用户流失分析",
    "proj.p1.desc":
      "在 Jupyter 中使用 Python 与 Scikit-learn 构建客户流失预测流程，以 Seaborn 完成可视化，并在建模前完成特征变换、缺失值填充、离群值处理与聚类。",
    "proj.p1.b1":
      "使用 5 折交叉验证对 KNN、朴素贝叶斯、决策树、SVC 与 XGBoost 进行测试与调参。",
    "proj.p1.b2": "提交包含模型性能分析与商业建议的最终提案。",
    "proj.p2.kind": "数据库设计",
    "proj.p2.title": "房地产数据管理系统",
    "proj.p2.desc":
      "基于对象关系型 SQL schema 设计并实现的数据系统，从问题范围界定、用户视图定义一路落地到可运行实现。",
    "proj.p2.b1": "以类图记录设计，并将其转化为 SQL type 与 type body 定义。",
    "proj.p2.b2": "整合多态成员函数，优雅处理不同的房产子类型。",
    "proj.p2.tag3": "数据建模",
    "proj.p3.kind": "系统仿真",
    "proj.p3.title": "加油站离散事件仿真",
    "proj.p3.desc":
      "使用 Java 构建的加油站离散事件仿真，包含事件调度内核、JUnit 单元测试与可直接演示的结果输出。",
    "proj.p3.b1": "修复遗留代码中的缺陷，并使用 JUnit 补充单元测试。",
    "proj.p3.b2": "在汇报中演示事件调度流程与仿真结果。",

    /* ---------- Skills ---------- */
    "skills.title": "技能特长",
    "skills.sub": "按实际使用场景归类的技术栈。",
    "skills.g1": "编程语言",
    "skills.g2": "框架与工具",
    "skills.g3": "数据库",
    "skills.g4": "数据与分析",
    "skills.level.adv": "熟练",
    "skills.level.int": "掌握",
    "skills.g3.t1": "关系型数据库设计",
    "skills.g3.t2": "面向对象建模",
    "skills.g4.t1": "数据可视化",
    "skills.g4.t2": "模型微调",
    "skills.g4.t3": "机器学习",
    "skills.g4.t4": "强化学习",

    /* ---------- More ---------- */
    "more.title": "代码之外",
    "more.sub": "社团、证书与语言能力。",
    "more.act.title": "校园经历",
    "more.act.a1.title": "活动策划 —— Viewfinder 摄影社",
    "more.act.a1.meta": "活动部 · 2025.09 – 2026.08",
    "more.act.a1.b1":
      "参与社团活动的策划与统筹，独立设计并制作结构化报名表，高效收集与整理报名数据。",
    "more.act.a1.b2":
      "对活动数据进行统计分析并撰写数据报告，通过分析参与者反馈向社团管理层提供可视化汇报。",
    "more.cert.title": "证书与荣誉",
    "more.cert.c1": "CSIA 认证一级滑雪教练",
    "more.cert.c2": "汇丰银行（HSBC）开放日表彰证书（2022）",
    "more.cert.c3": "2024 多伦多—约克大学 Terry Fox Run 公益长跑（10 公里）",
    "more.lang.title": "语言能力",
    "more.lang.l1": "英语",
    "more.lang.l1.v": "流利 · 可作为工作语言",
    "more.lang.l2": "普通话",
    "more.lang.l2.v": "母语",
    "more.lang.l3": "法语",
    "more.lang.l3.v": "基础 · A2",

    /* ---------- Contact ---------- */
    "contact.title": "联系我",
    "contact.sub": "欢迎实习、校招岗位以及有意思的副业项目。",
    "contact.location": "所在地",

    /* ---------- Footer ---------- */
    "footer.rights": "保留所有权利。",
    "footer.built": "纯手工设计与构建 —— 无框架，无追踪。"
  }
};
