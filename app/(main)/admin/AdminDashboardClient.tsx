'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';

type Notice = {
  type: 'success' | 'error';
  message: string;
};

type LanguageKey = 'en' | 'zh' | 'ar';

type Overview = {
  users: number;
  cities: number;
  landmarks: number;
  reviews: number;
  features: number;
  chapters: number;
};

type UserRow = {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
};

type ReviewRow = {
  id: number;
  author_name: string;
  content: string;
  rating: number | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  city_slug: string | null;
  user_email: string | null;
};

type CityTranslations = Record<LanguageKey, {
  name: string;
  subtitle: string;
  short_bio: string;
  description: string;
}>;

type CityItem = {
  id: number;
  slug: string;
  center_lat: number;
  center_lng: number;
  zoom_level: number;
  featured_image: string | null;
  hero_video_url: string | null;
  gallery_images: string[] | null;
  sort_order: number;
  is_active: boolean;
  translations: Partial<CityTranslations>;
};

type LandmarkTranslations = Record<LanguageKey, {
  name: string;
  short_description: string;
  description: string;
  historical_background: string;
  visiting_tips: string;
}>;

type LandmarkItem = {
  id: number;
  city_id: number;
  city_slug: string;
  slug: string;
  latitude: number;
  longitude: number;
  category: string;
  featured_image: string | null;
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
  translations: Partial<LandmarkTranslations>;
};

type FeatureTranslations = Record<LanguageKey, {
  title: string;
  description: string;
}>;

type FeatureItem = {
  id: number;
  city_id: number;
  city_slug: string;
  slug: string;
  card_image: string | null;
  interactive_url: string | null;
  statues_url: string | null;
  modal_slug: string | null;
  sort_order: number;
  is_active: boolean;
  translations: Partial<FeatureTranslations>;
};

type ChapterTranslations = Record<LanguageKey, {
  title: string;
  paragraphs: string;
}>;

type ChapterItem = {
  id: number;
  modal_slug: string;
  slug: string;
  images: string[] | null;
  sort_order: number;
  translations: Partial<Record<LanguageKey, { title?: string; paragraphs?: string[] }>>;
};

type SectionKey = 'dashboard' | 'users' | 'reviews' | 'cities' | 'landmarks' | 'features' | 'chapters';

type AdminDashboardClientProps = {
  currentUserId: number;
  currentUserName: string;
};

const sectionMeta: Array<{ key: SectionKey; label: string; icon: string }> = [
  { key: 'dashboard', label: 'Dashboard', icon: '◈' },
  { key: 'users', label: 'Users', icon: '◉' },
  { key: 'reviews', label: 'Reviews', icon: '✦' },
  { key: 'cities', label: 'Cities', icon: '▣' },
  { key: 'landmarks', label: 'Landmarks', icon: '◬' },
  { key: 'features', label: 'Features', icon: '✧' },
  { key: 'chapters', label: 'Chapters', icon: '▤' },
];

const languageMeta: Array<{ key: LanguageKey; label: string }> = [
  { key: 'en', label: 'English' },
  { key: 'zh', label: '中文' },
  { key: 'ar', label: 'العربية' },
];

const categoryOptions = [
  'palace', 'temple', 'garden', 'wall', 'pagoda', 'mosque', 'tower', 'square', 'museum', 'mausoleum', 'park', 'street', 'other',
];

function emptyCityTranslations(): CityTranslations {
  return {
    en: { name: '', subtitle: '', short_bio: '', description: '' },
    zh: { name: '', subtitle: '', short_bio: '', description: '' },
    ar: { name: '', subtitle: '', short_bio: '', description: '' },
  };
}

function emptyLandmarkTranslations(): LandmarkTranslations {
  return {
    en: { name: '', short_description: '', description: '', historical_background: '', visiting_tips: '' },
    zh: { name: '', short_description: '', description: '', historical_background: '', visiting_tips: '' },
    ar: { name: '', short_description: '', description: '', historical_background: '', visiting_tips: '' },
  };
}

function emptyFeatureTranslations(): FeatureTranslations {
  return {
    en: { title: '', description: '' },
    zh: { title: '', description: '' },
    ar: { title: '', description: '' },
  };
}

function emptyChapterTranslations(): ChapterTranslations {
  return {
    en: { title: '', paragraphs: '' },
    zh: { title: '', paragraphs: '' },
    ar: { title: '', paragraphs: '' },
  };
}

function normalizeCity(item?: CityItem | null) {
  return {
    id: item?.id ?? null,
    slug: item?.slug ?? '',
    center_lat: item?.center_lat?.toString() ?? '',
    center_lng: item?.center_lng?.toString() ?? '',
    zoom_level: item?.zoom_level?.toString() ?? '12',
    featured_image: item?.featured_image ?? '',
    hero_video_url: item?.hero_video_url ?? '',
    gallery_images: (item?.gallery_images ?? []).join('\n'),
    sort_order: item?.sort_order?.toString() ?? '0',
    is_active: item?.is_active ?? true,
    translations: {
      ...emptyCityTranslations(),
      ...(item?.translations ?? {}),
    },
  };
}

function normalizeLandmark(item?: LandmarkItem | null) {
  return {
    id: item?.id ?? null,
    city_id: item?.city_id?.toString() ?? '',
    slug: item?.slug ?? '',
    latitude: item?.latitude?.toString() ?? '',
    longitude: item?.longitude?.toString() ?? '',
    category: item?.category ?? 'other',
    featured_image: item?.featured_image ?? '',
    is_featured: item?.is_featured ?? false,
    sort_order: item?.sort_order?.toString() ?? '0',
    is_active: item?.is_active ?? true,
    translations: {
      ...emptyLandmarkTranslations(),
      ...(item?.translations ?? {}),
    },
  };
}

