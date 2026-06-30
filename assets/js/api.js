const apiBase = 'https://ht-admin-api-stg.bienapp.in/api/home/webinar';

const fallbackData = {
  banners: [
    {
      id: 'fallback-1',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=80',
      title: 'Refresh Your Body and Mind',
      subtitle: 'A calm and energizing webinar for mindful yoga practice.'
    }
  ],
  testimonials: [
    {
      id: 'fallback-testimonial-1',
      name: 'Maya Rao',
      comment: 'The classes helped me build balance, calm, and confidence in just a few weeks.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
    }
  ],
  videos: [
    {
      id: 'fallback-video-1',
      link: 'https://www.youtube.com/watch?v=V1Pl8CzNZj4'
    }
  ],
  classes: [
    {
      id: 'fallback-class-1',
      title: 'Yoga Fundamentals',
      subtitle: 'Learn breathing and alignment from scratch.',
      description: 'A gentle introduction to posture, breathing and mindful movement for beginners.',
      type: 'Online',
      amount: 100,
      date: '2026-07-07',
      start_time: '06:00 AM',
      end_time: '09:00 AM',
      place: 'Online'
    }
  ]
};

function normalizeBanner(info = []) {
  return info.map((item) => ({
    id: item.id || item._id,
    image: item.image || '',
    title: item.title || 'Yoga Webinar',
    subtitle: item.subtitle || 'A guided practice for harmony and wellness.'
  })).filter((item) => item.image);
}

function normalizeTestimonials(info = []) {
  return info.map((item) => ({
    id: item.id || item._id,
    name: item.name || 'Happy Student',
    comment: item.comment || 'Loved this experience.',
    image: item.image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
  })).filter((item) => item.name);
}

function normalizeVideos(info = []) {
  return info.map((item) => ({
    id: item.id || item._id,
    link: item.link || ''
  })).filter((item) => item.link);
}

function normalizeClasses(info = []) {
  return info.map((item) => ({
    id: item.id || item._id,
    title: item.title || 'Yoga Class',
    subtitle: item.subtitle || 'A transformative class',
    description: item.description || 'Join a curated yoga experience.',
    type: item.type || 'Online',
    amount: item.amount || 0,
    date: item.date || '',
    start_time: item.start_time || '',
    end_time: item.end_time || '',
    place: item.place || 'Online'
  })).filter((item) => item.title);
}

async function fetchJson(url) {
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Falling back to local webinar content.', error);
    return null;
  }
}

async function loadWebinarData() {
  const [bannerResp, testimonialResp, videoResp, classResp] = await Promise.all([
    fetchJson(`${apiBase}/banner-list`),
    fetchJson(`${apiBase}/testimonial-list`),
    fetchJson(`${apiBase}/video-list`),
    fetchJson(`${apiBase}/class-list`)
  ]);

  const banners = normalizeBanner(bannerResp?.info || fallbackData.banners);
  const testimonials = normalizeTestimonials(testimonialResp?.info || fallbackData.testimonials);
  const videos = normalizeVideos(videoResp?.info || fallbackData.videos);
  const classes = normalizeClasses(classResp?.info || fallbackData.classes);

  return { banners, testimonials, videos, classes };
}

window.webinarApi = { loadWebinarData };
