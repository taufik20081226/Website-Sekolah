document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) {
    AOS.init({ offset: 70, duration: 700, easing: 'ease-out-cubic', once: true, mirror: false });
  }

  const nav = document.querySelector('.navbar');
  const topBtn = document.querySelector('.back-top');
  const onScroll = () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
    if (topBtn) topBtn.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (topBtn) topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const profileDropdown = document.querySelector('.profile-dropdown');
  const profileToggle = document.querySelector('.profile-dropdown-toggle');

  const pageKey = document.body.dataset.page || '';
  const pageLabels = {
    profil: 'Profil',
    'visi-misi': 'Visi & Misi',
    struktur: 'Struktur Organisasi'
  };
  const profileLabel = profileToggle?.querySelector('.profile-current-label');
  if (profileLabel && pageLabels[pageKey]) profileLabel.textContent = pageLabels[pageKey];

  const closeProfileDropdown = () => {
    if (!profileDropdown || !profileToggle) return;
    profileDropdown.classList.remove('open');
    profileToggle.setAttribute('aria-expanded', 'false');
  };

  if (profileDropdown && profileToggle) {
    profileToggle.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const shouldOpen = !profileDropdown.classList.contains('open');

      document.querySelectorAll('.profile-dropdown.open').forEach(dropdown => {
        dropdown.classList.remove('open');
      });

      profileDropdown.classList.toggle('open', shouldOpen);
      profileToggle.setAttribute('aria-expanded', String(shouldOpen));
    });

    profileDropdown.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        closeProfileDropdown();

        const openNav = document.querySelector('#mainNav.show');
        if (openNav && window.bootstrap) {
          const collapse = bootstrap.Collapse.getInstance(openNav) ||
            new bootstrap.Collapse(openNav, { toggle: false });
          collapse.hide();
        }
      });
    });

    document.addEventListener('click', (event) => {
      if (!profileDropdown.contains(event.target)) {
        closeProfileDropdown();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeProfileDropdown();
        profileToggle.focus();
      }
    });

    profileDropdown.addEventListener('focusout', (event) => {
      window.setTimeout(() => {
        if (!profileDropdown.contains(document.activeElement)) {
          closeProfileDropdown();
        }
      }, 0);
    });
  }

  const filters = document.querySelectorAll('[data-filter]');
  const galleryItems = document.querySelectorAll('[data-category]');
  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const value = btn.dataset.filter;
    galleryItems.forEach(item => item.classList.toggle('d-none', value !== 'all' && item.dataset.category !== value));
    if (window.AOS) AOS.refresh();
  }));

  const searchInput = document.querySelector('#newsSearch');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      document.querySelectorAll('[data-news-item]').forEach(item => item.classList.toggle('d-none', !item.textContent.toLowerCase().includes(q)));
    });
  }

  document.querySelectorAll('form[data-demo-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const alert = form.querySelector('.form-alert');
      if (alert) alert.classList.remove('d-none');
      form.reset();
    });
  });
});