function normalizeFeature(item?: FeatureItem | null) {
  return {
    id: item?.id ?? null,
    city_id: item?.city_id?.toString() ?? '',
    slug: item?.slug ?? '',
    card_image: item?.card_image ?? '',
    interactive_url: item?.interactive_url ?? '',
    statues_url: item?.statues_url ?? '',
    modal_slug: item?.modal_slug ?? '',
    sort_order: item?.sort_order?.toString() ?? '0',
    is_active: item?.is_active ?? true,
    translations: {
      ...emptyFeatureTranslations(),
      ...(item?.translations ?? {}),
    },
  };
}

function normalizeChapter(item?: ChapterItem | null) {
  const base = emptyChapterTranslations();
  const translations = item?.translations ?? {};

  return {
    id: item?.id ?? null,
    modal_slug: item?.modal_slug ?? '',
    slug: item?.slug ?? '',
    images: (item?.images ?? []).join('\n'),
    sort_order: item?.sort_order?.toString() ?? '0',
    translations: {
      en: {
        title: translations.en?.title ?? base.en.title,
        paragraphs: (translations.en?.paragraphs ?? []).join('\n\n'),
      },
      zh: {
        title: translations.zh?.title ?? base.zh.title,
        paragraphs: (translations.zh?.paragraphs ?? []).join('\n\n'),
      },
      ar: {
        title: translations.ar?.title ?? base.ar.title,
        paragraphs: (translations.ar?.paragraphs ?? []).join('\n\n'),
      },
    },
  };
}

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error || data?.message || 'Request failed');
  }
  return data as T;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

function statusTone(status: string) {
  if (status === 'approved' || status === 'active') return 'green';
  if (status === 'rejected') return 'red';
  if (status === 'admin') return 'gold';
  return 'gray';
}

function LanguageTabs({ activeLanguage, onChange }: { activeLanguage: LanguageKey; onChange: (language: LanguageKey) => void }) {
  return (
    <div className="admin-lang-tabs">
      {languageMeta.map((language) => (
        <button
          key={language.key}
          type="button"
          className={`admin-lang-tab${activeLanguage === language.key ? ' is-active' : ''}`}
          onClick={() => onChange(language.key)}
        >
          {language.label}
        </button>
      ))}
    </div>
  );
}

function EmptyList({ message }: { message: string }) {
  return <p className="admin-muted">{message}</p>;
}

