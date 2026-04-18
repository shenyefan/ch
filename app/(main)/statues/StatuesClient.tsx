'use client';

import { useState } from 'react';
import { type Language } from '@/lib/i18n';

interface Statue {
  image: string;
  title: Record<Language, string>;
  desc: Record<Language, string>;
}

const STATUES: Statue[] = [
  {
    image: 'long.jpg',
    title: {
      en: 'Dragon: Imperial Dragon',
      zh: '龙：帝王之龙',
      ar: 'التنين الإمبراطوري',
    },
    desc: {
      en: 'Symbolizing the Emperor. Since Qin Shi Huang was called "Ancestral Dragon," many ancient emperors considered the dragon to be the image of the ruler and called themselves "Sons of Heaven." The dragon became a symbol of the emperor, closely tied to its supernatural powers in legend — ascending to heaven and diving into the abyss, summoning wind and rain.',
      zh: '象征皇帝。自秦始皇被称为"祖龙"以来，历代帝王皆以龙为君主形象，自称"天子"。龙之所以具有此意，与古代神话传说中龙"升天入渊、呼风唤雨"的神力密不可分。',
      ar: 'يرمز إلى الإمبراطور. منذ أن أُطلق على تشين شي هوانغ لقب "التنين الجدي"، اعتبر كثير من أباطرة الصين القدماء التنين صورةً للحاكم، ولُقِّبوا بـ"أبناء السماء". ارتبط هذا المعنى ارتباطاً وثيقاً بما تحمله الأساطير من قدرات التنين الخارقة، كالصعود إلى السماء والهبوط إلى الأعماق، واستدعاء الريح والمطر.',
    },
  },
  {
    image: 'suanni.jpg',
    title: {
      en: 'Suan Ni: Mythical Beast',
      zh: '狻猊：神兽',
      ar: 'سوان ني: الوحش الأسطوري',
    },
    desc: {
      en: 'The Suanni is a fierce mythical beast symbolizing the warding off of disasters. It resembles a lion with disheveled hair. The Han Dynasty dictionary Erya states: "The Suanni resembles a cat, and eats tigers and leopards" — meaning it is extraordinarily fierce and can devour tigers and leopards.',
      zh: '狻猊是一种凶猛的神兽，象征辟邪驱灾。其形似狮，但鬃毛蓬乱有别于卷毛之狮。汉代字书《尔雅》记载："狻猊如猫，食虎豹。"意指狻猊形如猫（一种毛色浅淡的虎类），极为凶猛，能吞食虎豹。',
      ar: 'سوان ني وحشٌ أسطوري شرس يرمز إلى درء المصائب والأرواح الشريرة. يشبه الأسد لكن فروته منفوشة لا مجعّدة. يذكر قاموس هان "إيريا" أن سوان ني يشبه القطة ويلتهم النمور والفهود، مما يعني أنه بالغ الشراسة ويستطيع افتراس أضخم الضواري.',
    },
  },
  {
    image: 'shizi.jpg',
    title: {
      en: 'Shi Zi: Guardian Lion',
      zh: '狮子：守护狮',
      ar: 'الأسد الحارس',
    },
    desc: {
      en: 'The lion symbolizes warding off disasters and evil spirits, and is considered the king of beasts. Its noble and dignified image exudes a regal air. The ancient Indian Buddhist classic Mahaprajnaparamita Sutra states that the lion is an incarnation of the Buddha and can drive away evil, making it a treasured guardian for the imperial class.',
      zh: '狮子象征辟邪驱灾，被誉为百兽之王。其威严高贵的形象既透着王者之气，又兼具祥瑞之意。古印度佛典《大智度论》记载，狮子为佛陀化身，能驱散邪魔，因此成为历代统治阶层与贵族奉为守护神灵的宝物。',
      ar: 'يرمز الأسد إلى طرد المصائب والأرواح الشريرة، إذ يُعدّ ملك الوحوش. تنضح صورته النبيلة المهيبة بجلال الملوك مع طابع ميمون. يذكر الكلاسيك البوذي الهندي القديم "ماهابراجنابراميتا سوترا" أن الأسد تجسيدٌ للبوذا ويطرد الشر، فأصبح رمزاً للحراسة لدى الطبقة الحاكمة.',
    },
  },
  {
    image: 'tianma.jpg',
    title: {
      en: 'Tian Ma: Celestial Horse',
      zh: '天马：神驹',
      ar: 'الحصان السماوي',
    },
    desc: {
      en: 'The celestial horse is a mythical creature of the sky, symbolizing the warding off of disasters. Unlike the seahorse, the celestial horse has wings. The Book of Han records: "When Taiyi descended, the celestial horse was covered in red sweat." Ancient people believed it could travel a thousand miles a day and was a fearless aerial beast.',
      zh: '天马是翱翔天际的神兽，象征辟邪驱灾。天马与海马的显著区别在于天马有翼。《汉书》记载："太一降，天马汗血，沫流朱赭。"古人相信天马日行千里，是无所畏惧的飞天神兽。',
      ar: 'الحصان السماوي مخلوقٌ أسطوري يسبح في الفضاء ويرمز إلى درء المصائب. يتميز عن حصان البحر بامتلاكه أجنحة. يروي "كتاب هان": "حين نزل تاييه، كان الحصان السماوي مغطىً بعرق أحمر". اعتقد القدماء أنه يقطع ألف ميل في اليوم الواحد وهو مخلوق جوي لا يهاب شيئاً.',
    },
  },
  {
    image: 'yayu.jpg',
    title: {
      en: 'Bi Xi: Dragon Turtle',
      zh: '霸下：龙龟',
      ar: 'بي شي: سلحفاة التنين',
    },
    desc: {
      en: 'The Bixi is a mythical creature with the body of a turtle and the head of a dragon, symbolizing longevity, strength, and wisdom. In Chinese mythology, Bixi is one of the nine sons of the dragon and is often depicted carrying stone steles or tablets, representing the burden of knowledge and the weight of history.',
      zh: '霸下是龙生九子之一，形如龟身龙首，象征长寿、力量与智慧。中国神话中，霸下常被描绘为驮负石碑或石刻的神兽，承载着知识的重量与历史的厚重。',
      ar: 'بي شي مخلوقٌ أسطوري بجسد السلحفاة ورأس التنين، يرمز إلى طول العمر والقوة والحكمة. في الأساطير الصينية، هو أحد أبناء التنين التسعة ويُصوَّر غالباً حاملاً ألواح الحجر، مجسِّداً ثقل المعرفة وعبء التاريخ.',
    },
  },
  {
    image: 'haima.jpg',
    title: {
      en: 'Tao Tie: Mythical Beast',
      zh: '饕餮：神兽',
      ar: 'تاو تي: الوحش الأسطوري',
    },
    desc: {
      en: 'The Taotie is an ancient mythical beast from Chinese mythology, often depicted on bronze vessels from the Shang and Zhou dynasties. It represents greed and gluttony but also serves as a protective symbol. The Taotie motif is commonly found on ancient Chinese ritual bronzes and architectural elements.',
      zh: '饕餮是中国古代神话中的神兽，多见于商周时期的青铜器纹饰。它既象征贪婪与暴食，亦具辟邪镇宅之效。饕餮纹常见于古代礼器与建筑构件之上。',
      ar: 'التاوتي وحشٌ أسطوري قديم في الأساطير الصينية، كثيراً ما يُصوَّر على آنية البرونز في عهدَي شانغ وتشو. يرمز إلى الجشع والنهم لكنه يؤدي دور الحارس الواقي أيضاً. يشيع نقش التاوتي على برونزيات الطقوس الصينية القديمة والعناصر المعمارية.',
    },
  },
];

