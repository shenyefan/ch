export const LANGUAGE_COOKIE = 'ch_lang';

export type Language = 'en' | 'zh' | 'ar';

export const SUPPORTED_LANGUAGES: Language[] = ['en', 'zh', 'ar'];

export function normalizeLanguage(value: string | null | undefined): Language {
  return SUPPORTED_LANGUAGES.includes(value as Language) ? (value as Language) : 'en';
}

export function getLanguageDirection(language: Language): 'ltr' | 'rtl' {
  return language === 'ar' ? 'rtl' : 'ltr';
}

export const languageLabels: Record<Language, { flag: string; label: string }> = {
  en: { flag: '🇺🇸', label: 'English' },
  zh: { flag: '🇨🇳', label: '中文' },
  ar: { flag: '🇸🇦', label: 'العربية' },
};

export const copy = {
  navbar: {
    brand: { en: 'Chinese-Heritage', zh: '中华建筑遗产', ar: 'التراث المعماري الصيني' },
    home: { en: 'Home', zh: '首页', ar: 'الرئيسية' },
    about: { en: 'About', zh: '关于', ar: 'نبذة' },
    explore: { en: 'Explore', zh: '探索', ar: 'استكشف' },
    marvels: { en: 'Marvels', zh: '奇观', ar: 'الروائع' },
    treasures: { en: 'Treasures', zh: '珍藏', ar: 'الكنوز' },
    selectCity: { en: 'Select City', zh: '选择城市', ar: 'اختر مدينة' },
    chooseCity: { en: 'Choose a City', zh: '选择一座城市', ar: 'اختر مدينة' },
    login: { en: 'Login', zh: '登录', ar: 'تسجيل الدخول' },
    signup: { en: 'Sign Up', zh: '注册', ar: 'إنشاء حساب' },
    logout: { en: 'Logout', zh: '退出登录', ar: 'تسجيل الخروج' },
    account: { en: 'Account', zh: '账户', ar: 'الحساب' },
    admin: { en: 'Admin', zh: '管理后台', ar: 'الإدارة' },
    cityMeta: {
      beijing: { en: 'Forbidden City', zh: '故宫', ar: 'المدينة المحرمة' },
      xian: { en: 'Terracotta Army', zh: '兵马俑', ar: 'جيش التيراكوتا' },
      suzhou: { en: 'Classical Gardens', zh: '古典园林', ar: 'الحدائق الكلاسيكية' },
    },
  },
  home: {
    heroEyebrow: {
      en: 'Experience Beauty of Chinese Architecture',
      zh: '感受中国建筑之美',
      ar: 'اختبر جمال العمارة الصينية',
    },
    heroTitleLine1: {
      en: 'Discover Timeless Elegance',
      zh: '探索跨越时光的雅致',
      ar: 'اكتشف الأناقة الخالدة',
    },
    heroTitleLine2: {
      en: "of China's Historic Buildings",
      zh: '走进中国历史建筑',
      ar: 'في مباني الصين التاريخية',
    },
    heroDescription: {
      en: "Explore Rich Cultural Heritage of China's Architectural Wonders — from towering pagodas to serene imperial temples.",
      zh: '探索中国建筑奇观背后的深厚文化遗产，从巍峨宝塔到静谧宫苑。',
      ar: 'استكشف التراث الثقافي الغني لعجائب العمارة الصينية، من الأبراج الشاهقة إلى المعابد الإمبراطورية الهادئة.',
    },
    signupNow: { en: 'Sign Up Now', zh: '立即注册', ar: 'سجل الآن' },
    login: { en: 'Login', zh: '登录', ar: 'تسجيل الدخول' },
    playGame: { en: 'Play Game', zh: '开始游戏', ar: 'ابدأ اللعبة' },
    exploreCities: { en: 'Explore Cities', zh: '探索城市', ar: 'استكشف المدن' },
    historicCities: { en: 'Historic Cities', zh: '历史名城', ar: 'مدن تاريخية' },
    yearsOfHistory: { en: 'Years of History', zh: '年历史积淀', ar: 'سنوات من التاريخ' },
    iconicLandmarks: { en: 'Iconic Landmarks', zh: '地标建筑', ar: 'معالم أيقونية' },
    featuredCities: { en: 'Featured Cities', zh: '精选城市', ar: 'مدن مميزة' },
    featuredCitiesDesc: {
      en: "Experience the architectural wonders of China's most historic cities",
      zh: '感受中国最具历史底蕴城市中的建筑奇观',
      ar: 'عش روائع العمارة في أكثر مدن الصين التاريخية شهرة',
    },
    historicCity: { en: 'Historic City', zh: '历史名城', ar: 'مدينة تاريخية' },
    reviews: { en: 'reviews', zh: '条评价', ar: 'مراجعة' },
    visitCity: { en: 'Visit', zh: '前往', ar: 'زر' },
    immerse: { en: 'Immerse Yourself', zh: '沉浸其中', ar: 'انغمس في التجربة' },
    immerseDesc: {
      en: "China's architectural landscape is a tapestry of ancient wisdom and modern innovation",
      zh: '中国建筑景观交织着古老智慧与现代创新',
      ar: 'المشهد المعماري في الصين نسيج من الحكمة القديمة والابتكار الحديث',
    },
    aboutSteps: {
      discover: {
        title: { en: 'Discover the Artistry', zh: '发现建筑之艺', ar: 'اكتشف فن العمارة' },
        desc: {
          en: "Chinese architecture blends harmonious aesthetics with practical functionality — a testament to the country's rich cultural heritage spanning thousands of years.",
          zh: '中国建筑将和谐美学与实用功能相融合，见证着绵延数千年的文化传统。',
          ar: 'تمزج العمارة الصينية بين الجمال المتناغم والوظيفة العملية، شاهدة على تراث ثقافي يمتد لآلاف السنين.',
        },
      },
      explore: {
        title: { en: 'Explore the Cities', zh: '探索城市风貌', ar: 'استكشف المدن' },
        desc: {
          en: "From the Forbidden City in Beijing to the Terracotta Army in Xi'an, journey through China's most iconic historical destinations.",
          zh: '从北京故宫到西安兵马俑，穿行于中国最具代表性的历史目的地。',
          ar: 'من المدينة المحرمة في بكين إلى جيش التيراكوتا في شيآن، سافر عبر أبرز الوجهات التاريخية في الصين.',
        },
      },
      uncover: {
        title: { en: 'Uncover the Secrets', zh: '揭开匠心奥秘', ar: 'اكشف الأسرار' },
        desc: {
          en: 'Delve into the design principles and techniques passed down through generations, uncovering the fascinating histories behind each marvel.',
          zh: '深入了解代代相传的设计理念与工艺技术，揭开每一处奇观背后的历史故事。',
          ar: 'تعمق في مبادئ التصميم والتقنيات المتوارثة عبر الأجيال، واكشف التاريخ المدهش خلف كل معلم.',
        },
      },
    },
    marvelsTitle: { en: 'Architectural Marvels', zh: '建筑奇观', ar: 'روائع معمارية' },
    marvelsDesc: {
      en: "Three distinct traditions that shaped China's built environment",
      zh: '塑造中国建筑环境的三大传统脉络',
      ar: 'ثلاثة تقاليد مميزة شكّلت البيئة المعمارية في الصين',
    },
    marvels: {
      imperial: {
        title: { en: 'Imperial Architecture', zh: '皇家建筑', ar: 'العمارة الإمبراطورية' },
        features: {
          en: ['Forbidden City & Palace Complexes', 'Ceremonial Hall Design', 'Yellow Glazed Tile Roofs', 'Strict Symmetrical Layouts', 'Dragon Symbolism & Carvings'],
          zh: ['故宫与宫殿群', '礼制大殿设计', '黄色琉璃瓦屋顶', '严格中轴对称布局', '龙纹象征与雕刻'],
          ar: ['المدينة المحرمة ومجمعات القصور', 'تصميم قاعات المراسم', 'أسقف القرميد الأصفر المزجج', 'تناظرات صارمة في التخطيط', 'رمزية التنين والزخارف'],
        },
      },
      military: {
        title: { en: 'Military Architecture', zh: '军事建筑', ar: 'العمارة العسكرية' },
        badge: { en: 'Most Iconic', zh: '最具代表性', ar: 'الأكثر شهرة' },
        features: {
          en: ['The Great Wall of China', 'Beacon Tower Networks', 'Terracotta Army Vaults', 'Tang Dynasty City Walls', 'Ancient Defense Systems'],
          zh: ['中国长城', '烽火台网络', '兵马俑坑遗址', '唐代城墙', '古代防御体系'],
          ar: ['سور الصين العظيم', 'شبكات أبراج الإشعال', 'أقبية جيش التيراكوتا', 'أسوار مدن سلالة تانغ', 'أنظمة الدفاع القديمة'],
        },
      },
      gardens: {
        title: { en: 'Classical Gardens', zh: '古典园林', ar: 'الحدائق الكلاسيكية' },
        features: {
          en: ["Scholar's Garden Design", 'Pavilion & Corridor Networks', 'Rockery & Pond Landscapes', 'Philosophical Spatial Harmony', 'UNESCO World Heritage Sites'],
          zh: ['文人园林设计', '亭台回廊网络', '假山与池水景观', '富有哲思的空间和谐', '联合国世界遗产'],
          ar: ['تصميم حدائق العلماء', 'شبكات الأجنحة والممرات', 'مناظر الصخور والبرك', 'تناغم فلسفي في الفضاء', 'مواقع تراث عالمي لليونسكو'],
        },
      },
    },
    visitorStories: { en: 'Visitor Stories', zh: '游客故事', ar: 'قصص الزوار' },
    visitorStoriesDesc: {
      en: "Real experiences from travelers who have explored China's architectural heritage",
      zh: '来自探索过中国建筑遗产的旅行者的真实体验',
      ar: 'تجارب حقيقية من مسافرين استكشفوا التراث المعماري الصيني',
    },
    visited: { en: 'Visited', zh: '到访', ar: 'زار' },
    journeyEyebrow: { en: 'Begin Your Journey', zh: '开启旅程', ar: 'ابدأ رحلتك' },
    journeyTitle: { en: 'Timeless Treasures Await', zh: '永恒珍宝正待探索', ar: 'كنوز خالدة بانتظارك' },
    journeyDesc: {
      en: "Unlock the stories behind China's most iconic structures. Sign up free and start exploring today.",
      zh: '解锁中国标志性建筑背后的故事，免费注册，立即开始探索。',
      ar: 'اكتشف القصص وراء أشهر معالم الصين. سجّل مجانًا وابدأ الاستكشاف اليوم.',
    },
    beginJourney: { en: 'Begin Journey', zh: '开始旅程', ar: 'ابدأ الرحلة' },
    freeToJoin: { en: 'Free to join · No credit card required', zh: '免费加入 · 无需信用卡', ar: 'الانضمام مجاني · لا حاجة لبطاقة ائتمان' },
  },
  footer: {
    about: {
      en: "Dedicated to preserving and sharing the architectural wonders of China's rich cultural heritage for generations to come.",
      zh: '致力于为后代保存并分享中国丰富文化遗产中的建筑奇观。',
      ar: 'مكرسون للحفاظ على روائع العمارة في التراث الثقافي الصيني ومشاركتها مع الأجيال القادمة.',
    },
    quickLinks: { en: 'Quick Links', zh: '快捷链接', ar: 'روابط سريعة' },
    exploreCities: { en: 'Explore Cities', zh: '探索城市', ar: 'استكشف المدن' },
    contact: { en: 'Contact', zh: '联系', ar: 'اتصل بنا' },
    privacy: { en: 'Privacy Policy', zh: '隐私政策', ar: 'سياسة الخصوصية' },
    terms: { en: 'Terms of Service', zh: '服务条款', ar: 'شروط الخدمة' },
    cookies: { en: 'Cookies', zh: 'Cookies', ar: 'ملفات تعريف الارتباط' },
    rights: { en: 'All rights reserved.', zh: '保留所有权利。', ar: 'جميع الحقوق محفوظة.' },
  },
  city: {
    heritage: { en: 'Chinese Heritage', zh: '中华建筑遗产', ar: 'التراث المعماري الصيني' },
    immerseTitle: { en: 'Immerse Yourself', zh: '沉浸其中', ar: 'انغمس في التجربة' },
    immerseDesc: {
      en: "China's architectural landscape is a tapestry of ancient wisdom and modern innovation.",
      zh: '中国建筑景观交织着古老智慧与现代创新。',
      ar: 'المشهد المعماري في الصين نسيج من الحكمة القديمة والابتكار الحديث.',
    },
    readMore: { en: 'Read More', zh: '了解更多', ar: 'اقرأ المزيد' },
    visualInteractive: { en: 'Visual Interactive', zh: '可视交互', ar: 'تجربة بصرية' },
    exploreStatues: { en: 'Explore Statues', zh: '探索雕像', ar: 'استكشف التماثيل' },
    landmarks: { en: 'City Landmarks', zh: '城市地标', ar: 'معالم المدينة' },
    aboutCity: { en: 'About', zh: '关于', ar: 'حول' },
    backToCities: { en: 'Back to Cities', zh: '返回城市列表', ar: 'العودة إلى المدن' },
    chapter: { en: 'Chapter', zh: '章节', ar: 'الفصل' },
    pagesOfStories: { en: 'pages of heritage stories', zh: '页文化故事', ar: 'صفحات من حكايات التراث' },
    previousChapter: { en: 'Previous chapter', zh: '上一章节', ar: 'الفصل السابق' },
    nextChapter: { en: 'Next chapter', zh: '下一章节', ar: 'الفصل التالي' },
    closeModal: { en: 'Close modal', zh: '关闭弹窗', ar: 'إغلاق النافذة' },
    visitingTips: { en: 'Visiting tips', zh: '游览提示', ar: 'نصائح الزيارة' },
    viewOnMap: { en: 'View on Map', zh: '在地图中查看', ar: 'اعرض على الخريطة' },
  },
  map: {
    eyebrow: { en: 'Landmark Explorer', zh: '地标地图', ar: 'مستكشف المعالم' },
    title: { en: 'Explore Landmarks on the Map', zh: '在地图中探索地标', ar: 'استكشف المعالم على الخريطة' },
    description: {
      en: 'Browse city landmarks, jump to any point on the Baidu map, and open details directly from each marker.',
      zh: '浏览城市地标，直接在百度地图上定位任意点位，并从标记中打开详情。',
      ar: 'تصفّح معالم المدن، وانتقل إلى أي نقطة على خريطة بايدو، وافتح التفاصيل مباشرة من كل علامة.',
    },
    cities: { en: 'Cities', zh: '城市', ar: 'المدن' },
    landmarks: { en: 'Landmarks', zh: '地标', ar: 'المعالم' },
    loadingMap: { en: 'Loading Baidu map...', zh: '正在加载百度地图...', ar: 'جارٍ تحميل خريطة بايدو...' },
    loadingLandmarks: { en: 'Loading landmarks...', zh: '正在加载地标...', ar: 'جارٍ تحميل المعالم...' },
    noLandmarks: { en: 'No landmarks are available for this city yet.', zh: '该城市暂时没有可展示的地标。', ar: 'لا توجد معالم متاحة لهذه المدينة حالياً.' },
    mapError: { en: 'Baidu map could not be loaded right now.', zh: '当前无法加载百度地图。', ar: 'تعذر تحميل خريطة بايدو حالياً.' },
    focusLandmark: { en: 'Focus landmark', zh: '聚焦地标', ar: 'تركيز المعلم' },
    activeLandmark: { en: 'Selected landmark', zh: '当前地标', ar: 'المعلم المحدد' },
    cityOverview: { en: 'City overview', zh: '城市概览', ar: 'نظرة عامة على المدينة' },
  },
  game: {
    title: { en: 'The Lost Guardian', zh: '失落的守卫', ar: 'الحارس الضائع' },
    desc: {
      en: "Insolent servant! A terrible storm has scattered the sacred guardians from the Forbidden City's rooftops. The palace's yin-yang balance is broken — you must recover the five lost relics. Do not fail!",
      zh: '大胆奴才！一场可怕的风暴将故宫屋顶的神圣守卫吹散。宫殿的阴阳平衡已失，你必须寻回散落的五件遗迹。不得有误！',
      ar: 'أيها الخادم الوقح! عاصفة مروعة بعثرت الحراس المقدسين من أسطح المدينة المحرمة. توازن الين واليانغ في القصر قد اختل — عليك استرداد الخمس آثار الضائعة. لا تخذلنا!',
    },
    controlsLabel: { en: 'Controls: ', zh: '操作：', ar: 'التحكم: ' },
    controls: {
      en: 'WASD to move, mouse to look around. Approach relics to collect them.',
      zh: 'WASD 移动，鼠标环视。靠近遗迹即可收集。',
      ar: 'WASD للتحرك، الفأرة للنظر حولك. اقترب من الآثار لجمعها.',
    },
    enter: { en: 'ENTER GAME', zh: '进入游戏', ar: 'ادخل اللعبة' },
    exit: { en: 'EXIT', zh: '退出', ar: 'خروج' },
    locationTag: { en: 'Forbidden City', zh: '故宫 · Forbidden City', ar: 'المدينة المحرمة' },
    loading: { en: 'Loading game assets...', zh: '游戏资源加载中...', ar: 'جار تحميل ملفات اللعبة...' },
  },
  chat: {
    title: { en: 'AI Heritage Assistant', zh: 'AI 文化遗产助手', ar: 'مساعد التراث الذكي' },
    subtitle: { en: 'Powered by DeepSeek', zh: '由 DeepSeek 驱动', ar: 'مدعوم بـ DeepSeek' },
    placeholder: { en: 'Ask about Chinese heritage…', zh: '询问中国文化遗产…', ar: 'اسأل عن التراث الصيني…' },
    welcome: {
      en: "Hello! I'm your AI Heritage Assistant. Ask me anything about Chinese architecture and cultural history!",
      zh: '你好！我是你的 AI 文化遗产助手。欢迎向我提问有关中国建筑与文化历史的任何问题！',
      ar: 'مرحباً! أنا مساعدك الذكي للتراث. اسألني أي شيء عن العمارة الصينية وتاريخها الثقافي!',
    },
  },
  statues: {
    eyebrow: { en: 'Forbidden City', zh: '故宫', ar: 'المدينة المحرمة' },
    title: { en: 'Guardian Roof Statues', zh: '屋脊神兽', ar: 'تماثيل حراس الأسقف' },
    subtitle: {
      en: "The roof statues of the Forbidden City serve both decorative and spiritual purposes, protecting the imperial buildings from evil spirits and bad fortune. Click on each statue to discover its meaning and symbolism.",
      zh: '故宫屋脊上的神兽兼具装饰与辟邪双重功效，守护着皇家建筑免受邪灵与厄运侵扰。点击每尊神兽，探寻其背后的象征与寓意。',
      ar: 'تؤدي تماثيل أسطح المدينة المحرمة وظيفتين: الزينة والحماية الروحية من الأرواح الشريرة وسوء الحظ. انقر على كل تمثال لتكتشف معناه ورمزيته.',
    },
    flipHint: { en: 'Click a card to flip', zh: '点击卡片翻转', ar: 'انقر على البطاقة للتقليب' },
    items: [
      {
        image: 'long.jpg',
        title: { en: 'Dragon: Imperial Dragon', zh: '龙：帝王之龙', ar: 'التنين الإمبراطوري' },
        desc: {
          en: 'Symbolizing the Emperor. Since Qin Shi Huang was called "Ancestral Dragon," many ancient emperors considered the dragon to be the image of the ruler and called themselves "Sons of Heaven." The dragon became a symbol of the emperor, closely tied to its supernatural powers in legend — ascending to heaven and diving into the abyss, summoning wind and rain.',
          zh: '象征皇帝。自秦始皇被称为"祖龙"以来，历代帝王皆以龙为君主形象，自称"天子"。龙之所以具有此意，与古代神话传说中龙"升天入渊、呼风唤雨"的神力密不可分。',
          ar: 'يرمز إلى الإمبراطور. منذ أن أُطلق على تشين شي هوانغ لقب "التنين الجدي"، اعتبر كثير من أباطرة الصين القدماء التنين صورةً للحاكم. ارتبط هذا المعنى بقدرات التنين الخارقة في الأساطير.',
        },
      },
      {
        image: 'suanni.jpg',
        title: { en: 'Suan Ni: Mythical Beast', zh: '狻猊：神兽', ar: 'سوان ني: الوحش الأسطوري' },
        desc: {
          en: 'The Suanni is a fierce mythical beast symbolizing the warding off of disasters. It resembles a lion with disheveled hair. The Han Dynasty dictionary Erya states: "The Suanni resembles a cat, and eats tigers and leopards" — meaning it is extraordinarily fierce and can devour tigers and leopards.',
          zh: '狻猊是一种凶猛的神兽，象征辟邪驱灾。其形似狮，但鬃毛蓬乱有别于卷毛之狮。汉代字书《尔雅》记载："狻猊如猫，食虎豹。"意指狻猊形如猫（一种毛色浅淡的虎类），极为凶猛，能吞食虎豹。',
          ar: 'سوان ني وحشٌ أسطوري شرس يرمز إلى درء المصائب. يشبه الأسد لكن فروته منفوشة. يذكر قاموس هان "إيريا" أن سوان ني يشبه القطة ويلتهم النمور والفهود.',
        },
      },
      {
        image: 'shizi.jpg',
        title: { en: 'Shi Zi: Guardian Lion', zh: '狮子：守护狮', ar: 'الأسد الحارس' },
        desc: {
          en: 'The lion symbolizes warding off disasters and evil spirits, and is considered the king of beasts. Its noble and dignified image exudes a regal air. The ancient Indian Buddhist classic Mahaprajnaparamita Sutra states that the lion is an incarnation of the Buddha and can drive away evil.',
          zh: '狮子象征辟邪驱灾，被誉为百兽之王。其威严高贵的形象既透着王者之气，又兼具祥瑞之意。古印度佛典《大智度论》记载，狮子为佛陀化身，能驱散邪魔，因此成为历代统治阶层奉为守护神灵的宝物。',
          ar: 'يرمز الأسد إلى طرد المصائب والأرواح الشريرة، إذ يُعدّ ملك الوحوش. يذكر الكلاسيك البوذي الهندي القديم أن الأسد تجسيدٌ للبوذا ويطرد الشر، فأصبح رمزاً للحراسة لدى الطبقة الحاكمة.',
        },
      },
      {
        image: 'tianma.jpg',
        title: { en: 'Tian Ma: Celestial Horse', zh: '天马：神驹', ar: 'الحصان السماوي' },
        desc: {
          en: 'The celestial horse is a mythical creature of the sky, symbolizing the warding off of disasters. Unlike the seahorse, the celestial horse has wings. The Book of Han records: "When Taiyi descended, the celestial horse was covered in red sweat." Ancient people believed it could travel a thousand miles a day.',
          zh: '天马是翱翔天际的神兽，象征辟邪驱灾。天马与海马的显著区别在于天马有翼。《汉书》记载："太一降，天马汗血，沫流朱赭。"古人相信天马日行千里，是无所畏惧的飞天神兽。',
          ar: 'الحصان السماوي مخلوقٌ أسطوري يرمز إلى درء المصائب. يتميز عن حصان البحر بامتلاكه أجنحة. يروي "كتاب هان": "حين نزل تاييه، كان الحصان السماوي مغطىً بعرق أحمر".',
        },
      },
      {
        image: 'yayu.jpg',
        title: { en: 'Bi Xi: Dragon Turtle', zh: '霸下：龙龟', ar: 'بي شي: سلحفاة التنين' },
        desc: {
          en: 'The Bixi is a mythical creature with the body of a turtle and the head of a dragon, symbolizing longevity, strength, and wisdom. In Chinese mythology, Bixi is one of the nine sons of the dragon and is often depicted carrying stone steles, representing the burden of knowledge and history.',
          zh: '霸下是龙生九子之一，形如龟身龙首，象征长寿、力量与智慧。中国神话中，霸下常被描绘为驮负石碑或石刻的神兽，承载着知识的重量与历史的厚重。',
          ar: 'بي شي مخلوقٌ أسطوري بجسد السلحفاة ورأس التنين، يرمز إلى طول العمر والقوة والحكمة. هو أحد أبناء التنين التسعة ويُصوَّر غالباً حاملاً ألواح الحجر.',
        },
      },
      {
        image: 'haima.jpg',
        title: { en: 'Tao Tie: Mythical Beast', zh: '饕餮：神兽', ar: 'تاو تي: الوحش الأسطوري' },
        desc: {
          en: 'The Taotie is an ancient mythical beast from Chinese mythology, often depicted on bronze vessels from the Shang and Zhou dynasties. It represents greed and gluttony but also serves as a protective symbol commonly found on ancient ritual bronzes and architectural elements.',
          zh: '饕餮是中国古代神话中的神兽，多见于商周时期的青铜器纹饰。它既象征贪婪与暴食，亦具辟邪镇宅之效。饕餮纹常见于古代礼器与建筑构件之上。',
          ar: 'التاوتي وحشٌ أسطوري قديم في الأساطير الصينية، كثيراً ما يُصوَّر على آنية البرونز في عهدَي شانغ وتشو. يرمز إلى الجشع والنهم لكنه يؤدي دور الحارس الواقي أيضاً.',
        },
      },
    ],
  },
} as const;

export function t<T extends Record<Language, string>>(entry: T, language: Language): string {
  return entry[language] ?? entry.en;
}