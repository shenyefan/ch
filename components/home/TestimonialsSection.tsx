import { copy, type Language, t } from '@/lib/i18n';

interface Review {
  id: number;
  author_name: string;
  content: string;
  rating: number;
  city_name: string;
  city_slug: string;
}

async function getReviews(): Promise<Review[]> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    const res = await fetch(`${base}/api/reviews?limit=3`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []) as Review[];
  } catch {
    return [];
  }
}

const FALLBACK: Review[] = [
  {
    id: 1, author_name: 'James Davidson',
    content: 'Visiting the Forbidden City was an absolutely awe-inspiring experience. The sheer scale and meticulous craftsmanship of the imperial architecture left me speechless.',
    rating: 5, city_name: 'Beijing', city_slug: 'beijing',
  },
  {
    id: 2, author_name: 'Maria Kovács',
    content: "Standing before the Terracotta Warriors at Xi'an was a surreal moment. Each warrior has a unique expression — the attention to detail is extraordinary.",
    rating: 5, city_name: "Xi'an", city_slug: 'xian',
  },
  {
    id: 3, author_name: 'Anna Laurent',
    content: "The classical gardens of Suzhou are pure poetry in stone and water. Every turn reveals a new carefully composed view — it's a living painting.",
    rating: 5, city_name: 'Suzhou', city_slug: 'suzhou',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-[2px] text-[#D4AF37] text-[14px] mb-3">
      {[...Array(5)].map((_, i) => (
        <i key={i} className={i < rating ? 'fas fa-star' : 'far fa-star'} />
      ))}
    </div>
  );
}

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export default async function TestimonialsSection({ language }: { language: Language }) {
  const fetched = await getReviews();
  const reviews = fetched.length > 0 ? fetched : FALLBACK;
  const homeCopy = copy.home;

  return (
    <section
      id="testimonials"
      className="py-[100px]"
      style={{ background: 'linear-gradient(135deg, #0a0000 0%, #1a0000 100%)' }}
    >
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="text-center mb-16">
          <h2 className="font-[Cinzel,serif] text-[40px] font-bold mb-4 grad-text-gold">{t(homeCopy.visitorStories, language)}</h2>
          <p className="text-white/60 text-[17px] max-w-[600px] mx-auto">
            {t(homeCopy.visitorStoriesDesc, language)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white/[0.03] rounded-3xl p-8 border border-[#D4AF37]/15 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#D4AF37]/30"
            >
              <StarRating rating={review.rating} />
              <div className="testimonial-quote mb-6">
                <p className="text-white/80 text-[15px] leading-relaxed">{review.content}</p>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="w-[55px] h-[55px] rounded-full border-2 border-[#D4AF37] flex items-center justify-center font-[Cinzel,serif] font-bold text-[14px] text-[#FFD700] shrink-0"
                  style={{ background: 'linear-gradient(135deg, #BB1E1E, #8B0000)' }}
                >
                  {initials(review.author_name)}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-[15px] mb-0.5">{review.author_name}</h4>
                  <p className="text-[#D4AF37]/70 text-[13px]">{t(homeCopy.visited, language)} {review.city_name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
