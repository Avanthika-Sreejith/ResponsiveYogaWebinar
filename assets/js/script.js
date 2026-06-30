document.addEventListener('DOMContentLoaded', async () => {
  const bannerSlides = document.getElementById('bannerSlides');
  const videoGrid = document.getElementById('videoGrid');
  const classGrid = document.getElementById('classGrid');
  const testimonialItems = document.getElementById('testimonialItems');
  const classSelect = document.getElementById('classId');
  const registrationForm = document.getElementById('registrationForm');
  const formMessage = document.getElementById('formMessage');

  const { banners, testimonials, videos, classes } = await window.webinarApi.loadWebinarData();

  renderBanners(banners);
  renderVideos(videos);
  renderClasses(classes);
  renderTestimonials(testimonials);
  populateClassOptions(classes);

  registrationForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(registrationForm);
    const registration = {
      name: formData.get('name')?.toString().trim() || '',
      phone: formData.get('phone')?.toString().trim() || '',
      email: formData.get('email')?.toString().trim() || '',
      class_id: formData.get('classId')?.toString() || ''
    };

    if (!validateRegistration(registration)) {
      showMessage('Please enter a valid name, phone, email, and select a class.', false);
      return;
    }

    showMessage('Submitting your registration...', true);

    const result = await window.firebaseService.saveRegistration(registration);
    if (result.success) {
      showMessage(result.message || 'Registration saved successfully.', true);
      registrationForm.reset();
    } else {
      showMessage(result.message || 'Unable to save registration. Please try again.', false);
    }
  });

  function renderBanners(items) {
    if (!items.length) {
      bannerSlides.innerHTML = '<div class="alert alert-info">No banner data available right now.</div>';
      return;
    }

    bannerSlides.innerHTML = items.map((item, index) => `
      <div class="carousel-item ${index === 0 ? 'active' : ''}">
        <div class="hero-card d-flex align-items-center" style="background-image:url('${item.image}')">
          <div class="hero-overlay w-100 h-100 d-flex align-items-center">
            <div class="container text-white py-5">
              <p class="text-uppercase small fw-semibold mb-3">Webinar Banner</p>
              <h1 class="display-5 fw-bold">${item.title}</h1>
              <p class="lead">${item.subtitle}</p>
              <a href="#register" class="btn btn-light text-primary fw-semibold">Reserve a Spot</a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderVideos(items) {
    if (!items.length) {
      videoGrid.innerHTML = '<div class="col-12"><div class="alert alert-info">No videos available right now.</div></div>';
      return;
    }

    videoGrid.innerHTML = items.map((item) => {
      const embedUrl = getVideoEmbedUrl(item.link);
      return `
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div class="video-frame">
              <iframe src="${embedUrl}" title="Yoga video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderClasses(items) {
    if (!items.length) {
      classGrid.innerHTML = '<div class="col-12"><div class="alert alert-info">No classes available right now.</div></div>';
      return;
    }

    classGrid.innerHTML = items.map((item) => `
      <div class="col-md-6 col-xl-4">
        <div class="class-card h-100 p-4 bg-white">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <span class="badge bg-primary-subtle text-primary">${item.type}</span>
            <span class="fw-bold text-primary">₹${item.amount}</span>
          </div>
          <h4 class="fw-semibold">${item.title}</h4>
          <p class="text-muted mb-2">${item.subtitle}</p>
          <p class="small text-muted">${item.description}</p>
          <div class="small text-muted mb-3">
            <div><i class="fa-solid fa-calendar-days me-2"></i>${item.date}</div>
            <div><i class="fa-solid fa-clock me-2"></i>${item.start_time} - ${item.end_time}</div>
            <div><i class="fa-solid fa-location-dot me-2"></i>${item.place}</div>
          </div>
          <a href="#register" class="btn btn-outline-primary w-100">Book this class</a>
        </div>
      </div>
    `).join('');
  }

  function renderTestimonials(items) {
    if (!items.length) {
      testimonialItems.innerHTML = '<div class="alert alert-info">No testimonials available right now.</div>';
      return;
    }

    testimonialItems.innerHTML = items.map((item, index) => `
      <div class="carousel-item ${index === 0 ? 'active' : ''}">
        <div class="testimonial-card p-4 p-md-5 shadow-sm">
          <div class="d-flex align-items-center mb-3">
            <img src="${item.image}" alt="${item.name}" class="rounded-circle me-3" width="60" height="60" />
            <div>
              <h5 class="mb-0">${item.name}</h5>
              <span class="small text-muted">Yoga Student</span>
            </div>
          </div>
          <p class="mb-0 text-muted">“${item.comment}”</p>
        </div>
      </div>
    `).join('');
  }

  function populateClassOptions(items) {
    classSelect.innerHTML = items.length
      ? items.map((item) => `<option value="${item.id}">${item.title}</option>`).join('')
      : '<option value="">No classes available</option>';
  }

  function validateRegistration(data) {
    const nameOk = data.name.length >= 2;
    const phoneOk = /^\d{10}$/.test(data.phone);
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    const classOk = Boolean(data.class_id);
    return nameOk && phoneOk && emailOk && classOk;
  }

  function showMessage(message, isSuccess) {
    formMessage.className = `mt-3 small ${isSuccess ? 'status-success' : 'status-error'}`;
    formMessage.textContent = message;
  }

  function getVideoEmbedUrl(link) {
    if (!link) return 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    const videoIdMatch = link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (videoIdMatch?.[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return link;
  }
});