export default function StatuesClient({ language }: { language: Language }) {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setFlipped((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <section
      className="min-h-screen py-20 px-5"
      style={{ background: 'linear-gradient(-45deg, #8B0000, #1a0000, #3d0000, #000000)' }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-[Cinzel,serif] text-[#D4AF37] text-sm tracking-[3px] uppercase mb-4">
            {language === 'zh' ? '故宫' : language === 'ar' ? 'المدينة المحرمة' : 'Forbidden City'}
          </p>
          <h1 className="font-[Cinzel,serif] text-[36px] md:text-[48px] font-bold text-white mb-6 leading-tight">
            {language === 'zh'
              ? '屋脊神兽'
              : language === 'ar'
              ? 'تماثيل حراس الأسقف'
              : 'Guardian Roof Statues'}
          </h1>
          <p className="text-white/65 text-[16px] leading-relaxed max-w-[760px] mx-auto">
            {language === 'zh'
              ? '故宫屋脊上的神兽兼具装饰与辟邪双重功效，守护着皇家建筑免受邪灵与厄运侵扰。点击每尊神兽，探寻其背后的象征与寓意。'
              : language === 'ar'
              ? 'تؤدي تماثيل أسطح المدينة المحرمة وظيفتين: الزينة والحماية الروحية من الأرواح الشريرة وسوء الحظ. انقر على كل تمثال لتكتشف معناه ورمزيته.'
              : "The roof statues of the Forbidden City serve both decorative and spiritual purposes, protecting the imperial buildings from evil spirits and bad fortune. Click on each statue to discover its meaning and symbolism."}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {STATUES.map((s, i) => (
            <div
              key={i}
              className="h-[400px] cursor-pointer"
              style={{ perspective: '1000px' }}
              onClick={() => toggle(i)}
            >
              <div
                className="relative w-full h-full"
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s',
                  transform: flipped.has(i) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 rounded-2xl overflow-hidden border border-[#D4AF37]/25 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col"
                  style={{
                    backfaceVisibility: 'hidden',
                    background: 'linear-gradient(135deg, rgba(139,0,0,0.92), rgba(26,0,0,0.92))',
                  }}
                >
                  <div className="relative flex-1 overflow-hidden">
                    <img
                      src={`https://files.suki.icu/ch/images/statues/${s.image}`}
                      alt={s.title[language]}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="px-5 py-4 flex items-center justify-between shrink-0">
                    <h4 className="font-[Cinzel,serif] text-[#D4AF37] font-semibold text-[15px] leading-snug">
                      {s.title[language]}
                    </h4>
                    <i className="fas fa-sync-alt text-[#D4AF37]/40 text-xs" />
                  </div>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 rounded-2xl border border-[#D4AF37]/25 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center p-7 overflow-y-auto"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: 'linear-gradient(135deg, rgba(26,0,0,0.97), rgba(100,0,0,0.97))',
                  }}
                >
                  <div className="w-10 h-[2px] bg-[#D4AF37]/40 mb-5 shrink-0" />
                  <h4 className="font-[Cinzel,serif] text-[#D4AF37] font-semibold text-[14px] text-center mb-4 shrink-0">
                    {s.title[language]}
                  </h4>
                  <p className="text-white/75 text-[13px] leading-relaxed text-center">
                    {s.desc[language]}
                  </p>
                  <div className="w-10 h-[2px] bg-[#D4AF37]/40 mt-5 shrink-0" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hint */}
        <p className="text-center text-white/30 text-xs tracking-widest mt-10">
          {language === 'zh'
            ? '点击卡片翻转'
            : language === 'ar'
            ? 'انقر على البطاقة للتقليب'
            : 'Click a card to flip'}
        </p>
      </div>
    </section>
  );
}