export default function AdminDashboardClient({ currentUserId, currentUserName }: AdminDashboardClientProps) {
  const [activeSection, setActiveSection] = useState<SectionKey>('dashboard');
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pending, startAction] = useTransition();
  const [loadingSection, setLoadingSection] = useState<SectionKey | null>(null);
  const [loadedSections, setLoadedSections] = useState<Partial<Record<SectionKey | 'shared-cities', boolean>>>({});

  const [overview, setOverview] = useState<Overview>({ users: 0, cities: 0, landmarks: 0, reviews: 0, features: 0, chapters: 0 });
  const [users, setUsers] = useState<UserRow[]>([]);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [cities, setCities] = useState<CityItem[]>([]);
  const [landmarks, setLandmarks] = useState<LandmarkItem[]>([]);
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [chapters, setChapters] = useState<ChapterItem[]>([]);

  const [cityForm, setCityForm] = useState(normalizeCity());
  const [landmarkForm, setLandmarkForm] = useState(normalizeLandmark());
  const [featureForm, setFeatureForm] = useState(normalizeFeature());
  const [chapterForm, setChapterForm] = useState(normalizeChapter());

  const [cityLanguage, setCityLanguage] = useState<LanguageKey>('en');
  const [landmarkLanguage, setLandmarkLanguage] = useState<LanguageKey>('en');
  const [featureLanguage, setFeatureLanguage] = useState<LanguageKey>('en');
  const [chapterLanguage, setChapterLanguage] = useState<LanguageKey>('en');

  const loadCitiesShared = useCallback(async (force = false) => {
    if (!force && loadedSections['shared-cities']) return;
    const data = await fetchJson<{ data: CityItem[] }>('/api/admin/cities');
    setCities(data.data);
    setLoadedSections((prev) => ({ ...prev, cities: true, 'shared-cities': true }));
  }, [loadedSections]);

  const loadSection = useCallback(async (section: SectionKey, force = false) => {
    if (!force && loadedSections[section]) return;

    setLoadingSection(section);

    try {
      if (section === 'dashboard') {
        const data = await fetchJson<{ totals: Overview }>('/api/admin/overview');
        setOverview(data.totals);
      } else if (section === 'users') {
        const data = await fetchJson<{ data: UserRow[] }>('/api/admin/users?limit=100');
        setUsers(data.data);
      } else if (section === 'reviews') {
        const data = await fetchJson<{ data: ReviewRow[] }>('/api/admin/reviews?limit=100');
        setReviews(data.data);
      } else if (section === 'cities') {
        await loadCitiesShared(true);
      } else if (section === 'landmarks') {
        const [landmarksRes] = await Promise.all([
          fetchJson<{ data: LandmarkItem[] }>('/api/admin/landmarks'),
          loadCitiesShared(force),
        ]);
        setLandmarks(landmarksRes.data);
      } else if (section === 'features') {
        const [featuresRes] = await Promise.all([
          fetchJson<{ data: FeatureItem[] }>('/api/admin/features'),
          loadCitiesShared(force),
        ]);
        setFeatures(featuresRes.data);
      } else if (section === 'chapters') {
        const data = await fetchJson<{ data: ChapterItem[] }>('/api/admin/chapters');
        setChapters(data.data);
      }

      setLoadedSections((prev) => ({ ...prev, [section]: true }));
    } catch (error) {
      setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Load failed' });
    } finally {
      setLoadingSection((prev) => (prev === section ? null : prev));
    }
  }, [loadedSections, loadCitiesShared]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadSection(activeSection);
    });
  }, [activeSection, loadSection]);

  useEffect(() => {
    queueMicrotask(() => {
      void Promise.all([loadSection('dashboard'), loadSection('users')]);
    });
  }, [loadSection]);

  function showNotice(type: Notice['type'], message: string) {
    setNotice({ type, message });
  }

  function updateCityTranslation(language: LanguageKey, field: keyof CityTranslations['en'], value: string) {
    setCityForm((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [language]: {
          ...prev.translations[language],
          [field]: value,
        },
      },
    }));
  }

  function updateLandmarkTranslation(language: LanguageKey, field: keyof LandmarkTranslations['en'], value: string) {
    setLandmarkForm((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [language]: {
          ...prev.translations[language],
          [field]: value,
        },
      },
    }));
  }

  function updateFeatureTranslation(language: LanguageKey, field: keyof FeatureTranslations['en'], value: string) {
    setFeatureForm((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [language]: {
          ...prev.translations[language],
          [field]: value,
        },
      },
    }));
  }

  function updateChapterTranslation(language: LanguageKey, field: keyof ChapterTranslations['en'], value: string) {
    setChapterForm((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [language]: {
          ...prev.translations[language],
          [field]: value,
        },
      },
    }));
  }

  async function refreshSection(section: SectionKey) {
    await loadSection(section, true);
  }

  async function refreshSectionWithDashboard(section: SectionKey) {
    await Promise.all([refreshSection(section), refreshSection('dashboard')]);
  }

  async function handleUserUpdate(userId: number, payload: Partial<Pick<UserRow, 'role' | 'is_active'>>) {
    startAction(() => {
      fetchJson(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(async () => {
          await refreshSectionWithDashboard('users');
          showNotice('success', 'User updated');
        })
        .catch((error: Error) => showNotice('error', error.message));
    });
  }

  async function handleUserDelete(userId: number) {
    startAction(() => {
      fetchJson(`/api/admin/users/${userId}`, { method: 'DELETE' })
        .then(async () => {
          await refreshSectionWithDashboard('users');
          showNotice('success', 'User deleted');
        })
        .catch((error: Error) => showNotice('error', error.message));
    });
  }

  async function handleReviewStatus(reviewId: number, status: ReviewRow['status']) {
    startAction(() => {
      fetchJson(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
        .then(async () => {
          await refreshSectionWithDashboard('reviews');
          showNotice('success', 'Review updated');
        })
        .catch((error: Error) => showNotice('error', error.message));
    });
  }

  async function handleReviewDelete(reviewId: number) {
    startAction(() => {
      fetchJson(`/api/admin/reviews/${reviewId}`, { method: 'DELETE' })
        .then(async () => {
          await refreshSectionWithDashboard('reviews');
          showNotice('success', 'Review deleted');
        })
        .catch((error: Error) => showNotice('error', error.message));
    });
  }

  async function saveCity() {
    const payload = {
      slug: cityForm.slug,
      center_lat: Number(cityForm.center_lat),
      center_lng: Number(cityForm.center_lng),
      zoom_level: Number(cityForm.zoom_level),
      featured_image: cityForm.featured_image,
      hero_video_url: cityForm.hero_video_url,
      gallery_images: cityForm.gallery_images.split('\n').map((line) => line.trim()).filter(Boolean),
      sort_order: Number(cityForm.sort_order),
      is_active: cityForm.is_active,
      translations: cityForm.translations,
    };

    const method = cityForm.id ? 'PATCH' : 'POST';
    const url = cityForm.id ? `/api/admin/cities/${cityForm.id}` : '/api/admin/cities';

    startAction(() => {
      fetchJson(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(async () => {
          setCityForm(normalizeCity());
          await refreshSectionWithDashboard('cities');
          showNotice('success', 'City saved');
        })
        .catch((error: Error) => showNotice('error', error.message));
    });
  }

  async function deleteCity() {
    if (!cityForm.id) return;
    startAction(() => {
      fetchJson(`/api/admin/cities/${cityForm.id}`, { method: 'DELETE' })
        .then(async () => {
          setCityForm(normalizeCity());
          await refreshSectionWithDashboard('cities');
          showNotice('success', 'City deleted');
        })
        .catch((error: Error) => showNotice('error', error.message));
    });
  }

  async function saveLandmark() {
    const payload = {
      city_id: Number(landmarkForm.city_id),
      slug: landmarkForm.slug,
      latitude: Number(landmarkForm.latitude),
      longitude: Number(landmarkForm.longitude),
      category: landmarkForm.category,
      featured_image: landmarkForm.featured_image,
      is_featured: landmarkForm.is_featured,
      sort_order: Number(landmarkForm.sort_order),
      is_active: landmarkForm.is_active,
      translations: landmarkForm.translations,
    };

    const method = landmarkForm.id ? 'PATCH' : 'POST';
    const url = landmarkForm.id ? `/api/admin/landmarks/${landmarkForm.id}` : '/api/admin/landmarks';

    startAction(() => {
      fetchJson(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(async () => {
          setLandmarkForm(normalizeLandmark());
          await refreshSectionWithDashboard('landmarks');
          showNotice('success', 'Landmark saved');
        })
        .catch((error: Error) => showNotice('error', error.message));
    });
  }

  async function deleteLandmark() {
    if (!landmarkForm.id) return;
    startAction(() => {
      fetchJson(`/api/admin/landmarks/${landmarkForm.id}`, { method: 'DELETE' })
        .then(async () => {
          setLandmarkForm(normalizeLandmark());
          await refreshSectionWithDashboard('landmarks');
          showNotice('success', 'Landmark deleted');
        })
        .catch((error: Error) => showNotice('error', error.message));
    });
  }

  async function saveFeature() {
    const payload = {
      city_id: Number(featureForm.city_id),
      slug: featureForm.slug,
      card_image: featureForm.card_image,
      interactive_url: featureForm.interactive_url,
      statues_url: featureForm.statues_url,
      modal_slug: featureForm.modal_slug,
      sort_order: Number(featureForm.sort_order),
      is_active: featureForm.is_active,
      translations: featureForm.translations,
    };

    const method = featureForm.id ? 'PATCH' : 'POST';
    const url = featureForm.id ? `/api/admin/features/${featureForm.id}` : '/api/admin/features';

    startAction(() => {
      fetchJson(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(async () => {
          setFeatureForm(normalizeFeature());
          await refreshSectionWithDashboard('features');
          showNotice('success', 'Feature saved');
        })
        .catch((error: Error) => showNotice('error', error.message));
    });
  }

  async function deleteFeature() {
    if (!featureForm.id) return;
    startAction(() => {
      fetchJson(`/api/admin/features/${featureForm.id}`, { method: 'DELETE' })
        .then(async () => {
          setFeatureForm(normalizeFeature());
          await refreshSectionWithDashboard('features');
          showNotice('success', 'Feature deleted');
        })
        .catch((error: Error) => showNotice('error', error.message));
    });
  }

  async function saveChapter() {
    const payload = {
      modal_slug: chapterForm.modal_slug,
      slug: chapterForm.slug,
      images: chapterForm.images.split('\n').map((line) => line.trim()).filter(Boolean),
      sort_order: Number(chapterForm.sort_order),
      translations: {
        en: {
          title: chapterForm.translations.en.title,
          paragraphs: chapterForm.translations.en.paragraphs.split(/\n\s*\n/).map((value) => value.trim()).filter(Boolean),
        },
        zh: {
          title: chapterForm.translations.zh.title,
          paragraphs: chapterForm.translations.zh.paragraphs.split(/\n\s*\n/).map((value) => value.trim()).filter(Boolean),
        },
        ar: {
          title: chapterForm.translations.ar.title,
          paragraphs: chapterForm.translations.ar.paragraphs.split(/\n\s*\n/).map((value) => value.trim()).filter(Boolean),
        },
      },
    };

    const method = chapterForm.id ? 'PATCH' : 'POST';
    const url = chapterForm.id ? `/api/admin/chapters/${chapterForm.id}` : '/api/admin/chapters';

    startAction(() => {
      fetchJson(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(async () => {
          setChapterForm(normalizeChapter());
          await refreshSectionWithDashboard('chapters');
          showNotice('success', 'Chapter saved');
        })
        .catch((error: Error) => showNotice('error', error.message));
    });
  }

  async function deleteChapter() {
    if (!chapterForm.id) return;
    startAction(() => {
      fetchJson(`/api/admin/chapters/${chapterForm.id}`, { method: 'DELETE' })
        .then(async () => {
          setChapterForm(normalizeChapter());
          await refreshSectionWithDashboard('chapters');
          showNotice('success', 'Chapter deleted');
        })
        .catch((error: Error) => showNotice('error', error.message));
    });
  }

  const dashboardContent = (
    <div className="space-y-6">
      <div className="admin-card">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="admin-section-title">Heritage Control Room</h1>
            <p className="admin-subtitle">Manage users, reviews, and heritage content from one place.</p>
          </div>
          <div className="admin-badge gold">Signed in as {currentUserName}</div>
        </div>
      </div>

      <div className="admin-stat-grid">
        {[
          ['Users', overview.users],
          ['Cities', overview.cities],
          ['Landmarks', overview.landmarks],
          ['Reviews', overview.reviews],
          ['Features', overview.features],
          ['Chapters', overview.chapters],
        ].map(([label, value]) => (
          <div className="admin-stat-card" key={label}>
            <div className="admin-stat-value">{value}</div>
            <div className="admin-stat-label">{label}</div>
          </div>
        ))}
      </div>

    </div>
  );

  const cityTranslation = cityForm.translations[cityLanguage];
  const landmarkTranslation = landmarkForm.translations[landmarkLanguage];
  const featureTranslation = featureForm.translations[featureLanguage];
  const chapterTranslation = chapterForm.translations[chapterLanguage];

  return (
    <section className="admin-surface text-white">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-logo">
            <span>⌘</span>
            <span>CH Admin</span>
          </div>

          <div className="space-y-2">
            {sectionMeta.map((section) => (
              <button
                key={section.key}
                className={`admin-nav-button${activeSection === section.key ? ' is-active' : ''}`}
                onClick={() => setActiveSection(section.key)}
                type="button"
              >
                <span>{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-6">
          {notice ? <div className={`admin-notice ${notice.type}`}>{notice.message}</div> : null}
          {pending ? <div className="admin-notice success">Saving changes...</div> : null}
          {loadingSection === activeSection ? <div className="admin-notice success">Loading {activeSection}...</div> : null}

          {activeSection === 'dashboard' ? dashboardContent : null}

          {activeSection === 'users' ? (
            <div className="admin-card">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#D4AF37]">User Management</h2>
              </div>

              <div className="admin-list">
                {users.length === 0 ? <EmptyList message="No users loaded yet." /> : null}
                {users.map((user) => (
                  <div className="admin-list-item" key={user.id}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <strong className="text-lg">{user.name}</strong>
                          <span className={`admin-badge ${statusTone(user.role)}`}>{user.role}</span>
                          <span className={`admin-badge ${user.is_active ? 'green' : 'red'}`}>{user.is_active ? 'active' : 'inactive'}</span>
                          {user.id === currentUserId ? <span className="admin-badge gold">current</span> : null}
                        </div>
                        <p className="admin-muted mt-2">{user.email}</p>
                        <p className="admin-muted mt-1">Created {formatDate(user.created_at)}</p>
                      </div>

                      <div className="admin-actions">
                        <button className="admin-button secondary" onClick={() => void handleUserUpdate(user.id, { role: user.role === 'admin' ? 'user' : 'admin' })} disabled={user.id === currentUserId}>
                          Toggle Role
                        </button>
                        <button className="admin-button secondary" onClick={() => void handleUserUpdate(user.id, { is_active: !user.is_active })} disabled={user.id === currentUserId}>
                          {user.is_active ? 'Disable' : 'Enable'}
                        </button>
                        <button className="admin-button danger" onClick={() => void handleUserDelete(user.id)} disabled={user.id === currentUserId}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {activeSection === 'reviews' ? (
            <div className="admin-card">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#D4AF37]">Review Moderation</h2>
                <p className="admin-muted mt-2">Review submissions and moderate visibility.</p>
              </div>

              <div className="admin-list">
                {reviews.length === 0 ? <EmptyList message="No reviews loaded yet." /> : null}
                {reviews.map((review) => (
                  <div className="admin-list-item" key={review.id}>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong>{review.author_name}</strong>
                        <span className={`admin-badge ${statusTone(review.status)}`}>{review.status}</span>
                        {review.city_slug ? <span className="admin-badge gray">{review.city_slug}</span> : null}
                        {review.rating ? <span className="admin-badge gold">{review.rating}/5</span> : null}
                      </div>
                      <p className="leading-7 text-white/88">{review.content}</p>
                      <p className="admin-muted">{review.user_email || 'Anonymous'} · {formatDate(review.created_at)}</p>
                      <div className="admin-actions">
                        <button className="admin-button secondary" onClick={() => void handleReviewStatus(review.id, 'approved')}>Approve</button>
                        <button className="admin-button secondary" onClick={() => void handleReviewStatus(review.id, 'rejected')}>Reject</button>
                        <button className="admin-button secondary" onClick={() => void handleReviewStatus(review.id, 'pending')}>Reset</button>
                        <button className="admin-button danger" onClick={() => void handleReviewDelete(review.id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {activeSection === 'cities' ? (
            <div className="admin-editor-layout">
              <div className="admin-card admin-editor-main">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold text-[#D4AF37]">City Editor</h2>
                    <p className="admin-muted mt-2">Edit city structure and copy on the left, then switch records from the side list.</p>
                  </div>
                  <button className="admin-button secondary" onClick={() => setCityForm(normalizeCity())}>New City</button>
                </div>

                <div className="admin-form-grid">
                  <div className="admin-form-columns">
                    <label>
                      <span className="admin-form-label">Slug</span>
                      <input className="admin-input" value={cityForm.slug} onChange={(e) => setCityForm((prev) => ({ ...prev, slug: e.target.value }))} />
                    </label>
                    <label>
                      <span className="admin-form-label">Zoom Level</span>
                      <input className="admin-input" value={cityForm.zoom_level} onChange={(e) => setCityForm((prev) => ({ ...prev, zoom_level: e.target.value }))} />
                    </label>
                    <label>
                      <span className="admin-form-label">Center Lat</span>
                      <input className="admin-input" value={cityForm.center_lat} onChange={(e) => setCityForm((prev) => ({ ...prev, center_lat: e.target.value }))} />
                    </label>
                    <label>
                      <span className="admin-form-label">Center Lng</span>
                      <input className="admin-input" value={cityForm.center_lng} onChange={(e) => setCityForm((prev) => ({ ...prev, center_lng: e.target.value }))} />
                    </label>
                  </div>

                  <label>
                    <span className="admin-form-label">Featured Image</span>
                    <input className="admin-input" value={cityForm.featured_image} onChange={(e) => setCityForm((prev) => ({ ...prev, featured_image: e.target.value }))} />
                  </label>
                  <label>
                    <span className="admin-form-label">Hero Video</span>
                    <input className="admin-input" value={cityForm.hero_video_url} onChange={(e) => setCityForm((prev) => ({ ...prev, hero_video_url: e.target.value }))} />
                  </label>
                  <label>
                    <span className="admin-form-label">Gallery Images</span>
                    <textarea className="admin-textarea" value={cityForm.gallery_images} onChange={(e) => setCityForm((prev) => ({ ...prev, gallery_images: e.target.value }))} />
                  </label>

                  <div className="admin-lang-panel">
                    <LanguageTabs activeLanguage={cityLanguage} onChange={setCityLanguage} />
                    <div className="admin-form-grid">
                      <input className="admin-input" placeholder="Name" value={cityTranslation.name} onChange={(e) => updateCityTranslation(cityLanguage, 'name', e.target.value)} />
                      <input className="admin-input" placeholder="Subtitle" value={cityTranslation.subtitle} onChange={(e) => updateCityTranslation(cityLanguage, 'subtitle', e.target.value)} />
                      <textarea className="admin-textarea" placeholder="Short bio" value={cityTranslation.short_bio} onChange={(e) => updateCityTranslation(cityLanguage, 'short_bio', e.target.value)} />
                      <textarea className="admin-textarea" placeholder="Description" value={cityTranslation.description} onChange={(e) => updateCityTranslation(cityLanguage, 'description', e.target.value)} />
                    </div>
                  </div>

                  <div className="admin-form-columns">
                    <label>
                      <span className="admin-form-label">Sort Order</span>
                      <input className="admin-input" value={cityForm.sort_order} onChange={(e) => setCityForm((prev) => ({ ...prev, sort_order: e.target.value }))} />
                    </label>
                    <label className="flex items-center gap-3 pt-8 text-sm text-white/85">
                      <input type="checkbox" checked={cityForm.is_active} onChange={(e) => setCityForm((prev) => ({ ...prev, is_active: e.target.checked }))} />
                      Active
                    </label>
                  </div>

                  <div className="admin-actions">
                    <button className="admin-button primary" onClick={() => void saveCity()}>Save City</button>
                    <button className="admin-button secondary" onClick={() => setCityForm(normalizeCity())}>Reset</button>
                    {cityForm.id ? <button className="admin-button danger" onClick={() => void deleteCity()}>Delete</button> : null}
                  </div>
                </div>
              </div>

              <div className="admin-card admin-side-list">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-[#D4AF37]">City Records</h3>
                    <p className="admin-muted mt-2">Use the side list to switch the current record.</p>
                  </div>
                </div>
                <div className="admin-list">
                  {cities.length === 0 ? <EmptyList message="No cities loaded yet." /> : null}
                  {cities.map((city) => (
                    <button
                      type="button"
                      key={city.id}
                      className={`admin-list-item text-left${cityForm.id === city.id ? ' is-selected' : ''}`}
                      onClick={() => setCityForm(normalizeCity(city))}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <strong>{city.translations.en?.name || city.slug}</strong>
                        <span className={`admin-badge ${city.is_active ? 'green' : 'red'}`}>{city.is_active ? 'active' : 'inactive'}</span>
                      </div>
                      <p className="admin-muted mt-2">/{city.slug}</p>
                      <p className="admin-muted mt-1">{city.translations.en?.subtitle || 'No subtitle'}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {activeSection === 'landmarks' ? (
            <div className="admin-editor-layout">
              <div className="admin-card admin-editor-main">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold text-[#D4AF37]">Landmark Editor</h2>
                    <p className="admin-muted mt-2">Switch translation content with tabs instead of stacked fields.</p>
                  </div>
                  <button className="admin-button secondary" onClick={() => setLandmarkForm(normalizeLandmark())}>New Landmark</button>
                </div>

                <div className="admin-form-grid">
                  <div className="admin-form-columns">
                    <label>
                      <span className="admin-form-label">City</span>
                      <select className="admin-select" value={landmarkForm.city_id} onChange={(e) => setLandmarkForm((prev) => ({ ...prev, city_id: e.target.value }))}>
                        <option value="">Select city</option>
                        {cities.map((city) => <option key={city.id} value={city.id}>{city.translations.en?.name || city.slug}</option>)}
                      </select>
                    </label>
                    <label>
                      <span className="admin-form-label">Category</span>
                      <select className="admin-select" value={landmarkForm.category} onChange={(e) => setLandmarkForm((prev) => ({ ...prev, category: e.target.value }))}>
                        {categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </label>
                    <label>
                      <span className="admin-form-label">Slug</span>
                      <input className="admin-input" value={landmarkForm.slug} onChange={(e) => setLandmarkForm((prev) => ({ ...prev, slug: e.target.value }))} />
                    </label>
                    <label>
                      <span className="admin-form-label">Sort Order</span>
                      <input className="admin-input" value={landmarkForm.sort_order} onChange={(e) => setLandmarkForm((prev) => ({ ...prev, sort_order: e.target.value }))} />
                    </label>
                    <label>
                      <span className="admin-form-label">Latitude</span>
                      <input className="admin-input" value={landmarkForm.latitude} onChange={(e) => setLandmarkForm((prev) => ({ ...prev, latitude: e.target.value }))} />
                    </label>
                    <label>
                      <span className="admin-form-label">Longitude</span>
                      <input className="admin-input" value={landmarkForm.longitude} onChange={(e) => setLandmarkForm((prev) => ({ ...prev, longitude: e.target.value }))} />
                    </label>
                  </div>

                  <label>
                    <span className="admin-form-label">Featured Image</span>
                    <input className="admin-input" value={landmarkForm.featured_image} onChange={(e) => setLandmarkForm((prev) => ({ ...prev, featured_image: e.target.value }))} />
                  </label>

                  <div className="admin-lang-panel">
                    <LanguageTabs activeLanguage={landmarkLanguage} onChange={setLandmarkLanguage} />
                    <div className="admin-form-grid">
                      <input className="admin-input" placeholder="Name" value={landmarkTranslation.name} onChange={(e) => updateLandmarkTranslation(landmarkLanguage, 'name', e.target.value)} />
                      <textarea className="admin-textarea" placeholder="Short description" value={landmarkTranslation.short_description} onChange={(e) => updateLandmarkTranslation(landmarkLanguage, 'short_description', e.target.value)} />
                      <textarea className="admin-textarea" placeholder="Description" value={landmarkTranslation.description} onChange={(e) => updateLandmarkTranslation(landmarkLanguage, 'description', e.target.value)} />
                      <textarea className="admin-textarea" placeholder="Historical background" value={landmarkTranslation.historical_background} onChange={(e) => updateLandmarkTranslation(landmarkLanguage, 'historical_background', e.target.value)} />
                      <textarea className="admin-textarea" placeholder="Visiting tips" value={landmarkTranslation.visiting_tips} onChange={(e) => updateLandmarkTranslation(landmarkLanguage, 'visiting_tips', e.target.value)} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-5 text-sm text-white/85">
                    <label className="flex items-center gap-3"><input type="checkbox" checked={landmarkForm.is_featured} onChange={(e) => setLandmarkForm((prev) => ({ ...prev, is_featured: e.target.checked }))} /> Featured</label>
                    <label className="flex items-center gap-3"><input type="checkbox" checked={landmarkForm.is_active} onChange={(e) => setLandmarkForm((prev) => ({ ...prev, is_active: e.target.checked }))} /> Active</label>
                  </div>

                  <div className="admin-actions">
                    <button className="admin-button primary" onClick={() => void saveLandmark()}>Save Landmark</button>
                    <button className="admin-button secondary" onClick={() => setLandmarkForm(normalizeLandmark())}>Reset</button>
                    {landmarkForm.id ? <button className="admin-button danger" onClick={() => void deleteLandmark()}>Delete</button> : null}
                  </div>
                </div>
              </div>

              <div className="admin-card admin-side-list">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#D4AF37]">Landmark Records</h3>
                  <p className="admin-muted mt-2">Use the side list to switch the current landmark.</p>
                </div>
                <div className="admin-list">
                  {landmarks.length === 0 ? <EmptyList message="No landmarks loaded yet." /> : null}
                  {landmarks.map((landmark) => (
                    <button
                      type="button"
                      key={landmark.id}
                      className={`admin-list-item text-left${landmarkForm.id === landmark.id ? ' is-selected' : ''}`}
                      onClick={() => setLandmarkForm(normalizeLandmark(landmark))}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <strong>{landmark.translations.en?.name || landmark.slug}</strong>
                        <span className="admin-badge gray">{landmark.city_slug}</span>
                      </div>
                      <p className="admin-muted mt-2">{landmark.category} · {landmark.slug}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {activeSection === 'features' ? (
            <div className="admin-editor-layout">
              <div className="admin-card admin-editor-main">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold text-[#D4AF37]">Feature Editor</h2>
                    <p className="admin-muted mt-2">Read More is linked by modal slug; the other buttons are controlled by direct URLs.</p>
                  </div>
                  <button className="admin-button secondary" onClick={() => setFeatureForm(normalizeFeature())}>New Feature</button>
                </div>

                <div className="admin-form-grid">
                  <div className="admin-form-columns">
                    <label>
                      <span className="admin-form-label">City</span>
                      <select className="admin-select" value={featureForm.city_id} onChange={(e) => setFeatureForm((prev) => ({ ...prev, city_id: e.target.value }))}>
                        <option value="">Select city</option>
                        {cities.map((city) => <option key={city.id} value={city.id}>{city.translations.en?.name || city.slug}</option>)}
                      </select>
                    </label>
                    <label>
                      <span className="admin-form-label">Sort Order</span>
                      <input className="admin-input" value={featureForm.sort_order} onChange={(e) => setFeatureForm((prev) => ({ ...prev, sort_order: e.target.value }))} />
                    </label>
                    <label>
                      <span className="admin-form-label">Slug</span>
                      <input className="admin-input" value={featureForm.slug} onChange={(e) => setFeatureForm((prev) => ({ ...prev, slug: e.target.value }))} />
                    </label>
                    <label>
                      <span className="admin-form-label">Modal Slug</span>
                      <input className="admin-input" value={featureForm.modal_slug} onChange={(e) => setFeatureForm((prev) => ({ ...prev, modal_slug: e.target.value }))} />
                    </label>
                  </div>

                  <label>
                    <span className="admin-form-label">Card Image</span>
                    <input className="admin-input" value={featureForm.card_image} onChange={(e) => setFeatureForm((prev) => ({ ...prev, card_image: e.target.value }))} />
                  </label>
                  <label>
                    <span className="admin-form-label">Interactive URL</span>
                    <input className="admin-input" value={featureForm.interactive_url} onChange={(e) => setFeatureForm((prev) => ({ ...prev, interactive_url: e.target.value }))} />
                  </label>
                  <label>
                    <span className="admin-form-label">Explore Statues URL</span>
                    <input className="admin-input" value={featureForm.statues_url} onChange={(e) => setFeatureForm((prev) => ({ ...prev, statues_url: e.target.value }))} />
                  </label>

                  <div className="admin-lang-panel">
                    <LanguageTabs activeLanguage={featureLanguage} onChange={setFeatureLanguage} />
                    <div className="admin-form-grid">
                      <input className="admin-input" placeholder="Title" value={featureTranslation.title} onChange={(e) => updateFeatureTranslation(featureLanguage, 'title', e.target.value)} />
                      <textarea className="admin-textarea" placeholder="Description" value={featureTranslation.description} onChange={(e) => updateFeatureTranslation(featureLanguage, 'description', e.target.value)} />
                    </div>
                  </div>

                  <label className="flex items-center gap-3 text-sm text-white/85"><input type="checkbox" checked={featureForm.is_active} onChange={(e) => setFeatureForm((prev) => ({ ...prev, is_active: e.target.checked }))} /> Active</label>

                  <div className="admin-actions">
                    <button className="admin-button primary" onClick={() => void saveFeature()}>Save Feature</button>
                    <button className="admin-button secondary" onClick={() => setFeatureForm(normalizeFeature())}>Reset</button>
                    {featureForm.id ? <button className="admin-button danger" onClick={() => void deleteFeature()}>Delete</button> : null}
                  </div>
                </div>
              </div>

              <div className="admin-card admin-side-list">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#D4AF37]">Feature Records</h3>
                  <p className="admin-muted mt-2">The side list contains all feature cards.</p>
                </div>
                <div className="admin-list">
                  {features.length === 0 ? <EmptyList message="No features loaded yet." /> : null}
                  {features.map((feature) => (
                    <button
                      type="button"
                      key={feature.id}
                      className={`admin-list-item text-left${featureForm.id === feature.id ? ' is-selected' : ''}`}
                      onClick={() => setFeatureForm(normalizeFeature(feature))}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <strong>{feature.translations.en?.title || feature.slug}</strong>
                        <span className="admin-badge gray">{feature.city_slug}</span>
                      </div>
                      <p className="admin-muted mt-2">{feature.modal_slug || 'No modal slug'}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {activeSection === 'chapters' ? (
            <div className="admin-editor-layout">
              <div className="admin-card admin-editor-main">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold text-[#D4AF37]">Chapter Editor</h2>
                    <p className="admin-muted mt-2">Edit chapter copy by language tabs while keeping the main editor fixed.</p>
                  </div>
                  <button className="admin-button secondary" onClick={() => setChapterForm(normalizeChapter())}>New Chapter</button>
                </div>

                <div className="admin-form-grid">
                  <div className="admin-form-columns">
                    <label>
                      <span className="admin-form-label">Modal Slug</span>
                      <input className="admin-input" value={chapterForm.modal_slug} onChange={(e) => setChapterForm((prev) => ({ ...prev, modal_slug: e.target.value }))} />
                    </label>
                    <label>
                      <span className="admin-form-label">Sort Order</span>
                      <input className="admin-input" value={chapterForm.sort_order} onChange={(e) => setChapterForm((prev) => ({ ...prev, sort_order: e.target.value }))} />
                    </label>
                    <label className="sm:col-span-2">
                      <span className="admin-form-label">Slug</span>
                      <input className="admin-input" value={chapterForm.slug} onChange={(e) => setChapterForm((prev) => ({ ...prev, slug: e.target.value }))} />
                    </label>
                  </div>

                  <label>
                    <span className="admin-form-label">Images</span>
                    <textarea className="admin-textarea" value={chapterForm.images} onChange={(e) => setChapterForm((prev) => ({ ...prev, images: e.target.value }))} />
                  </label>

                  <div className="admin-lang-panel">
                    <LanguageTabs activeLanguage={chapterLanguage} onChange={setChapterLanguage} />
                    <div className="admin-form-grid">
                      <input className="admin-input" placeholder="Title" value={chapterTranslation.title} onChange={(e) => updateChapterTranslation(chapterLanguage, 'title', e.target.value)} />
                      <textarea className="admin-textarea" placeholder="Paragraphs, separated by blank lines" value={chapterTranslation.paragraphs} onChange={(e) => updateChapterTranslation(chapterLanguage, 'paragraphs', e.target.value)} />
                    </div>
                  </div>

                  <div className="admin-actions">
                    <button className="admin-button primary" onClick={() => void saveChapter()}>Save Chapter</button>
                    <button className="admin-button secondary" onClick={() => setChapterForm(normalizeChapter())}>Reset</button>
                    {chapterForm.id ? <button className="admin-button danger" onClick={() => void deleteChapter()}>Delete</button> : null}
                  </div>
                </div>
              </div>

              <div className="admin-card admin-side-list">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#D4AF37]">Chapter Records</h3>
                  <p className="admin-muted mt-2">Use the side list to find chapters under each modal slug.</p>
                </div>
                <div className="admin-list">
                  {chapters.length === 0 ? <EmptyList message="No chapters loaded yet." /> : null}
                  {chapters.map((chapter) => (
                    <button
                      type="button"
                      key={chapter.id}
                      className={`admin-list-item text-left${chapterForm.id === chapter.id ? ' is-selected' : ''}`}
                      onClick={() => setChapterForm(normalizeChapter(chapter))}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <strong>{chapter.translations.en?.title || chapter.slug}</strong>
                        <span className="admin-badge gray">{chapter.modal_slug}</span>
                      </div>
                      <p className="admin-muted mt-2">{chapter.slug}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}