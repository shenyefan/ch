'use client';

import Link from 'next/link';
import { startTransition, useEffect, useState, useTransition } from 'react';

type Notice = {
  type: 'success' | 'error';
  message: string;
};

type Profile = {
  id: number;
  email: string;
  name: string;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
};

type ReviewRow = {
  id: number;
  author_name: string;
  content: string;
  rating: number | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  city_slug: string | null;
  city_name: string | null;
};

type City = {
  id: number;
  slug: string;
  name: string;
};

type AccountClientProps = {
  isAdmin: boolean;
};

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || 'Request failed');
  return data as T;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

function statusTone(status: string) {
  if (status === 'approved') return 'green';
  if (status === 'rejected') return 'red';
  return 'gray';
}

export default function AccountClient({ isAdmin }: AccountClientProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pending, startAction] = useTransition();

  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [citySlug, setCitySlug] = useState('');
  const [rating, setRating] = useState('5');
  const [content, setContent] = useState('');

  async function loadData() {
    const [profileRes, reviewsRes, citiesRes] = await Promise.all([
      fetchJson<{ user: Profile }>('/api/account/profile'),
      fetchJson<{ data: ReviewRow[] }>('/api/account/reviews'),
      fetchJson<{ data: Array<{ id: number; slug: string; name: string }> }>('/api/cities?limit=20'),
    ]);

    setProfile(profileRes.user);
    setName(profileRes.user.name);
    setAvatarUrl(profileRes.user.avatar_url ?? '');
    setReviews(reviewsRes.data);
    setCities(citiesRes.data);
  }

  useEffect(() => {
    startTransition(() => {
      loadData().catch((error: Error) => {
        setNotice({ type: 'error', message: error.message });
      });
    });
  }, []);

  async function saveProfile() {
    startAction(() => {
      fetchJson<{ user: Profile }>('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, avatar_url: avatarUrl }),
      })
        .then((data) => {
          setProfile(data.user);
          setNotice({ type: 'success', message: 'Profile updated' });
        })
        .catch((error: Error) => setNotice({ type: 'error', message: error.message }));
    });
  }

  async function submitReview() {
    startAction(() => {
      fetchJson('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city_slug: citySlug || null, rating: Number(rating), content }),
      })
        .then(async () => {
          setContent('');
          setRating('5');
          setCitySlug('');
          setNotice({ type: 'success', message: 'Review submitted for moderation' });
          const reviewsRes = await fetchJson<{ data: ReviewRow[] }>('/api/account/reviews');
          setReviews(reviewsRes.data);
        })
        .catch((error: Error) => setNotice({ type: 'error', message: error.message }));
    });
  }

  return (
    <section className="admin-surface text-white">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-logo">
            <span>◈</span>
            <span>My Heritage</span>
          </div>
          <div className="space-y-4 text-sm text-white/75">
            <p>Update your profile and submit reviews from this page.</p>
            {isAdmin ? (
              <Link href="/admin" className="admin-nav-button is-active no-underline">
                <span>⌘</span>
                <span>Go To Admin</span>
              </Link>
            ) : null}
          </div>
        </aside>

        <div className="space-y-6">
          {notice ? <div className={`admin-notice ${notice.type}`}>{notice.message}</div> : null}
          {pending ? <div className="admin-notice success">Saving changes...</div> : null}

          <div className="admin-card">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="admin-section-title">Account Center</h1>
                <p className="admin-subtitle">Maintain your profile and submit new heritage travel reviews.</p>
              </div>
              {profile ? <div className="admin-badge gold">{profile.role}</div> : null}
            </div>
          </div>

          <div className="admin-grid">
            <div className="admin-card">
              <h2 className="mb-6 text-2xl font-bold text-[#D4AF37]">Profile</h2>
              <div className="admin-form-grid">
                <label>
                  <span className="admin-form-label">Email</span>
                  <input className="admin-input" value={profile?.email ?? ''} readOnly />
                </label>
                <label>
                  <span className="admin-form-label">Name</span>
                  <input className="admin-input" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label>
                  <span className="admin-form-label">Avatar URL</span>
                  <input className="admin-input" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
                </label>
                <p className="admin-muted">Joined {profile ? formatDate(profile.created_at) : '-'}</p>
                <div className="admin-actions">
                  <button className="admin-button primary" onClick={saveProfile}>Save Profile</button>
                </div>
              </div>
            </div>

            <div className="admin-card">
              <h2 className="mb-6 text-2xl font-bold text-[#D4AF37]">Post Review</h2>
              <div className="admin-form-grid">
                <label>
                  <span className="admin-form-label">City</span>
                  <select className="admin-select" value={citySlug} onChange={(e) => setCitySlug(e.target.value)}>
                    <option value="">General story</option>
                    {cities.map((city) => <option key={city.id} value={city.slug}>{city.name}</option>)}
                  </select>
                </label>
                <label>
                  <span className="admin-form-label">Rating</span>
                  <select className="admin-select" value={rating} onChange={(e) => setRating(e.target.value)}>
                    {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value}</option>)}
                  </select>
                </label>
                <label>
                  <span className="admin-form-label">Story</span>
                  <textarea className="admin-textarea" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share your experience with the heritage site..." />
                </label>
                <div className="admin-actions">
                  <button className="admin-button primary" onClick={submitReview}>Submit Review</button>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h2 className="mb-6 text-2xl font-bold text-[#D4AF37]">My Reviews</h2>
            <div className="admin-list">
              {reviews.map((review) => (
                <div className="admin-list-item" key={review.id}>
                  <div className="flex flex-wrap items-center gap-2">
                    <strong>{review.city_name || review.city_slug || 'General'}</strong>
                    <span className={`admin-badge ${statusTone(review.status)}`}>{review.status}</span>
                    {review.rating ? <span className="admin-badge gold">{review.rating}/5</span> : null}
                  </div>
                  <p className="mt-3 leading-7 text-white/88">{review.content}</p>
                  <p className="admin-muted mt-2">{formatDate(review.created_at)}</p>
                </div>
              ))}
              {reviews.length === 0 ? <p className="admin-muted">No reviews yet.</p> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}